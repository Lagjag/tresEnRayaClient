import React from "react";

var mapaSimbolos = {
  2: ["marking", "32"],
  0: ["marking marking-x", 9587],
  1: ["marking marking-o", 9711]
};

class Column extends React.Component {
  constructor(props) {
    super(props);
    this.nuevoMovimiento = this.nuevoMovimiento.bind(this);
  }
  
  nuevoMovimiento(e) {
    if (!this.props.active) {
      document.querySelector("#mensaje1").style.display = "none";
      document.querySelector("#mensaje2").innerHTML =
        "Juego terminado, pulsa limpiar tablero si quieres volver a jugar.";
      document.querySelector("#mensaje2").style.display = "block";
      return false;
    } else if (this.props.marking === 2)
      this.props.enNuevoMovimiento(parseInt(e.target.id));
  }

  render() {
    return (
      <div className="col" onClick={this.nuevoMovimiento}>
        <div className={mapaSimbolos[this.props.marking][0]} id={this.props.id}>
          {String.fromCharCode(mapaSimbolos[this.props.marking][1])}
        </div>
      </div>
    );
  }
}

export default Column;