import React, { Component } from "react";

export default class Loading extends Component {
  render() {
    return (
      <section
        className="loading"
        style={{ display: this.props.showLoading ? "flex" : "none" }}
      >
        <div className="container position-relative">
          <h1>
            Aguarde enquanto procuramos um filme especialmente para você !
          </h1>
          <div className="container-loading">
            <div className="circle"></div>
            <div className="circle"></div>
            <div class="circle"></div>
          </div>
        </div>
      </section>
    );
  }
}
