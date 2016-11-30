import MatchPhaserGrid from '../lib/match3phaser';

class Game extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    this.grid = new MatchPhaserGrid(this.game,{
        width: 9,
        height: 9,
        gravity: "down",
        info:{sprites:{x:50,y:50}},
        types: [
               { key:0, texture:'gems', frame:0,score:10},
               { key:1, texture:'gems', frame:1,score:20},
               { key:2, texture:'gems', frame:2,score:30},
        ]
    });
    this.grid.init();
  }
}

export default Game;
