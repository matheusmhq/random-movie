import React, { Component } from "react";

import { BrowserRouter, Route } from "react-router-dom";

import Home from "../Home/Home";
import Chosen from "../Chosen/Chosen";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Home} />
          <Route
            path="/chosen"
            render={props => <Chosen {...props} teste={"teste"} />}
          />
        </div>
      </BrowserRouter>
    );
  }
}
