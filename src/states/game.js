
class Game extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    //var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5, 'Game', {
    //  font: '42px Arial', fill: '#ffffff', align: 'center'
    //});
    //text.anchor.set(0.5);
    //
    this.grid = new jMatch3.Grid({
        width: 6,
        height: 7,
        gravity: "down"
    });

    console.log(this.grid);
    this.types = [
            0,
            1,
            2
        ];
    
    this.grid.forEachPiece((piece) => {
        //console.log(piece);
        var type_index = this.types[Math.floor(Math.random() * this.types.length)];
        piece.clear = function() {
            this.object.image.destroy();
            this.object.type = "empty";// = null;//voidObject;

        }
        piece.object = {
            'type': type_index, 
            'image': this.game.add.sprite(piece.x*100,piece.y*100,'gems',type_index)
        }
        
    });
    this.grid.debug({
        empty:'-',
        0:'0',
        1:'1',
        2:'2'
    });


    this.input.onDown.add(this.endGame, this);
  }

  update() {

  }

  endGame() {
    this.game.state.start('gameover');
  }

}

export default Game;
