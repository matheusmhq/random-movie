import React, { Component } from "react";
import { throws } from "assert";

import {
  FormatDate,
  SpecificDateInfo,
  SelectYear,
  GetImage
} from "../../functions/FunctionsDefault";

import "./styles.css";

import { Server } from "../../server/ServerVariables";

//Import Components
import Trailer from "../../components/Trailer/Trailer";
import Similar from "../../components/Similar/Similar";

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
      showTrailer: "",
      yearLTE: "",
      yearGTE: "",
      similar: []
    };

    this.getGender();
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
    var gte = "";
    var lte = "";
    this.setState({ show: "" });
    if (this.state.genre !== "") {
      var page = Math.floor(Math.random() * (500 - 1)) + 1;
      var index = Math.floor(Math.random() * (19 - 0)) + 1;

      if (this.state.yearGTE != "") {
        gte = this.state.yearGTE + "-01-01";
      } else {
        gte = "";
      }
      if (this.state.yearLTE != "") {
        lte = this.state.yearLTE + "-12-31";
      } else {
        lte = "";
      }
      fetch(
        Server.url +
          "discover/movie" +
          Server.key +
          "&page=" +
          1 +
          Server.pt +
          "&with_genres=" +
          this.state.genre +
          "&include_adult=false&primary_release_date.gte=" +
          gte +
          "&primary_release_date.lte=" +
          lte,
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
          if (responseJson.results.length > 0) {
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
            this.getSimilar();
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      alert("Selecione um gênero!");
    }
  }

  getTrailer() {
    this.setState({ showTrailer: "" });
    fetch(
      Server.url +
        "movie/" +
        this.state.randomMovie.id +
        "/videos" +
        Server.key +
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

  getMovieFromSimilar() {
    fetch(Server.url + "movie/" + +Server.key + Server.pt, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }

  getSimilar() {
    fetch(
      Server.url +
        "movie/" +
        this.state.randomMovie.id +
        "/similar" +
        Server.key +
        Server.pt +
        "&page=1",
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
        this.setState({ similar: responseJson.results.slice(0, 8) });
      })
      .catch(error => {
        console.error(error);
      });
  }

  _genreChange = event => {
    this.setState({ genre: event.target.value });
  };
  _yearGTEChange = event => {
    console.log(event.target.value);
    this.setState({ yearGTE: event.target.value });
    //console.log(this.state.yearGTE);
  };
  _yearLTEChange = event => {
    this.setState({ yearLTE: event.target.value });
  };

  render() {
    return (
      <section className="home py-5">
        <div className="container">
          <h1 className="mb-5">Bem vindo ao Random Movie</h1>
          <div className="row">
            <div className="col-md-6 form-group">
              <label>Gênero</label>
              <select
                onChange={this._genreChange}
                className="form-control"
                required
              >
                <option value=""></option>
                {genresOptions.map((item, index) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 form-group">
              <label>De:</label>
              <select onChange={this._yearGTEChange} className="form-control">
                <option value=""></option>
                {SelectYear().map((item, index) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 form-group">
              <label>Até:</label>
              <select onChange={this._yearLTEChange} className="form-control">
                <option value=""></option>
                {SelectYear().map((item, index) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <label>&nbsp;</label>
              <button
                className="btn btn-primary btn-block"
                onClick={() => this.randomMovie()}
              >
                Procurar
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
                  src={GetImage(this.state.randomMovie.poster_path)}
                  alt={this.state.randomMovie.title}
                  title={this.state.randomMovie.title}
                />
              </div>

              <div className="col-md-7">
                <p className="title">Titulo: {this.state.randomMovie.title}</p>
                <p className="title">
                  Lançamento:
                  {FormatDate(this.state.randomMovie.release_date)}
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

            <Trailer
              url={this.state.trailer}
              showTrailer={this.state.showTrailer}
            />
          </div>

          <Similar
            similar={this.state.similar}
            get={this.getMovieFromSimilar()}
          />
        </div>
      </section>
    );
  }
}
