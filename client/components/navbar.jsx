import React from 'react';
import { Navbar, Form, FormControl, Button, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default class Navbar1 extends React.Component {
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

  componentDidMount() {
    fetch('https://bitpay.com/api/rates')
      .then(res => res.json())
      .then(data => {
        this.setState({ price: (data[2].rate).toLocaleString() });
      });
  }

  render() {
    return (
      <>
        <Navbar className='navbar-custom d-flex work-sans' expand="lg" sticky="top">
          <div className="container-fluid align-content-center">

            <Navbar.Brand href="/" className='nav-font nav-brand navlink'>
              <img src='faviconlogo.png' className='mb-1' width={200}></img>

            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0 align-items-end justify-content-end">
                <NavLink to='/' className='nav-font black mx-2 navlink'>
                  Home
                </NavLink>
                <NavLink to='/transactions' className='nav-font black mx-2 navlink'>
                  Transactions
                </NavLink>
                <NavLink to='/mining' className='nav-font black mx-2 navlink'>
                  Mining
                </NavLink>
                <a href='https://amaano.com/index.html' className='nav-font black mx-2 navlink'>
                  amaano.com
                </a>
              </Nav>
              <Form className="d-flex py-3" onSubmit={this.handleSubmit}>
                <FormControl
                  type="search"
                  placeholder="Search for Wallet Address"
                  className="me-3 nav-input blue-border"
                  onChange={this.handleChange}
                  value={this.state.input}
                />
                <Button className="search-button" type='submit'>Search</Button>
              </Form>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </>
    );
  }
}
