import React from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from '../components/navbar';
import moment from 'moment';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import App from '../components/app';
import axios from 'axios';

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
          timestamp: null,
          extras: {
            pool: {
              name: null
            }
          }
        }
      ],
      transactions: [
        {
          txid: null,
          value: null,
          fee: null
        }
      ],
      usd: {
        data: {
          last: null,
          last_change: null,
          open: null
        }
      },
      kes: null,
      ngn: null,
      ugx: null,
      random: {
        speaker: null,
        text: null,
        date: null
      },
      hash: null,
      marketCap: null,
      coins: null,
      nodes: null,
      nextBlock: {
        count: null,
        total_fee: null,
        vsize: null
      },
      change: {
        open: null,
        last: null
      }
    });
    this.handleClick = this.handleClick.bind(this);
    this.handleClickUp = this.handleClickUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClickUp(event) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  handleClick(event) {
    document.getElementById('section2').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
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
      fetch('https://mempool.space/api/v1/difficulty-adjustment'),
      fetch('https://mempool.space/api/v1/fees/recommended'),
      fetch('https://mempool.space/api/v1/blocks-extras/'),
      fetch('https://mempool.space/api/mempool/recent'),
      fetch('https://bitpay.com/api/rates'),
      fetch('https://api.bitaps.com/market/v1/ticker/btcusd'),
      fetch('https://api.bitaps.com/btc/v1/nodes/list'),
      fetch('https://mempool.space/api/v1/fees/mempool-blocks'),
      fetch('https://mempool.space/api/v1/mining/hashrate/1d')
    ]).then(async ([a, b]) => {
      const difficulty = await a.json();
      const fees = await b.json();

      return [difficulty, fees]
    })
      .then((data) => {
        console.log(data);

      //  this.setState({
      //     difficulty: data[0],
      //     fees: data[1],
      //     blocks: data[2],
      //     transactions: data[3],
      //     usd: data[6],
      //     kes: data[4][81].rate,
      //     ngn: data[4][110].rate,
      //     ugx: data[4][151].rate,
      //     random: data[5],
      //     hash: data[7]['7Day'].val,
      //     marketCap: data[8],
      //     coins: data[9],
      //     nodes: data[10].data.length,
      //     nextBlock: data[11],
      //     change : data[12]
      //   })
      }).catch((err) => {
        console.log(err);
      });
  }



  render() {
    return (
      <>
        <Nav history={this.props.history} />

        <section className='banner pt-4 pb-4'>
          <div className="container work-sans">
              <div className="row pt-3">
                <div className="col-md-12">
                  <div className="text-center">
                  <h1 className='py-5 explorer-header'> Access the Bitcoin Blockchain with amaano</h1>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className='section1'>
            <div className="container work-sans ">
            <div className="row mt-3">
              <div className="col-md-12">
                <Card className='px-3 py-3 rounded blue-border text-left'>
                  <h2>Explorer</h2>
                  <Card.Text className='px-0 py-2'>
                    A blockchain is a distributed ledger that records the transactions for a cryptocurrency network. Miners amend the blockchain ledger by mining new blocks.
                    A blockchain explorer is a tool that enables you to explore real-time and historical information about the blockchain of a cryptocurrency. This includes data related to your personal wallet's address, mining and transactions.
                  </Card.Text>
                  <Card.Body>
                    <h3>Start by searching for your wallet's address...</h3>
                    <Form onSubmit={this.handleSubmit} className=''>
                      <InputGroup className="mb-2" >
                        <FormControl
                          placeholder="Search for your Wallet Address    i.e. 3FHNBLobJnbCTFTVakh5TXmEneyf5PT61B "
                          className='blue-border'
                          onChange={this.handleChange}
                          value={this.state.input}
                          type='search'
                        />
                        <Button className="search-button" type='submit'>
                          Search
                        </Button>
                      </InputGroup>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <App />
                </div>
              </div>
              <div className="row amaano-blue my-3">
                <div className="col-md-12">
                <Tabs defaultActiveKey="USD" className=" blue-border amaano-secondary">
                  <Tab eventKey="USD" title="USD" className='blue-border border-top px-3 py-3 amaano-secondary'>
                    <div className="row">
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Price</p>
                        <p>${(this.state.usd.data.last)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p>24hr change: <span className={(this.state.change.last - this.state.change.open) / this.state.change.open * 100 > 0 ? 'green' : 'red'}>
                            {((this.state.change.last - this.state.change.open) / this.state.change.open*100).toFixed(2)}%
                          </span>
                        </p>
                      </div>
                      <div className="col-lg-3 text-left">
                        <p className='font-underline'>Supply</p>
                        <p>
                          Total Circulating Supply: {this.state.coins?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/21,000,000 <i class="fa-brands fa-bitcoin orange"></i>
                        </p>
                        <p>Total Bitcoin Market Cap: ${((this.state.marketCap) / 1000000000).toFixed(2)} Billion</p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Network</p>
                        <p>
                          Network Hashrate: {this.state.hash} EH 7 Day Moving Average
                        </p>
                        <p>
                          Nodes Detected: {this.state.nodes}
                        </p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>
                          Mempool
                        </p>
                        <p>
                          Unconfirmed Transactions: {this.state.nextBlock.count}
                        </p>
                        <p>
                          Average Fees: {(this.state.nextBlock.total_fee / this.state.nextBlock.vsize).toFixed(2)} sat/vB
                        </p>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="KES" title="KES" className='blue-border border-top px-3 py-3'>
                    <div className="row">
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Price</p>
                        <p>Ksh {(this.state.kes)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p>24hr change: <span className={(this.state.change.last - this.state.change.open) / this.state.change.open * 100 > 0 ? 'green' : 'red'}>
                          {((this.state.change.last - this.state.change.open) / this.state.change.open * 100).toFixed(2)}%
                        </span>
                        </p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Supply</p>
                        <p>
                          Total Circulating Supply: {this.state.coins?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/21,000,000 <i class="fa-brands fa-bitcoin orange"></i>
                        </p>
                        <p>Total Bitcoin Market Cap: ${((this.state.marketCap) / 1000000000).toFixed(2)} Billion</p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Network</p>
                        <p>
                          Network Hashrate: {this.state.hash} EH 7 Day Moving Average
                        </p>
                        <p>
                          Nodes Detected: {this.state.nodes}
                        </p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>
                          Mempool
                        </p>
                        <p>
                          Unconfirmed Transactions: {this.state.nextBlock.count}
                        </p>
                        <p>
                          Average Fees: {(this.state.nextBlock.total_fee / this.state.nextBlock.vsize).toFixed(2)} sat/vB
                        </p>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="NGN" title="NGN" className='blue-border border-top px-3 py-3'>
                    <div className="row">
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Price</p>
                        <p>₦ {(this.state.ngn)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p>24hr change: <span className={(this.state.change.last - this.state.change.open) / this.state.change.open * 100 > 0 ? 'green' : 'red'}>
                          {((this.state.change.last - this.state.change.open) / this.state.change.open * 100).toFixed(2)}%
                        </span>
                        </p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Supply</p>
                        <p>
                          Total Circulating Supply: {this.state.coins?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/21,000,000 <i class="fa-brands fa-bitcoin orange"></i>
                        </p>
                        <p>Total Bitcoin Market Cap: ${((this.state.marketCap) / 1000000000).toFixed(2)} Billion</p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Network</p>
                        <p>
                          Network Hashrate: {this.state.hash} EH 7 Day Moving Average
                        </p>
                        <p>
                          Nodes Detected: {this.state.nodes}
                        </p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>
                          Mempool
                        </p>
                        <p>
                          Unconfirmed Transactions: {this.state.nextBlock.count}
                        </p>
                        <p>
                          Average Fees: {(this.state.nextBlock.total_fee / this.state.nextBlock.vsize).toFixed(2)} sat/vB
                        </p>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="UGX" title="UGX" className='blue-border border-top px-3 py-3'>
                    <div className="row">
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Price</p>
                        <p>USh {(this.state.ugx)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p>24hr change: <span className={(this.state.change.last - this.state.change.open) / this.state.change.open * 100 > 0 ? 'green' : 'red'}>
                          {((this.state.change.last - this.state.change.open) / this.state.change.open * 100).toFixed(2)}%
                        </span>
                        </p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Supply</p>
                        <p>
                          Total Circulating Supply: {this.state.coins?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/21,000,000 <i class="fa-brands fa-bitcoin orange"></i>
                        </p>
                        <p>Total Bitcoin Market Cap: ${((this.state.marketCap) / 1000000000).toFixed(2)} Billion</p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>Network</p>
                        <p>
                          Network Hashrate: {this.state.hash} EH 7 Day Moving Average
                        </p>
                        <p>
                          Nodes Detected: {this.state.nodes}
                        </p>
                      </div>
                      <div className="col-md-3 text-left">
                        <p className='font-underline'>
                          Mempool
                        </p>
                        <p>
                          Unconfirmed Transactions: {this.state.nextBlock.count}
                        </p>
                        <p>
                          Average Fees: {(this.state.nextBlock.total_fee / this.state.nextBlock.vsize).toFixed(2)} sat/vB
                        </p>
                      </div>
                    </div>
                  </Tab>
                </Tabs>

              </div>
              </div>
              <div className="row my-3">
                <div className="col-sm-12">
                <Card className='px-2 py-3 grey-background blue-border'>
                    <p>{this.state.random.text} - {this.state.random.speaker}, {this.state.random.date}
                    </p>
                  </Card>
                </div>
              </div>

              <div className="row justify-content-center my-3" >
                <div className="col-md-12">
                <Form onSubmit={this.handleSubmit} className=''>
                  <InputGroup className="mb-2" >
                    <FormControl
                      placeholder="Search for your Wallet Address    i.e. 3FHNBLobJnbCTFTVakh5TXmEneyf5PT61B "
                      className='blue-border'
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
              </div>
            <div className="row mb-3 justify-content-center">
              <div className="col-md-6">
                <Table className='blue-border'>
                  <tbody className='blue-border'>
                    <tr >
                      <td colSpan={2} className='blue-border font-bold '>Current Transaction Fees</td>
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
                <Table className='blue-border'>
                  <tbody>
                    <tr>
                      <td colSpan={4} className='font-bold'>Latest Blocks</td>
                    </tr>
                    <tr className='font-bold'>
                      <td>Block Height</td>
                      <td>Number of Transactions</td>
                      <td>Mining Pool</td>
                      <td>TimeStamp</td>
                    </tr>
                    {this.state.blocks.slice(0, 5).map((block, i) => {
                      return (
                        <>
                          <tr key={i}>
                            <td className='grey-text'>{this.state.blocks[i].height}</td>
                            <td className='grey-text'>{this.state.blocks[i].tx_count}</td>
                            <td className='grey-text'>{this.state.blocks[i].extras.pool.name}</td>
                            <td className='grey-text'>{(moment.unix(this.state.blocks[i].timestamp).format('MMMM Do YYYY, h:mm:ss a').toString())}</td>
                          </tr>
                        </>
                      );
                    }
                    )}
                    <tr>
                      <td colSpan={4}>
                        <Link to='/mining' className='amaano-secondary mx-2 viewmore font-bold'>
                          Learn more about Mining
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="row mb-3 justify-content-center">
              <div className="col-md-12">
                <Table className='blue-border' responsive='sm'>
                  <tbody>
                    <tr>
                      <td colSpan={4} className='orange-border font-bold'>Latest Transactions</td>
                    </tr>
                    <tr className='font-bold'>
                      <td>Transaction ID</td>
                      <td>Value</td>
                      <td>Fees</td>
                    </tr>
                    {this.state.transactions.slice(0, 5).map((transaction, i) => {
                      return (
                        <>
                          <tr key={i}>
                            <td className='grey-text'>{this.state.transactions[i].txid}</td>
                            <td className='grey-text'>{(this.state.transactions[i].value) / 100000000} BTC</td>
                            <td className='grey-text'>{(this.state.transactions[i].fee) / 100} sat/vB</td>
                          </tr>
                        </>
                      );
                    }
                    )}
                    <tr>
                      <td colSpan={4}>
                        <Link to='/transactions' className='amaano-secondary mx-2 viewmore font-bold'>
                          Learn more about Transactions
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="row">
              <button onClick={this.handleClickUp} className='scrolldown'>
                <i class="fa-solid fa-3x fa-caret-up"></i>
              </button>
            </div>
          </div>
        </section>

      </>
    );
  }
}
