import React from 'react';
import { Navbar, Form, FormControl, Button, Nav } from 'react-bootstrap';

export default class Navbar2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      input: '',
      price: null
    });
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push('/search-results?address=' + this.state.input);
    this.setState({
      input: ''
    });
  }

  render() {
    return (
      <div className="row mb-3">
        <Navbar className='navbar-custom d-flex work-sans blue-border' expand="lg" sticky="top">
          <div className="container-fluid align-content-center">

            <Navbar.Brand href="index.html" className='nav-font nav-brand navlink'>
              <img src='assets/img/faviconlogo.png' className='mb-1' width={200}></img>

            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0 align-items-end justify-content-end">
                <a href='explorer.html' className='nav-font black mx-2 navlink'>
                  Explorer
                </a>
                <a href='explorer.html#/mining' className='nav-font black mx-2 navlink'>
                  Mining
                </a>
                <a href='explorer.html#/transactions' className='nav-font black mx-2 navlink'>
                  Transactions
                </a>

              </Nav>
              <Form className="d-flex py-3" onSubmit={this.handleSubmit}>
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-3 nav-input blue-border"
                  onChange={this.handleChange}
                  value={this.state.input}
                />
                <Button className="search-button" type='submit'>Search</Button>
              </Form>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </div>

    )
  }
}
