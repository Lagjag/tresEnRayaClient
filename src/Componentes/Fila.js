import React from "react";
import Columna from "./Columna";

class Fila extends React.Component {

  render() {
    const cols = [];
    for (var i = 0; i < 3; i++) {
      var id = this.props.row * 3 + i;
      var marking = this.props.estadoTablero[id];
      cols.push(
        <Columna
          key={id + "-" + marking}
          id={id + "-" + marking}
          marking={marking}
          onNewMove={this.props.onNewMove}
          active={this.props.active}
        />
      );
    }
    return <div className="row">{cols}</div>;
  }
}

export default Fila;