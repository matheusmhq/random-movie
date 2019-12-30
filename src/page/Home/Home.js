import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

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
var height = 0;
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
      loading: false,
      redirect: false
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

  componentDidMount() {
    height = this.divElement.clientHeight;
  }

  getPage() {
    var gte2 = "";
    var lte2 = "";
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

  Verification() {
    if (this.state.genre == "") {
      alert("Selecione um Gênero!");
    } else {
      this.setState({ loading: true });
      this.getPage();
      setTimeout(() => {
        this.setState({ redirect: true });
      }, 5000);
    }
  }

  render() {
    window.scrollTo(0, height);
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/chosen",
            state: {
              genre: this.state.genre,
              chosen: this.state.randomMovie
            }
          }}
        />
      );
    }
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <section className="home">
          <div className="black d-flex align-items-center justify-content-center">
            <div
              className="search container"
              ref={divElement => {
                this.divElement = divElement;
              }}
            >
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
                      onClick={() => this.Verification()}
                    >
                      Procurar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  }
}
