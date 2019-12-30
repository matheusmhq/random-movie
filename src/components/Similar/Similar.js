import React, { Component } from "react";

//import "./styles.css";

import { GetImage } from "../../functions/FunctionsDefault";

export default class Trailer extends Component {
  render() {
    // console.log("DENTRO DE SIMILAR");
    // console.log(this.props.similar);
    return (
      <section
        className="similar"
        style={{ display: this.props.showSimilar ? "block" : "none" }}
      >
        <h4 className="mb-4 mt-5">Filmes Parecidos:</h4>
        <div className="row">
          {this.props.similar.map((item, index) => (
            <div key={item.id} className="col-6 col-md-3 similar-item mb-4">
              <div
                className="similar-img"
                onClick={() => this.props.getSimilarId(item.id)}
              >
                <div className="position-relative">
                  <img
                    className="img-fluid"
                    alt={item.title}
                    title={item.title}
                    src={GetImage(item.poster_path, "w300")}
                  />
                  <p className="vote-similar">
                    <i className="far fa-star mr-2"></i>
                    {item.vote_average}
                  </p>
                </div>
              </div>
              <p
                onClick={() => this.props.getSimilarId(item.id)}
                className="title similar-title m-0 mt-2"
              >
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }
}
