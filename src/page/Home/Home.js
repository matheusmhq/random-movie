import React, { Component } from "react";

import {
  FormatDate,
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
      showSimilar: "",
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

  getPage() {
    var gte2 = "";
    var lte2 = "";
    this.setState({ show: "", showTrailer: "", showSimilar: "" });
    if (this.state.genre !== "") {
      var index = Math.floor(Math.random() * (19 - 0)) + 1;

      if (this.state.yearGTE != "") {
        gte2 = this.state.yearGTE + "-01-01";
      } else {
        gte2 = "";
      }
      if (this.state.yearLTE != "") {
        lte2 = this.state.yearLTE + "-12-31";
      } else {
        lte2 = "";
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
          gte2 +
          "&primary_release_date.lte=" +
          lte2,
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
            //console.log(responseJson.total_pages);

            this.randomMovie(responseJson.total_pages);
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      alert("Selecione um gênero!");
    }
  }

  randomMovie(total_pages) {
    var gte = "";
    var lte = "";
    this.setState({ show: "" });
    if (this.state.genre !== "") {
      var page = Math.floor(Math.random() * (total_pages - 1)) + 1;
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
          page +
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

            this.getTrailer(this.state.randomMovie.id);
            this.getSimilar(this.state.randomMovie.id);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  getTrailer(id) {
    this.setState({ showTrailer: "" });
    fetch(Server.url + "movie/" + id + "/videos" + Server.key + Server.pt, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
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

  getMovieFromSimilar(id) {
    fetch(Server.url + "movie/" + id + Server.key + Server.pt, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ randomMovie: responseJson });
      })
      .catch(error => {
        console.error(error);
      });
  }

  getSimilar(id) {
    this.setState({ showSimilar: "" });
    fetch(
      Server.url +
        "movie/" +
        id +
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
        if (responseJson.results.length > 0) {
          this.setState({
            similar: responseJson.results.slice(0, 8),
            showSimilar: "true"
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  _genreChange = event => {
    this.setState({ genre: event.target.value });
  };
  _yearGTEChange = event => {
    this.setState({ yearGTE: event.target.value });
  };
  _yearLTEChange = event => {
    this.setState({ yearLTE: event.target.value });
  };

  getSimilarId(id) {
    this.getMovieFromSimilar(id);
    this.getTrailer(id);
    this.getSimilar(id);
  }

  render() {
    return (
      <section
        style={{
          backgroundImage: `url(${GetImage(
            this.state.randomMovie.poster_path
          )})`,
          flex: 1,
          backgroundRepeat: "no-repeat"
        }}
        teste={"TEste"}
        className="home"
      >
        <div className="black py-5">
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
                  onClick={() => this.getPage()}
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
                  <p className="title">
                    Titulo: {this.state.randomMovie.title}
                  </p>
                  <p className="title">
                    Lançamento:
                    {FormatDate(this.state.randomMovie.release_date)}
                  </p>

                  <p className="language">
                    Linguagem Original:
                    {this.state.randomMovie.original_language}
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
              showSimilar={this.state.showSimilar}
              similar={this.state.similar}
              getSimilarId={this.getSimilarId.bind(this)}
            />
          </div>
        </div>
      </section>
    );
  }
}
