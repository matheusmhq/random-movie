import React, { Component } from "react";

export default class Loading extends Component {
  render() {
    return (
      <section
        className="loading"
        style={{ display: this.props.showLoading ? "flex" : "none" }}
      >
        <div class="container position-relative">
          <h1>
            Aguarde enquanto procuramos um filme especialmente para você !
          </h1>
          <div class="container-loading">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
          </div>
        </div>
      </section>
    );
  }
}
