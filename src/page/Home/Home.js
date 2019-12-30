import React, { Component } from "react";

import {
  FormatDate,
  SelectYear,
  GetImage,
  DateNow
} from "../../functions/FunctionsDefault";

import "./styles.css";

import { Server } from "../../server/ServerVariables";

//Import Components
import Trailer from "../../components/Trailer/Trailer";
import Similar from "../../components/Similar/Similar";
import Loading from "../../components/Loading/Loading";

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
      yearLTE: DateNow(),
      yearGTE: "",
      similar: [],
      loading: ""
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
      this.setState({ loading: "true" });
      var index = Math.floor(Math.random() * (19 - 0)) + 1;

      if (this.state.yearGTE != "") {
        gte2 = this.state.yearGTE + "-01-01";
      } else {
        gte2 = "";
      }
      if (this.state.yearLTE != DateNow()) {
        lte2 = this.state.yearLTE + "-12-31";
      } else {
        lte2 = DateNow();
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
      if (this.state.yearLTE != DateNow()) {
        lte = this.state.yearLTE + "-12-31";
      } else {
        lte = DateNow();
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
    setTimeout(() => {
      this.setState({ loading: "" });
    }, 5000);
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
    console.log("DATE NOW " + DateNow());
    if (this.state.loading) {
      return <Loading showLoading={this.state.loading} />;
    } else {
      return (
        <section className="home">
          <div className="black">
            <div className="search py-5">
              <div className="mb-5">
                <h1 className="text-white">Bem-vindo ao Random Movie</h1>
              </div>
              <div className="container">
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
                    <select
                      onChange={this._yearGTEChange}
                      className="form-control"
                    >
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
                    <select
                      onChange={this._yearLTEChange}
                      className="form-control"
                    >
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
                      className="btn btn-primary btn-block btn-search"
                      onClick={() => this.getPage()}
                    >
                      Procurar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="container-movie py-3"
              style={{
                display: this.state.show ? "block" : "none",
                backgroundImage: `url(${GetImage(
                  this.state.randomMovie.backdrop_path,
                  "original"
                )})`,
                flex: 1,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
              }}
            >
              <div className="container bg-white container-white card">
                <div className="mb-5 pt-4 d-flex justify-content-center">
                  <h2 className="filme-escolhido-title">
                    E o filme escolhido foi...
                    <span> {this.state.randomMovie.title} </span>
                  </h2>
                </div>
                <div className="row pb-4">
                  <div className="col-md-5 position-relative">
                    <img
                      className="img-fluid img-card"
                      src={GetImage(this.state.randomMovie.poster_path, "w780")}
                      alt={this.state.randomMovie.title}
                      title={this.state.randomMovie.title}
                    />
                    <p className="vote">
                      {this.state.randomMovie.vote_average}
                    </p>
                  </div>

                  <div className="col-md-7 info-movie">
                    <p className="title">
                      <span>Lançamento:</span>{" "}
                      {FormatDate(this.state.randomMovie.release_date)}
                    </p>

                    <p className="language">
                      <span>Linguagem Original:</span>{" "}
                      {this.state.randomMovie.original_language}
                    </p>

                    <p className="overview">
                      <span>Sinopse:</span> {this.state.randomMovie.overview}
                    </p>
                  </div>
                </div>

                <Trailer
                  url={this.state.trailer}
                  showTrailer={this.state.showTrailer}
                />

                <Similar
                  showSimilar={this.state.showSimilar}
                  similar={this.state.similar}
                  getSimilarId={this.getSimilarId.bind(this)}
                />
              </div>
            </div>
          </div>
        </section>
      );
    }
  }
}
