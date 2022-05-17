const Board = class Board {
  constructor(BoardCase) {
      this.board = BoardCase;
  }

  InnerSymboleInCase() {
      this.board.addEventListener('click', () => {
          game.Turn(this.board); // A qui le tour !
          timer.start();
      });
  }
}

const Player = class Player {
  constructor(symbole) {
      this.symbole = symbole;
  };
}

class Timer {
  constructor () {
      this.isRunning = false;
      this.startTime = 0;
      this.overallTime = 0;
  }

  _getTimeElapsedSinceLastStart () {
      if (!this.startTime) {
          return 0;
      }

      return Date.now() - this.startTime;
  }

  start () {
      if (this.isRunning) {
          return console.error('Timer is already running');
      }

      this.isRunning = true;

      this.startTime = Date.now();
  }

  stop () {
      if (!this.isRunning) {
          return console.error('Timer is already stopped');
      }

      this.isRunning = false;

      this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();

      if (Game.verifyIfEnd()) {
          this.isRunning = false;
          this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
      }
  }

  reset () {
      this.overallTime = 0;

      if (this.isRunning) {
          this.startTime = Date.now();
          return;
      }

      this.startTime = 0;
  }

  getTime () {
      if (!this.startTime) {
          return 0;
      }

      if (this.isRunning) {
          return this.overallTime + this._getTimeElapsedSinceLastStart();
      }

      return this.overallTime;
  }
}

