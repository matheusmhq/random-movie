import React, { Component } from "react";
import { throws } from "assert";

import "./styles.css";

let src = "";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      randomMovie: [],
      genre: "",
      trailer: "",
      show: "",
      showTrailer: ""
    };
  }

  randomMovie() {
    this.setState({ show: "" });
    if (this.state.genre !== "") {
      var page = Math.floor(Math.random() * (19 - 1)) + 1;
      var index = Math.floor(Math.random() * (20 - 0)) + 1;

      fetch(
        "https://api.themoviedb.org/3/search/movie?query=" +
          this.state.genre +
          "&api_key=8f6303cc29888b9f9aac60437527e1f3&page=" +
          page +
          "&language=pt-br",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          //console.log(responseJson);

          for (var i = 0; i < 20; i++) {
            if (index == i) {
              this.setState({
                randomMovie: responseJson.results[i],
                show: "true"
              });
              console.log(responseJson.results[i]);
            }
          }

          this.getTrailer();
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      alert("Selecione um genero!");
    }
  }

  getTrailer() {
    console.log(this.state.randomMovie.id);
    this.setState({ showTrailer: "" });
    fetch(
      "https://api.themoviedb.org/3/movie/" +
        this.state.randomMovie.id +
        "/videos?api_key=8f6303cc29888b9f9aac60437527e1f3",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.results[0] != null) {
          console.log("FAVORITO AQUI " + responseJson.results[0].key);
          src = "https://www.youtube.com/embed/" + responseJson.results[0].key;
          this.setState({ trailer: src, showTrailer: "true" });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  _handleChange = event => {
    this.setState({ genre: event.target.value });
  };

  formatDate(date) {
    let today = date;
    // let teste =
    //   today.getDate() +
    //   "-" +
    //   parseInt(today.getMonth() + 1) +
    //   "-" +
    //   today.getFullYear();
    console.log(today);
  }

  getImage(poster_path) {
    if (poster_path != null) {
      return "http://image.tmdb.org/t/p/original" + poster_path;
    } else {
      return require("../../assets/Image/placeholder.jpg");
    }
  }

  render() {
    return (
      <section className="home py-5">
        <div className="container">
          <h1 className="mb-5">Bem vindo ao Random Movie</h1>
          <div className="row">
            <div className="col-md-9">
              <select onChange={this._handleChange} className="form-control">
                <option value=""></option>
                <option value="action">Acão</option>
                <option value="terror">Terror</option>
                <option value="aventure">Aventura</option>
              </select>
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-primary btn-block"
                onClick={() => this.randomMovie()}
              >
                Procurar Filme
              </button>
            </div>
          </div>

          <div
            className="container-movie mt-5"
            style={{ display: this.state.show ? "block" : "none" }}
          >
            <h2 className="text-center mb-5">Filme Escolhido:</h2>

            <div className="row">
              <div className="col-md-5">
                <img
                  className="img-fluid"
                  src={this.getImage(this.state.randomMovie.poster_path)}
                  alt={this.state.randomMovie.title}
                  title={this.state.randomMovie.title}
                />
              </div>

              <div className="col-md-7">
                <p className="title">Titulo: {this.state.randomMovie.title}</p>
                <p className="title">
                  Lançamento: {this.state.randomMovie.release_date}
                  {/* {this.formatDate(this.state.randomMovie.release_date)} */}
                </p>

                <p className="language">
                  Linguagem Original: {this.state.randomMovie.original_language}
                </p>

                <p className="vote">
                  Média de Votos: {this.state.randomMovie.vote_average}
                </p>

                <p className="overview">
                  Sinopse: {this.state.randomMovie.overview}
                </p>
              </div>
            </div>

            <div
              className="trailer col-12 mt-4"
              style={{ display: this.state.showTrailer ? "block" : "none" }}
            >
              <iframe
                width="100%"
                height="500px"
                src={this.state.trailer}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
