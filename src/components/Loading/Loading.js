import React, { Component } from "react";

export default class Loading extends Component {
  render() {
    return (
      <section className="loading overflow-hidden">
        <div className="">
          {/* <h1>
            Aguarde enquanto procuramos um filme especialmente para você !
          </h1> */}
          {/* <div className="container-loading">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div> */}
          {/* <div id="loader">
            <div id="top"></div>
            <div id="bottom"></div>
            <div id="line"></div>
          </div> */}
          <div id="container">
            <div class="black-loading">
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
