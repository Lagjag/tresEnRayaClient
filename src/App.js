import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Fila from "./Componentes/Fila";
import "./Estilos/Principal.css";

var mapaSimbolos = {
  2: ["marking", "32"],
  0: ["marking marking-x", 9587],
  1: ["marking marking-o", 9711]
};

var patrones = [
  //horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //diagonal
  [0, 4, 8],
  [2, 4, 6]
];

var AIScore = { 2: 1, 0: 2, 1: 0 };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      estadoTablero: new Array(9).fill(2),
      turn: 0,
      active: true,
      mode: "AI"
    };
    this.handleNewMove = this.handleNewMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.procesarTablero = this.procesarTablero.bind(this);
    this.movimientoIA = this.movimientoIA.bind(this);
  }

  procesarTablero() {
    var won = false;
    patrones.forEach(pattern => {
      var firstMark = this.state.estadoTablero[pattern[0]];

      if (firstMark !== 2) {
        var marks = this.state.estadoTablero.filter((mark, index) => {
          return pattern.includes(index) && mark === firstMark; //looks for marks matching the first in pattern's index
        });

        if (marks.length === 3) {
          document.querySelector("#mensaje1").innerHTML =
            String.fromCharCode(mapaSimbolos[marks[0]][1]) + " wins!";
          document.querySelector("#mensaje1").style.display = "block";
          pattern.forEach(index => {
            var id = index + "-" + firstMark;
            document.getElementById(id).parentNode.style.background = "#d4edda";
          });
          this.setState({ active: false });
          won = true;
        }
      }
    });

    if (!this.state.estadoTablero.includes(2) && !won) {
      document.querySelector("#mensaje2").innerHTML = "Game Over - It's a draw";
      document.querySelector("#mensaje2").style.display = "block";
      this.setState({ active: false });
    } else if (this.state.mode === "AI" && this.state.turn === 1 && !won) {
      this.movimientoIA();
    }
  }

  movimientoIA() {
    var emptys = [];
    var scores = [];
    this.state.estadoTablero.forEach((mark, index) => {
      if (mark === 2) emptys.push(index);
    });

    emptys.forEach(index => {
      var score = 0;
      patrones.forEach(pattern => {
        if (pattern.includes(index)) {
          var xCount = 0;
          var oCount = 0;
          pattern.forEach(p => {
            if (this.state.estadoTablero[p] === 0) xCount += 1;
            else if (this.state.estadoTablero[p] === 1) oCount += 1;
            score += p === index ? 0 : AIScore[this.state.estadoTablero[p]];
          });
          if (xCount >= 2) score += 10;
          if (oCount >= 2) score += 20;
        }
      });
      scores.push(score);
    });

    var maxIndex = 0;
    scores.reduce(function(maxVal, currentVal, currentIndex) {
      if (currentVal >= maxVal) {
        maxIndex = currentIndex;
        return currentVal;
      }
      return maxVal;
    });
    this.handleNewMove(emptys[maxIndex]);
  }

  handleReset(e) {
    if (e) e.preventDefault();
    document
      .querySelectorAll(".alert")
      .forEach(el => (el.style.display = "none"));
    this.setState({
      estadoTablero: new Array(9).fill(2),
      turn: 0,
      active: true
    });
  }
  handleNewMove(id) {
    console.log("id:"+ typeof this.state.estadoTablero
    .slice(0, id)
    .concat(this.state.turn)
    .concat(this.state.estadoTablero.slice(id + 1)));
    console.log("turno: "+(this.state.turn + 1) % 2 );
    this.setState(
      prevState => {
        return {
          estadoTablero: prevState.estadoTablero
            .slice(0, id)
            .concat(prevState.turn)
            .concat(prevState.estadoTablero.slice(id + 1)),
          turn: (prevState.turn + 1) % 2
        };
      },
      () => {
        this.procesarTablero();
      }
    );
  }

  handleModeChange(e) {
    e.preventDefault();
    if (e.target.getAttribute("href").includes("AI")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#twop").style.background = "none";
      this.setState({ mode: "AI" });
      this.handleReset(null);
    } else if (e.target.getAttribute("href").includes("2P")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#ai").style.background = "none";
      this.setState({ mode: "2P" });
      this.handleReset(null);
    }
  }

  render() {
    const rows = [];
    for (var i = 0; i < 3; i++)
      rows.push(
        <Fila
          key={i}
          row={i}
          estadoTablero={this.state.estadoTablero}
          onNewMove={this.handleNewMove}
          active={this.state.active}
        />
      );
    return (
      <div>
        <div className="container jumbotron" id="container">
          <h3>TRES EN RAYA</h3>
          <p>
            <a href="./?AI" onClick={this.handleModeChange} id="ai">
              Contra IA
            </a>{" "}
            ||
            <a href="./?2P" onClick={this.handleModeChange} id="twop">
              {" "}
              2 Jugadores
            </a>{" "}
            ||
            <button href="#" onClick={this.handleReset}>
              {" "}
              Reset board
            </button>
          </p>
          <p>{String.fromCharCode(mapaSimbolos[this.state.turn][1])}'s turn</p>
          <div className="board">{rows}</div>
          <p className="alert alert-success" role="alert" id="mensaje1"></p>
          <p className="alert alert-info" role="alert" id="mensaje2"></p>
        </div>
      </div>
    );
  }
}

export default App;

