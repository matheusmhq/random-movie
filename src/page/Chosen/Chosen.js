import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
//import "./styles.css";

import {
  GetImage,
  DateNow,
  FormatDate
} from "../../functions/FunctionsDefault";

import { Server } from "../../server/ServerVariables";

import Trailer from "../../components/Trailer/Trailer";
import Loading from "../../components/Loading/Loading";

let src = "";
export default class Chosen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTrailer: false,
      trailerUrl: ""
    };

    this.getTrailer(299534);
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

  render() {
    // if (!this.props.location.state.chosen) {
    //   return (
    //     <Redirect
    //       to={{
    //         pathname: "/"
    //       }}
    //     />
    //   );
    // }
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <section>
          <div
            className="container-movie"
            style={{
              backgroundImage: `url(${GetImage(
                this.props.location.state.chosen.backdrop_path,
                "original"
              )})`,
              flex: 1,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover"
            }}
          >
            <div className="container container-white card">
              <div className="mb-5 pt-4 d-flex justify-content-center">
                <h2 className="filme-escolhido-title">
                  E o filme escolhido foi:
                  <span> {this.props.location.state.chosen.title} </span>
                </h2>
              </div>
              <div className="row pb-4">
                <div className="col-md-5 position-relative">
                  <img
                    className="img-fluid img-card"
                    src={GetImage(
                      this.props.location.state.chosen.poster_path,
                      "w780"
                    )}
                    alt={this.props.location.state.chosen.title}
                    title={this.props.location.state.chosen.title}
                  />
                  <p className="vote">
                    <i className="far fa-star mr-2"></i>
                    {this.props.location.state.chosen.vote_average}
                  </p>
                </div>

                <div className="col-md-7 info-movie mt-4 mt-md-0">
                  <p className="title">
                    <span>Lançamento:</span>{" "}
                    {FormatDate(this.props.location.state.chosen.release_date)}
                  </p>

                  <p className="language">
                    <span>Linguagem Original:</span>{" "}
                    {this.props.location.state.chosen.original_language}
                  </p>

                  <p className="overview">
                    <span>Sinopse:</span> {this.props.location.state.overview}
                  </p>
                </div>
              </div>

              <button
                onClick={() => this.setState({ showTrailer: true })}
                className="btn btn-primary btn-trailer"
              >
                <i class="fas fa-play-circle mr-2"></i> Ver Trailer
              </button>
            </div>
          </div>
          <Trailer
            url={this.state.trailerUrl}
            showTrailer={this.state.showTrailer}
          />
        </section>
      );
    }
  }
}
