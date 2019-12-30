import React, { Component } from "react";

//import "./styles.css";

export default class Trailer extends Component {
  render() {
    return (
      <section className="trailer">
        <div
          className="trailer col-12 my-4"
          style={{ display: this.props.showTrailer ? "block" : "none" }}
        >
          <iframe
            title="trailer"
            width="100%"
            height="500px"
            src={this.props.url}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </section>
    );
  }
}
