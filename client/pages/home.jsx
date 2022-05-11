import React from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from '../components/navbar';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      input: '',
      difficulty: {
        difficultyChange: 0,
        remainingBlocks: null,
        progressPercent: null
      },
      fees: {
        fastestFee: null,
        halfHourFee: null,
        hourFee: null
      },
      blocks: [
        {
          height: null,
          tx_count: 0,
          timestamp: null
        }
      ],
      transactions: [
        {
          txid: null,
          value: null,
          fee: null
        }
      ]
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
    Promise.all([
      fetch('https://mempool.space/api/v1/difficulty-adjustment')
        .then(res => res.json())
        .then(data => {
          this.setState({ difficulty: data });
        }),
    fetch('https://mempool.space/api/v1/fees/recommended')
      .then(res => res.json())
      .then(data => {
        this.setState({ fees: data });
      }),
    fetch('https://mempool.space/api/blocks/')
      .then(res => res.json())
      .then(data => {
        this.setState({ blocks: data });
      }),
    fetch('https://mempool.space/api/mempool/recent')
      .then(res => res.json())
      .then(data => {
        this.setState({ transactions: data });
      })
    ])
    // fetch('https://mempool.space/api/v1/difficulty-adjustment')
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({ difficulty: data });
    //   });
    // fetch('https://mempool.space/api/v1/fees/recommended')
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({ fees: data });
    //   });
    // fetch('https://mempool.space/api/blocks/')
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({ blocks: data });
    //   });
    // fetch('https://mempool.space/api/mempool/recent')
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({ transactions: data });
    //   });
  }

  render() {
    return (
      <>
      <div className="black-background">
          <Nav history={this.props.history} />
          <div className="container">
            <div className="row orange my-4">
              <div className="col-sm-12">
                <h1 className='text-center font-raleway font-italic font-bold'> <i className="fa-brands fa-btc" />itcoin Explorer</h1>
              </div>
            </div>
            <div className="row my-3">
              <div className="col-sm-12">
                <h2 className='text-center font-titillium-web font-bold orange'><span className='font-italic'>Explore</span> the Bitcoin Blockchain in <span className='font-italic '>Real-Time</span></h2>
              </div>
            </div>
            <div className="row justify-content-center mb-4" >
              <Form onSubmit={this.handleSubmit} className='my-3 px-2 "col-sm-11'>
                <InputGroup className="mb-2" >
                  <FormControl
                    placeholder="Search for your Wallet Address    i.e. 3FHNBLobJnbCTFTVakh5TXmEneyf5PT61B "
                    className='orange-border'
                    onChange={this.handleChange}
                    value={this.state.input}
                    type='search'
                  />
                  <Button className="search-button" type='submit'>
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </div>
            <div className="row mb-3 justify-content-center">
              <div className="col-md-6">
                <Table className='orange-border'>
                  <tbody className='orange-border'>
                    <tr >
                      <td colSpan={2} className='orange-border font-bold'>Current Transaction Fees</td>
                    </tr>
                    <tr>
                      <td>High Priority<span className='small-text py-3 my-4'> ~ 10 minutes</span></td>
                      <td>{this.state.fees.fastestFee} sat/vB</td>
                    </tr>
                    <tr>
                      <td>Medium Priority<span className='small-text py-3 my-4'> ~ 30 minutes</span></td>
                      <td>{this.state.fees.halfHourFee} sat/vB</td>
                    </tr>
                    <tr>
                      <td>Low Priority<span className='small-text py-3 my-4'> ~ 60 minutes</span></td>
                      <td>{this.state.fees.hourFee} sat/vB</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="col-md-6">
                <Table className='orange-border'>
                  <tbody>
                    <tr>
                      <td colSpan={4} className='font-bold'>Estimated Difficulty Adjustment</td>
                    </tr>
                    <tr>
                      <td>Estimate change:</td>
                      <td><span className={this.state.difficulty.difficultyChange > 0 ? 'green' : 'red'}>
                        {Number(this.state.difficulty.difficultyChange).toFixed(2)}%
                      </span></td>
                    </tr>
                    <tr>
                      <td>Current Period Progress:</td>
                      <td>{Number(this.state.difficulty.progressPercent).toFixed(2)}%</td>
                    </tr>
                    <tr>
                      <td>Remaining Blocks</td>
                      <td>{this.state.difficulty.remainingBlocks} <span className='small-text py-3 my-4'>~{Number(this.state.difficulty.remainingBlocks / 144).toFixed(1)} days</span></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="row mb-3 justify-content-center">
              <div className="col-md-12">
                <Table className='orange-border '>
                  <tbody>
                    <tr>
                      <td colSpan={4} className='font-bold'>Latest Blocks</td>
                    </tr>
                    <tr className='font-bold'>
                      <td>Block Height</td>
                      <td>Number of Transactions</td>
                      <td>TimeStamp</td>
                    </tr>
                    {this.state.blocks.slice(0, 3).map((block, i) => {
                      return (
                        <>
                          <tr key={i}>
                            <td>{this.state.blocks[i].height}</td>
                            <td>{this.state.blocks[i].tx_count}</td>
                            <td>{(moment.unix(this.state.blocks[i].timestamp).format('MMMM Do YYYY, h:mm:ss a').toString())}</td>
                          </tr>
                        </>
                      );
                    }
                    )}
                    <tr>
                      <td colSpan={4}>
                        <Link to='/mining' className='orange mx-2 navlink font-bold'>
                          View More
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="row mb-3 justify-content-center">
              <div className="col-md-12">
                <Table className='orange-border' responsive='sm'>
                  <tbody>
                    <tr>
                      <td colSpan={4} className='orange-border font-bold'>Latest Transactions</td>
                    </tr>
                    <tr className='font-bold'>
                      <td>Transaction Id</td>
                      <td>Value</td>
                      <td>Fees</td>
                    </tr>
                    {this.state.transactions.slice(0, 3).map((transaction, i) => {
                      return (
                        <>
                          <tr key={i}>
                            <td>{this.state.transactions[i].txid}</td>
                            <td>{(this.state.transactions[i].value) / 100000000} BTC</td>
                            <td>{(this.state.transactions[i].fee) / 100} sat/vB</td>
                          </tr>
                        </>
                      );
                    }
                    )}
                    <tr>
                      <td colSpan={4}>
                        <Link to='/transactions' className='orange mx-2 navlink font-bold'>
                          View More
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
      </div>

      </>
    );
  }
}
