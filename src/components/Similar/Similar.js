import React, { Component } from "react";

//import "./styles.css";

import { GetImage } from "../../functions/FunctionsDefault";

export default class Trailer extends Component {
  render() {
    // console.log("DENTRO DE SIMILAR");
    // console.log(this.props.similar);
    return (
      <section
        className="similar mt-5"
        style={{ display: this.props.showSimilar ? "block" : "none" }}
      >
        <h4>Filmes Parecidos:</h4>
        <div className="row">
          {this.props.similar.map((item, index) => (
            <div
              onClick={() => this.props.getSimilarId(item.id)}
              key={item.id}
              className="col-md-3 similar-item"
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
