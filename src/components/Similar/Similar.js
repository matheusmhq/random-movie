import React, { Component } from "react";

//import "./styles.css";

import { GetImage } from "../../functions/FunctionsDefault";

export default class Trailer extends Component {
  render() {
    // console.log("DENTRO DE SIMILAR");
    // console.log(this.props.similar);
    return (
      <section className="similar mt-5">
        <h4>Filmes Parecidos:</h4>
        <div class="row">
          {this.props.similar.map((item, index) => (
            <div
              //   onClick={teste.bind(
              //     this,
              //     item.id,
              //   )}
              key={item.id}
              className="col-md-3"
            >
              <img
                className="img-fluid"
                alt={item.title}
                title={item.title}
                src={GetImage(item.poster_path)}
              />
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
}
