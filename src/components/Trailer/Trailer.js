import React, { Component } from "react";

//import "./styles.css";

export default class Trailer extends Component {
  render() {
    if (this.props.showTrailer) {
      return (
        <section className="trailer" onClick={() => this.props.hideTrailer()}>
          <div className="trailer-container col-12 my-4 mb-2">
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
    } else {
      return <p className="d-none"></p>;
    }
  }
}
