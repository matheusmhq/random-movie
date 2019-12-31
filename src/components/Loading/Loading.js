import React, { Component } from "react";

export default class Loading extends Component {
  render() {
    return (
      <section className="loading overflow-hidden">
        <div className="">
          <div id="container">
            <div className="black-loading">
              <div className="a"></div>
              <div className="b"></div>
              <div className="c"></div>
              <div className="d"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
