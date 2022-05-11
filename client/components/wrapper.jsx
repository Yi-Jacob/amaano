import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Spinner } from 'react-bootstrap';

export default WrappedComponent => {
  class Wrapper extends Component {
    state = { isLoading: true };

    componentDidMount = () => this.setTimer();

    componentDidUpdate = prevProps => {
      if (this.props.location !== prevProps.location) {
        this.clearTimer();
        this.setState({ isLoading: true }, () => this.setTimer());
      }
    };

    clearTimer = () => clearTimeout(this.timeout);

    timer = () => this.setState({ isLoading: false }, () => this.clearTimer());

    setTimer = () => (this.timeout = setTimeout(this.timer, 500));

    render() {
      return (
        <Fragment>
          {this.state.isLoading
            ? (<div id="spinner" className="d-flex align-items-center justify-content-center"><Spinner animation="border" variant="primary" /></div>)
            : <WrappedComponent {...this.props} />}
        </Fragment>
      )
    }
  }
  return withRouter(Wrapper);
};
