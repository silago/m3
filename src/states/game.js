
class Game extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    this.grid = new jMatch3.Grid({
        width: 6,
        height: 7,
        gravity: "down"
    });

    this.types = [
            0,
            1,
            2
        ];
    

    this.prepareGrid = function() {
        this.grid.forEachPiece((piece) => {
            //console.log(piece);
            var type_index = this.types[Math.floor(Math.random() * this.types.length)];
            piece._clear = function() {
                this.object.image.destroy();
                this.object.image = null; 
                this.clear();
            }
            piece.object = {
                'type': type_index, 
                'image': this.game.add.sprite(piece.x*100,piece.y*100,'gems',type_index)
            }

            piece.object.image.inputEnabled = true;
            piece.object.image.events.onInputDown.add(
              ()=> {this.swap(piece);}
            , this);
            
        });
    }

    this.swap_stack = [];
    this.swap = function(i) {
       this.swap_stack.push(i);
       if (this.swap_stack.length<2) {
         return;
       }
       this.grid.swapPieces(this.swap_stack[0],this.swap_stack[1]);
       var updated = false;
       this.grid.forEachMatch((m)=>{
           updated = true;
           m.forEach((i) => {
            i._clear();
           });
       }); 
       if (updated) {
        this.grid.applyGravity();
        this.prepareGrid();
       }
       this.swap_stack = [];
    }
    //this.input.onDown.add(this.endGame, this);

    this.prepareGrid();
  }

  update() {
  }

  endGame() {
    this.game.state.start('gameover');
  }

}

export default Game;
