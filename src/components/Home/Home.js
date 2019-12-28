import React, { Component } from "react";
import moment from "moment";
import { throws } from "assert";

import "./styles.css";

import { Server } from "../../server/ServerVariables";

let src = "";
let genresOptions = [];
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

    this.getGender();
  }

  componentWillMount() {
    //this.getGender();
  }

  getGender() {
    fetch(Server.url + "genre/movie/list" + Server.key + Server.pt, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        genresOptions = responseJson.genres;
        this.forceUpdate();
      })
      .catch(error => {
        console.error(error);
      });
  }

  randomMovie() {
    this.setState({ show: "" });
    if (this.state.genre !== "") {
      var page = Math.floor(Math.random() * (500 - 1)) + 1;
      var index = Math.floor(Math.random() * (20 - 0)) + 1;

      fetch(
        Server.url +
          "discover/movie" +
          Server.key +
          "&page=" +
          page +
          Server.pt +
          "&with_genres" +
          this.state.genres +
          "&include_adult=false",
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
        "/videos?api_key=8f6303cc29888b9f9aac60437527e1f3" +
        Server.pt,
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
    var newDate = moment(date);
    return newDate.format("DD/MM/YYYY");
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
            <div className="col-md-9 form-group">
              <label>Gênero</label>
              <select onChange={this._handleChange} className="form-control">
                <option value=""></option>
                {genresOptions.map((item, index) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label>&nbsp;</label>
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
                  Lançamento:{" "}
                  {this.formatDate(this.state.randomMovie.release_date)}
                </p>

                <p className="language">
                  Linguagem Original:{this.state.randomMovie.original_language}
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
                title="trailer"
                width="100%"
                height="500px"
                src={this.state.trailer}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          {/* 
          <div class="similar mt-5">
            <h3>Filmes Similares</h3>
          </div> */}
        </div>
      </section>
    );
  }
}
