import React, { Component } from "react";

import { Redirect } from "react-router-dom";

import { GetImage, FormatDate } from "../../functions/FunctionsDefault";
import { Server } from "../../server/ServerVariables";

import { ClearStorage } from "../../functions/Storage";

import Trailer from "../../components/Trailer/Trailer";

let src = "";
var object = [];
var i = 0;
export default class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listMovie: [],
      showTrailer: false,
      trailerUrl: [],
      redirect: false
    };
  }

  componentWillMount() {
    object = JSON.parse(localStorage.getItem("random-movie-id"));

    for (var i = 0; i < object.length; i++) {
      this.getMovie(object[i].id);
      this.getTrailer(320288);
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
        this.setState(prevState => ({
          listMovie: [...prevState.listMovie, responseJson]
        }));
      })
      .catch(error => {
        console.error(error);
      });
  }

  showTrailer(i) {
    this.setState({ showTrailer: true, contTrailer: i });
  }

  BtnTrailer() {
    window.scrollTo(0, 0);
    return (
      <button
        onClick={() => this.showTrailer()}
        className="btn btn-primary btn-trailer btn-block mt-2 btn-custom"
      >
        <i class="fas fa-play-circle mr-2"></i> Ver Trailer
      </button>
    );
  }

  HideTrailer() {
    this.setState({ showTrailer: false });
  }

  getTrailer(id) {
    fetch(Server.url + "movie/" + id + "/videos" + Server.key + Server.pt, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.results[0] != null) {
          src = "https://www.youtube.com/embed/" + responseJson.results[0].key;

          this.setState(prevState => ({
            trailerUrl: [...prevState.trailerUrl, src]
          }));
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  DeleteHistory() {
    var clear = ClearStorage();

    if (clear) {
      alert("Histórico apagado com sucesso!");
      this.setState({ redirect: true });
    }
  }

  btnImdb(id) {
    return (
      <a target="_blank" href={"https://www.imdb.com/title/" + id}>
        <button className="btn btn-primary btn-imdb btn-block mt-2 btn-custom">
          IMDB
        </button>
      </a>
    );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={{ pathname: "/" }} />;
    }
    return (
      <section className="history py-4">
        <div className="container">
          <div className="mb-3 row justify-content-center align-align-center">
            <p className="text-white title-apagar col-12">
              Acompanhe aqui o histórico de filmes escolhidos para você!
            </p>
            <div className="col-12 row justify-content-between mt-3">
              <div className="col-md-3 mb-3 mb-md-0 p-0">
                <button
                  onClick={() => this.DeleteHistory()}
                  className="btn btn-primary btn-custom btn-block"
                >
                  Apagar Histórico
                </button>
              </div>
              <div className="col-md-3 p-0">
                <button
                  className="btn btn-primary btn-custom btn-block"
                  onClick={() => this.setState({ redirect: true })}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
          {this.state.listMovie.map((item, index) => (
            <div key={item.id} className="card card-history mb-3 p-4">
              <div className="row">
                <div className="col-md-4">
                  <div className="position-relative">
                    <img
                      className="img-fluid img-card"
                      src={GetImage(item.poster_path, "w1280")}
                      alt={item.title}
                      title={item.title}
                    />
                    <p className="vote-history">
                      <i className="far fa-star mr-2"></i>
                      {item.vote_average}
                    </p>
                  </div>
                  {/* {this.state.trailerUrl ? this.BtnTrailer() : ""} */}
                  {item.imdb_id ? this.btnImdb(item.imdb_id) : ""}
                </div>
                <div className="col-md-8 info-movie">
                  <p className="filme-escolhido-title mt-4 mt-md-0">
                    {item.title}
                  </p>

                  <p className="title">
                    <span>Lançamento:</span> {FormatDate(item.release_date)}
                  </p>

                  <p className="language">
                    <span>Idioma Original:</span> {item.original_language}
                  </p>

                  <p className="overview">
                    <span>Sinopse:</span> {item.overview}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Trailer
          url={this.state.trailerUrl}
          showTrailer={this.state.showTrailer}
          hideTrailer={this.HideTrailer.bind(this)}
        />
      </section>
    );
  }
}
