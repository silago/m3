
class Game extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    this.grid = new jMatch3.Grid({
        width: 4,
        height: 4,
        gravity: "down"
    });

    this.types = [
            0,
            1,
            2
        ];
   
    this.moveOnePiece = function(piece,target) {
            return new Promise((resolve,reject) => {
                let t = this.game.add.tween(
                    piece.object.image
                ).to(target,100);
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

    this.movePieces  = function(pieces,prop) {
        var promises = [];
        pieces.forEach((piece) => {
            for (let p of prop) {
                let dir = {}
                dir[p]=piece[p]*100;
                promises.push(this.moveOnePiece(piece,dir));
            }
        });
        return Promise.all(promises);
    }

    this.prepareGrid = function() {
        var new_pieces  = [];
        this.grid.forEachPiece((piece) => {
            if (piece.object.type!='empty') {
                return;
            }
            new_pieces.push(piece);
            //console.log(piece);
            var type_index = this.types[Math.floor(Math.random() * this.types.length)];
            piece._clear = function() {
                this.object.image.destroy();
                this.object.image = null; 
                this.clear();
            }
            piece.object = {
                'type': type_index, 
                'image': this.game.add.sprite(piece.x*100,piece.y*100-400,'gems',type_index)
            }

            piece.object.image.inputEnabled = true;
            piece.object.image.events.onInputDown.removeAll();
            piece.object.image.events.onInputDown.add(
              ()=> {this.swap(piece);}
            , this);
        });
        return new_pieces;
    }

    this.swap_stack = [];
    this.fallPieces = function() {
        return new Promise((resolve,reject)=>{
           var updated = false;
                this.grid.forEachMatch((m)=>{
               updated = true;
               m.forEach((i) => {
                i._clear();
               });
           }); 
           if (updated) {
               var _ = [].concat( 
                   this.grid.applyGravity(),
                   //this.prepareGrid()
                   );
               this.movePieces(_,['y']).then(() => {
                    this.movePieces(this.prepareGrid(),['y']).then(() => {
                        return this.fallPieces();
                    });
               });
           } else {
               resolve();
           }
        });
    }

    this.swap = function(i) {
       this.swap_stack.push(i);
       if (this.swap_stack.length!=2) {
         return;
       }
       if (Math.abs(this.swap_stack[0].x-this.swap_stack[1].x) + Math.abs(this.swap_stack[0].y-this.swap_stack[1].y)!=1) {
       this.swap_stack = [];
        return;
       }
       this.grid.swapPieces(this.swap_stack[0],this.swap_stack[1]);
           this.movePieces(this.swap_stack,['x','y'])
               .then(() => {return this.fallPieces()})
               .then(() => this.prepareGrid());
           console.log(this.swap_stack[1].object.image.x);
       this.swap_stack = [];
       //return;
       //setTimeout(()=>{
       //     this.prepareGrid();
       //},2000);
       this.swap_stack = [];
    }
    //this.input.onDown.add(this.endGame, this);



    this.movePieces(this.prepareGrid(),['y']).then(() => {
          return this.fallPieces();
    });

  }

  update() {
  }

  endGame() {
    this.game.state.start('gameover');
  }

}

export default Game;
