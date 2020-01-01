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
import { SaveMovie } from "../../functions/Storage";

//Import Components
import Loading from "../../components/Loading/Loading";

let genresOptions = [];
let btnHistory = [];
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      randomMovie: [],
      genre: "",
      yearLTE: DateNow(),
      yearGTE: "",
      loading: false,
      redirect: false
    };

    this.getGender();
  }

  componentWillMount() {
    btnHistory = JSON.parse(localStorage.getItem("random-movie-id"));
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

  _genreChange = event => {
    this.setState({ genre: event.target.value });
  };
  _yearGTEChange = event => {
    this.setState({ yearGTE: event.target.value });
  };
  _yearLTEChange = event => {
    if (this.state.yearGTE >= event.target.value) {
      alert("O primeiro ano deve ser menor que o segundo");
      event.target.value = "";
    } else {
      this.setState({ yearLTE: event.target.value });
    }
  };

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
          if (responseJson.results.length > 0) {
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
          if (responseJson.results.length > 0) {
            for (var i = 0; i < 20; i++) {
              if (index == i) {
                this.getMovie(responseJson.results[i].id);
              }
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  getMovie(id) {
    fetch(Server.url + "movie/" + id + Server.key + Server.pt, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson != null) {
          this.setState({
            randomMovie: responseJson
          });
          SaveMovie(responseJson.id);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  Verification() {
    if (this.state.genre == "") {
      alert("Selecione um Gênero!");
    } else {
      this.setState({ loading: true });
      this.getPage();
      setTimeout(() => {
        this.setState({ redirect: true });
      }, 6000);
    }
  }

  getBtnHistory() {
    if (btnHistory) {
      return (
        <Link to={{ pathname: "/history" }}>
          <button className="btn btn-primary btn-custom btn-block btn-search mt-4">
            Histórico
          </button>
        </Link>
      );
    }
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/chosen",
            state: {
              chosen: this.state.randomMovie
              //chosen: []
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
          <div className="black">
            <div className="container-search py-2 d-flex align-items-center justify-content-between flex-column">
              <p>&nbsp;</p>
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
                        defaultValue={this.state.yearLTE}
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
                        className="btn btn-primary btn-block btn-search btn-custom"
                        onClick={() => this.Verification()}
                      >
                        Procurar
                      </button>
                      {btnHistory ? this.getBtnHistory() : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="dev d-flex justify-content-center mt-3">
                <div className="d-flex">
                  <p className="text-white mr-1 m-0"> Desenvolvido por </p>
                  <a
                    target="_blank"
                    href="https://matheusmhq.com.br/"
                    className="text-white m-0 font-weight-bold"
                  >
                    Matheus Henrique
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  }
}
