import React from "react";
import axios from 'axios';
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
      idTablero: '',
      estadoTablero: new Array(9).fill(2),
      turno: 0,
      active: true,
      modo_juego: "IA"
    };
    this.nuevoMovimiento = this.nuevoMovimiento.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.procesarTablero = this.procesarTablero.bind(this);
    this.movimientoIA = this.movimientoIA.bind(this);
  }

  componentDidMount(){

    const BASE_URL = process.env.REACT_APP_API_SYMFONY;

    axios.get(BASE_URL+'recuperar_tablero')
    .then((response) => {

      console.log(response.data);
      if(response.data.tablero !== '' && response.data.turno !== '' && response.data.modo_juego !== '' && response.data.existe !== false){
        this.setState({
          idTablero: response.data.id,
          estadoTablero: response.data.tablero,
          turno: response.data.turno,
          modo_juego: response.data.modo_juego
        });
      }else{
        axios.post(BASE_URL+'crear_tablero', this.state.estadoTablero)
        .then(res => console.log(res.data));
      }
    })
    .catch(function (error) {

      console.log(error);
    })
  }

  procesarTablero() {

    const BASE_URL = process.env.REACT_APP_API_SYMFONY;
    const tablero = {
      estado: this.state.estadoTablero,
      turno: this.state.turno,
      modo_juego: this.state.modo_juego
    }
    axios.put(BASE_URL+'modificar_tablero', tablero)
        .then((response) => { 
          
          if(response.data.casillasGanadoras !== ''){
            document.querySelector("#mensaje1").innerHTML =
            String.fromCharCode(mapaSimbolos[response.data.casillasMarcadas[0]][1]) + " gana!";
            document.querySelector("#mensaje1").style.display = "block";
            console.log(response.data.casillasGanadoras);
            response.data.casillasGanadoras.forEach(id => {
              document.getElementById(id).parentNode.style.background = "#d4edda";
            });
            this.setState({ active: false });
          }
          
          if(response.data.movimiento === 'empatado'){
            document.querySelector("#mensaje2").innerHTML = "Empate, fin del juego";
            document.querySelector("#mensaje2").style.display = "block";
            this.setState({ active: false });
          }else if(response.data.movimiento === 'IA'){
            this.movimientoIA();
          }

        });
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
    this.nuevoMovimiento(emptys[maxIndex]);
  }

  handleReset(e) {
    if (e) e.preventDefault();
    document
      .querySelectorAll(".alert")
      .forEach(el => (el.style.display = "none"));
    this.setState({
      estadoTablero: new Array(9).fill(2),
      turno: 0,
      active: true
    });
  }
  nuevoMovimiento(id) {
    const BASE_URL = process.env.REACT_APP_API_SYMFONY;

    const tablero = {
      idCasilla: id,
      estado: this.state.estadoTablero,
      turno: this.state.turno,
      modo_juego: this.state.modo_juego,
      accion: 'nuevoMovimiento'
    }
    axios.put(BASE_URL+'grabar_tablero/'+this.state.idTablero, tablero)
        .then((response) => { 
          console.log(response);
        });
    this.setState(
      prevState => {
        return {
          estadoTablero: prevState.estadoTablero
            .slice(0, id)
            .concat(prevState.turno)
            .concat(prevState.estadoTablero.slice(id + 1)),
          turno: (prevState.turno + 1) % 2
        };
      },
      () => {
        this.procesarTablero();
      }
    );
  }

  handleModeChange(e) {
    e.preventDefault();
    if (e.target.getAttribute("href").includes("IA")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#twop").style.background = "none";
      this.setState({ modo_juego: "IA" });
      this.handleReset(null);
    } else if (e.target.getAttribute("href").includes("2J")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#ia").style.background = "none";
      this.setState({ modo_juego: "2J" });
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
          onNewMove={this.nuevoMovimiento}
          active={this.state.active}
        />
      );
    return (
      <div>
        <div className="container jumbotron" id="container">
          <h3>TRES EN RAYA</h3>
          <p>
            <a href="./?IA" onClick={this.handleModeChange} id="ia">
              Contra IA
            </a>{" "}
            ||
            <a href="./?2J" onClick={this.handleModeChange} id="twop">
              {" "}
              2 Jugadores
            </a>{" "}
            ||
            <button href="#" onClick={this.handleReset}>
              {" "}
              Limpiar tablero
            </button>
          </p>
          <p>Turno del jugador {String.fromCharCode(mapaSimbolos[this.state.turno][1])}</p>
          <div className="board">{rows}</div>
          <p className="alert alert-success" role="alert" id="mensaje1"></p>
          <p className="alert alert-info" role="alert" id="mensaje2"></p>
        </div>
      </div>
    );
  }
}

export default App;

