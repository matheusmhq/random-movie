import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
//import "./styles.css";

import {
  GetImage,
  DateNow,
  FormatDate,
  GetBackground
} from "../../functions/FunctionsDefault";

import { Server } from "../../server/ServerVariables";

import Trailer from "../../components/Trailer/Trailer";

let src = "";
var height = 0;
export default class Chosen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTrailer: false,
      trailerUrl: ""
    };

    this.getTrailer(this.props.location.state.chosen.id);
  }

  showTrailer() {
    this.setState({ showTrailer: true });
    window.scrollTo(0, 0);
  }

  BtnTrailer() {
    return (
      <button
        onClick={() => this.showTrailer()}
        className="btn btn-primary btn-trailer btn-block mt-2 btn-custom"
      >
        <i class="fas fa-play-circle mr-2"></i> Ver Trailer
      </button>
    );
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
          this.setState({ trailerUrl: src });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  HideTrailer() {
    this.setState({ showTrailer: false });
  }

  render() {
    return (
      <section>
        <div
          className="container-movie"
          style={{
            backgroundImage: `url(${GetBackground(
              this.props.location.state.chosen.backdrop_path,
              "original"
            )})`,
            flex: 1,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
          }}
        >
          <div className="container-white card p-4">
            <div className="mb-4 row align-items-center">
              <h2 className="col-md-4 text-center escolhido-foi mb-4 mb-md-0">
                {" "}
                E o filme escolhido foi:
              </h2>
              <h1 className="filme-escolhido-title col-md-8">
                {this.props.location.state.chosen.title}
              </h1>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="position-relative">
                  <img
                    className="img-fluid img-card"
                    src={GetImage(
                      this.props.location.state.chosen.poster_path,
                      "w1280"
                    )}
                    alt={this.props.location.state.chosen.title}
                    title={this.props.location.state.chosen.title}
                  />
                  <p className="vote">
                    <i className="far fa-star mr-2"></i>
                    {this.props.location.state.chosen.vote_average}
                  </p>
                </div>
                {this.state.trailerUrl ? this.BtnTrailer() : ""}
              </div>

              <div className="col-md-7 info-movie mt-4 mt-md-0">
                <p className="title">
                  <span>Lançamento:</span>{" "}
                  {FormatDate(this.props.location.state.chosen.release_date)}
                </p>

                <p className="language">
                  <span>Idioma Original:</span>{" "}
                  {this.props.location.state.chosen.original_language}
                </p>

                <p className="overview">
                  <span>Sinopse:</span>{" "}
                  {this.props.location.state.chosen.overview}
                </p>
              </div>
            </div>

            <Link to={{ pathname: "/" }}>
              <button className="btn btn-primary btn-voltar btn-block mt-3 btn-custom">
                <i class="fas fa-search mr-2"></i> Procurar novamente
              </button>
            </Link>
          </div>
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
