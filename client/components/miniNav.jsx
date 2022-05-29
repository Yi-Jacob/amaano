import React from 'react';
import { Navbar, Form, FormControl, Button, Nav } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
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
        <div className="col-md-12">
          <Navbar className='navbar-custom d-flex work-sans blue-border' expand="lg" sticky="top">
            <div className="container-fluid align-content-center">

              <Navbar.Brand href="index.html" className='nav-font nav-brand navlink'>
                <img src='assets/img/faviconlogo.png' className='mb-1' width={200}></img>

              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll" className='justify-content-between'>
                <Nav className="">
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
                <form onSubmit={this.handleSubmit}>
                  <InputGroup className="mb-2 nav-input" >
                    <FormControl
                      placeholder="Search for your Wallet Address or Transaction Id"
                      className='blue-border'
                      onChange={this.handleChange}
                      value={this.state.input}
                      type='search'
                    />
                    <button className="search-button" type='submit'>
                      Search
                    </button>
                  </InputGroup>
                </form>
              </Navbar.Collapse>
            </div>
          </Navbar>
        </div>
      </div>

    )
  }
}
