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
    this.reinicio = this.reinicio.bind(this);
    this.cambioDeModo = this.cambioDeModo.bind(this);
    this.procesarTablero = this.procesarTablero.bind(this);
    this.movimientoIA = this.movimientoIA.bind(this);
  }

  render() {
    const filas = [];
    for (var i = 0; i < 3; i++)
      filas.push(
        <Fila
          key={i}
          row={i}
          estadoTablero={this.state.estadoTablero}
          enNuevoMovimiento={this.nuevoMovimiento}
          active={this.state.active}
        />
      );
    return (
      <div>
        <div className="container jumbotron" id="contenedor">
          <h3>TRES EN RAYA</h3>
          <p>
            <a href="./?IA" onClick={this.cambioDeModo} id="ia">
              Contra IA
            </a>{" "}
            ||
            <a href="./?2J" onClick={this.cambioDeModo} id="dosj">
              {" "}
              2 Jugadores
            </a>{" "}
            ||
            <button href="#" onClick={this.reinicio}>
              {" "}
              Limpiar tablero
            </button>
          </p>
          <p>Turno del jugador {String.fromCharCode(mapaSimbolos[this.state.turno][1])}</p>
          <div className="tablero">{filas}</div>
          <p className="alert alert-success" role="alert" id="mensaje1"></p>
          <p className="alert alert-info" role="alert" id="mensaje2"></p>
        </div>
      </div>
    );
  }

  componentDidMount(){

    const BASE_URL = process.env.REACT_APP_API_SYMFONY;

    axios.get(BASE_URL+'recuperar_tablero')
    .then((response) => {

      if(response.data.tablero !== '' && response.data.turno !== '' && response.data.modo_juego !== '' && response.data.existe !== false){
        this.setState({
          idTablero: response.data.id,
          estadoTablero: response.data.tablero,
          turno: response.data.turno,
          modo_juego: response.data.modo_juego
        });
        if(response.data.modo_juego === "IA"){
          document.querySelector("#ia").style.background = "#d4edda";
          document.querySelector("#dosj").style.background = "none";
        }else if(response.data.modo_juego === "2J"){
          document.querySelector("#ia").style.background = "none";
          document.querySelector("#dosj").style.background = "#d4edda";
        }
      }else{
        axios.post(BASE_URL+'crear_tablero', this.state.estadoTablero)
        .then();
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
            String.fromCharCode(mapaSimbolos[response.data.fichaGanadora][1]) + " gana!";
            document.querySelector("#mensaje1").style.display = "block";
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
    const BASE_URL = process.env.REACT_APP_API_SYMFONY;

    const tablero = {
      estado: this.state.estadoTablero,
      accion: 'movimientoIA'
    }

    axios.put(BASE_URL+'grabar_tablero/'+this.state.idTablero, tablero)
      .then((response) => { 
        this.nuevoMovimiento(response.data.valorIA);
      });
  }

  reinicio(e) {
    if (e) e.preventDefault();
    const BASE_URL = process.env.REACT_APP_API_SYMFONY;

    const tablero = {
      accion: 'resetTablero'
    }
    axios.put(BASE_URL+'grabar_tablero/'+this.state.idTablero, tablero)
      .then((response) => { 
        document.querySelectorAll(".alert").forEach(el => (el.style.display = "none"));
        this.setState({
          estadoTablero: response.data.tablero,
          turno: response.data.turno,
          active: true
        });
      });
  }

  nuevoMovimiento(id) {
    const BASE_URL = process.env.REACT_APP_API_SYMFONY;

    const tablero = {
      idCasilla: id,
      estado: this.state.estadoTablero,
      turno: this.state.turno,
      accion: 'nuevoMovimiento'
    }
    axios.put(BASE_URL+'grabar_tablero/'+this.state.idTablero, tablero)
      .then((response) => { 
        this.setState(
          prevState => {
            return {
              estadoTablero: response.data.tablero,
              turno: response.data.turno
            };
          },
          () => {
            this.procesarTablero();
          }
        );
      });
  }

  cambioDeModo(e) {
    e.preventDefault();

    const BASE_URL = process.env.REACT_APP_API_SYMFONY;

    const tablero = {
      modoJuego: e.target.getAttribute("href"),
      accion: 'cambioModo'
    }

    axios.put(BASE_URL+'grabar_tablero/'+this.state.idTablero, tablero)
      .then((response) => { 
        if(response.data.modoJuego === 'IA'){
          document.querySelector("#ia").style.background = "#d4edda";
          document.querySelector("#dosj").style.background = "none";
          this.setState({ modo_juego: "IA" });
          this.reinicio(null);
        }else if(response.data.modoJuego === '2J'){
          document.querySelector("#dosj").style.background = "#d4edda";
          document.querySelector("#ia").style.background = "none";
          this.setState({ modo_juego: "2J" });
          this.reinicio(null);
        }
      });
  }

  
}

export default App;

