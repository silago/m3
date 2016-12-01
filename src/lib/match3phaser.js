class MatchPhaserGrid extends jMatch3.Grid {
    constructor(game,options) {
        super(options);
        this.fall_speed = 200;
        this.parent = jMatch3.Grid;
        this.types = options.types;
        this.game = game;
        this.options = options;
        this.info = options.info;
        this.stack = [];
        this.score = 0;
        this.label = this.game.add.text((this.info.sprites.x)*(2+options.width), options.height*this.info.sprites.y/2, '0', {
          font: '42px Arial', fill: '#ffffff', align: 'center'
        });
        this.label.anchor.set(0.5);

    }

    init() {
        this.movePieces(this.initPieces(),['y']).then(() => {
              return this.fallPieces();
        });
    }
   
    updateHud() {
        this.label.text=this.score;
    }
    updateScore(i) {
        if (i)  {
            this.score+=i;
        }
    }
    fallPieces() {
        return new Promise((resolve,reject)=>{
           var updated = false;
                this.getAxisMatches().forEach((m)=>{
                    this.updateScore(m[0].object.score*m.length);
                    updated = true;
                    m.forEach((i) => {
                        i._clear();
                    });
               }); 
           if (updated) {
               this.updateHud();
               var _ = [].concat( 
                   this.applyGravity(),
                   );
               this.movePieces(_,['y']).then(() => {
                    this.movePieces(this.initPieces(),['y']).then(() => {
                        return this.fallPieces();
                    });
               });
           } else {
               resolve();
           }
        });
    }

    swap(i) {
       this.stack.push(i);
       if (this.stack.length!=2) {
         return;
       }
       if (Math.abs(this.stack[0].x-this.stack[1].x) + Math.abs(this.stack[0].y-this.stack[1].y)!=1) {
       this.stack = [];
        return;
       }
       this.swapPieces(this.stack[0],this.stack[1]);
           this.movePieces(this.stack,['x','y'])
               .then(() => {return this.fallPieces()})
               .then(() => grid.initPieces());
       this.stack = [];
    }



    movePieces(pieces,prop) {
        var promises = [];
        pieces.forEach((piece) => {
            for (let p of prop) {
                let dir = {}
                dir[p]=piece[p]*this.info.sprites.x;
                promises.push(this.moveOnePiece(piece,dir));
            }
        });
        return Promise.all(promises);
    }



    moveOnePiece(piece,target) {
            return new Promise((resolve,reject) => {
                let t = this.game.add.tween(
                    piece.object.image
                ).to(target,this.fall_speed);
                t.frameBased = false;
                t.onComplete.add(()=>{
                    piece.object.image.events.onInputDown.removeAll();
                    piece.object.image.events.onInputDown.add(
                      ()=> {this.swap(piece);}
                    , this);

                    resolve();
                });
                t.start();
            });
    }

    initPieces() {
        var new_pieces  = [];
        this.forEachPiece((piece) => {
            if (piece.object.type!='empty') {
                return;
            }
            new_pieces.push(piece);
            //console.log(piece);
            var type_index = Math.floor(Math.random() * this.types.length);
            piece._clear = function() {
                if (typeof this.object.image != 'undefined') {
                    this.object.image.destroy();
                    this.object.image = null; 
                }
                this.clear();
            }
            piece.object = {
                'type': type_index, 
                'score': this.types[type_index].score,
                'image': this.game.add.sprite(piece.x*this.info.sprites.x,(-1+piece.y-this.options.width)*this.info.sprites.y,this.types[type_index].texture,this.types[type_index].frame)
            }

            piece.object.image.inputEnabled = true;
            piece.object.image.events.onInputDown.removeAll();
            piece.object.image.events.onInputDown.add(
              ()=> {this.swap(piece);}
            , this);
        });
        return new_pieces;
    }


    getAxisMatches(callback) {
        //this.forEachMatch(callback);
        //return;
        var save_directions = this.parent.directions;

        var _directions = {
            x:{up: {
                x: 0,
                y: -1
            },
            down: {
                x: 0,
                y: 1
            }},
            y:{right: {
                x: 1,
                y: 0
            },
            left: {
                x: -1,
                y: 0
            }}
        };
        var result = [];
        for (var axis of ['x','y']) {
            this.parent.directions = _directions[axis]

            var matches = this.getMatches();
            this.parent.directions = save_directions;
            if (matches) {
                result = [].concat(result,matches);
                //for (var i in matches) {
                //    var match = matches[i];
                //    callback(match, match[0].object.type);
                //}
            }

        }
        return result;
    };

}

export default MatchPhaserGrid;