const Game = class Game {
  
  arrayCase = [];
  winPlayer1 = 0;
  winPlayer2 = 0;

  player1 = new Player('<i class="fa-solid fa-x fa-3x"></i>');
  player2 = new Player('<i class="fa-solid fa-o fa-3x"></i>');

  game = true;

  winner = 0;

  constructor() {
      this.currentTurn = 0;
  }

  startGame() {
      let Cases = document.querySelectorAll('.case');

      Cases.forEach(Cases => {
          this.arrayCase.push(new Board(Cases));
      });

      this.arrayCase.forEach(Cases => {
          Cases.InnerSymboleInCase();
      });

  }

  RestartGame() {
      let Button = document.getElementById('restartbtn');

      Button.addEventListener('click', () => {
          let Cases = document.querySelectorAll('.case');

          Cases.forEach(Cases => {
              Cases.innerHTML = ''; // Reset Cases after Game Onclick !
          });

          game.game = true; // Restart Game !

          game.winner = 0; // Implement Score !

          game.displayStepOfGame(); // Show Step Of Game (Who play etc) !

          timer.reset();
          timer.stop();
      })
  }

  ifAllCasesAreBusy() {
      let Cases = document.querySelectorAll('.case');

      let count = 0; // know number of Case use !

      for (const nodeCase of Cases) {
          if (nodeCase.innerHTML[0] != undefined) {
              count++;
          };
      };

      if (count === Cases.length) {
          return true;
      };
  }

  displayStepOfGame() {
      let alert = document.querySelector('.alert-step');

      if (this.winner == 1) {
          alert.innerHTML = 'Le joueur <span class="text-red-500">1</span> a gagné !!!';
          timer.stop();
      } else if (this.winner == 2) {
          alert.innerHTML = 'Le joueur <span class="text-blue-500">2</span> a gagné !!!';
          timer.stop();
      } else if (this.ifAllCasesAreBusy()) {
          alert.innerHTML = 'Match Nul.';
          timer.stop();
      } else if (this.currentTurn % 2 === 0) {
          alert.innerHTML = 'Le joueur <span class="text-red-500">1</span> doit jouer !';
      } else if (this.currentTurn % 2 != 0) {
          alert.innerHTML = 'Le joueur <span class="text-blue-500">2</span> doit jouer !';
      }
  }

  Turn(theCase) {
      let alertBusy = document.querySelector('.alert-busy');

      if (this.game) {

          if (!theCase.innerHTML[0]) {

              if (this.currentTurn % 2 === 0) {
                  theCase.innerHTML = this.player1.symbole;
              } else {
                  theCase.innerHTML = this.player2.symbole;
              }
              this.currentTurn++;

              this.verifyIfEnd();
              this.displayStepOfGame();

              alertBusy.style.display = 'none';
          } else {
              alertBusy.style.display = 'block';
          }
      }
  }

  getPositionOfPlayerCases() { // know or the player to click

      let Cases = document.querySelectorAll('.case');

      let casePlayer1 = [];
      let casePlayer2 = [];

      for (const nodeCase of Cases) {
          if (nodeCase.innerHTML === this.player1.symbole) {
              casePlayer1.push(nodeCase.dataset.location);
          } else if (nodeCase.innerHTML === this.player2.symbole) {
              casePlayer2.push(nodeCase.dataset.location);
          }
      }

      return [casePlayer1, casePlayer2]
  }

  verifyIfEnd() {

      let casePlayer1 = this.getPositionOfPlayerCases()[0];
      let casePlayer2 = this.getPositionOfPlayerCases()[1];


      if (casePlayer1.includes('A1') && casePlayer1.includes('B1') && casePlayer1.includes('C1') || casePlayer1.includes('A2') && casePlayer1.includes('B2') && casePlayer1.includes('C2') || casePlayer1.includes('A3') && casePlayer1.includes('B3') && casePlayer1.includes('C3') || casePlayer1.includes('A1') && casePlayer1.includes('A2') && casePlayer1.includes('A3') || casePlayer1.includes('B1') && casePlayer1.includes('B2') && casePlayer1.includes('B3') || casePlayer1.includes('C1') && casePlayer1.includes('C2') && casePlayer1.includes('C3') || casePlayer1.includes('A1') && casePlayer1.includes('B2') && casePlayer1.includes('C3') || casePlayer1.includes('A3') && casePlayer1.includes('B2') && casePlayer1.includes('C1')) {

          this.winPlayer1++; // implement Score of player 1 if win Game !

          this.displayWin(); // implement score in function !

          this.game = false; // Stop Game !

          this.winner = 1; // Set win at Player One !

      } else if (casePlayer2.includes('A1') && casePlayer2.includes('B1') && casePlayer2.includes('C1') || casePlayer2.includes('A2') && casePlayer2.includes('B2') && casePlayer2.includes('C2') || casePlayer2.includes('A3') && casePlayer2.includes('B3') && casePlayer2.includes('C3') || casePlayer2.includes('A1') && casePlayer2.includes('A2') && casePlayer2.includes('A3') || casePlayer2.includes('B1') && casePlayer2.includes('B2') && casePlayer2.includes('B3') || casePlayer2.includes('C1') && casePlayer2.includes('C2') && casePlayer2.includes('C3') || casePlayer2.includes('A1') && casePlayer2.includes('B2') && casePlayer2.includes('C3') || casePlayer2.includes('A3') && casePlayer2.includes('B2') && casePlayer2.includes('C1')) {

          this.winPlayer2++; // implement Score of player 2 if win Game !

          this.displayWin(); // implement score in function !

          this.game = false; // Stop Game !

          this.winner = 2; // Set win at Player Two !
      }

  }

  displayWin() {
      let victoriesOfPlayer1 = document.querySelector('.victories-1');
      let victoriesOfPlayer2 = document.querySelector('.victories-2');

      victoriesOfPlayer1.innerHTML = this.winPlayer1; // init ScoreBoard with Point Of Game !
      victoriesOfPlayer2.innerHTML = this.winPlayer2;
  }
}

setInterval(() => {
  function pad(number) {
      return number < 10 ? '0' + number : number;
  }
  const timeInSeconds = Math.round(timer.getTime() / 1000);
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds - minutes * 60;
  document.getElementById('timer-minutes').innerText = pad(minutes);
  document.getElementById('timer-seconds').innerText = pad(seconds);
}, 100)


const timer = new Timer();
const game = new Game(); // Implement Game !

game.startGame(); // Start The Game !
game.RestartGame(); // activate the restart button !



