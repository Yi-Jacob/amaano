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
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

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
      ],
      usd: null,
      kes: null,
      ngn: null,
      ugx: null
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
    setTimeout(
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
          }),
        fetch('https://bitpay.com/api/rates')
          .then(res => res.json())
          .then(data => {
            this.setState({
              usd: data[2].rate,
              kes: data[81].rate,
              ngn: data[110].rate,
              ugx: data[151].rate
            });
          })
      ]), 10000
    )
  }

  render() {
    return (
      <>
          <Nav history={this.props.history} />
          <section className='section1'>
            <div className="container work-sans ">
              <div className="row amaano-blue my-3">
                <div className="col-sm-12">
                  <h1 className='text-center font-bold' id='section1'>amaano</h1>
                </div>
              </div>
              <div className="row my-3">
                <div className="col-sm-12">
                  <h2 className='text-center font-bold amaano-blue'>Access the Bitcoin Blockchain with amaano</h2>
                </div>
              </div>

              <div className="row justify-content-center mb-4" >
                <Form onSubmit={this.handleSubmit} className='my-3 px-2 "col-sm-11'>
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
            <div className="row mb-2">
              <div className="col-md-6">
                <div class="mx-auto text-center mb-2">
                  <img src='iphone.gif' height="225" width='150'></img>
                </div>
              </div>
              <div className="col-md-6">
                <div class="mx-auto text-center">
                  <h2>Download Today!</h2>
                </div>
                <div class="mx-auto text-center">
                  <a href='https://apps.apple.com/us/app/amaano/id1334610525'>
                    <img src='iphone.png' height="75" width='155' href=""></img>
                  </a>
                </div>
                <div class="mx-auto text-center">
                  <a href='https://play.google.com/store/apps/details?id=com.creadigol.amaano'>
                    <img src='google-play.png' height="110" width='175'></img>
                  </a>
                </div>
              </div>
            </div>
            <div className="row">
              <button onClick={this.handleClick} className='scrolldown'>
                <i class="fa-solid fa-3x fa-caret-down"></i>
              </button>
            </div>
          </div>
        </section>

        <section className='section2 pt-3' id='section2'>
          <div className="container">
            <div className="row">
              <button onClick={this.handleClickUp} className='scrolldown'>
                <i class="fa-solid fa-3x fa-caret-up"></i>
              </button>
            </div>
            <div className="row mb-4 justify-content-center">
              <div className="col-md-12">
                <Tabs defaultActiveKey="USD" className=" blue-border amaano-secondary">
                  <Tab eventKey="USD" title="US Dollar" className='blue-border border-top px-2 amaano-secondary'>
                    <i class="fa-brands fa-bitcoin orange"></i> = ${this.state.usd}
                  </Tab>
                  <Tab eventKey="KES" title="Kenyan Shilling" className='blue-border border-top px-2'>
                    <i class="fa-brands fa-bitcoin orange"></i> = KSh {this.state.kes}
                  </Tab>
                  <Tab eventKey="NGN" title="Nigerian Naira" className='blue-border border-top px-2'>
                    <i class="fa-brands fa-bitcoin orange"></i> = ₦ {this.state.ngn}
                  </Tab>
                  <Tab eventKey="UGX" title="Ugandan Shilling" className='blue-border border-top px-2'>
                    <i class="fa-brands fa-bitcoin orange"></i> = USh {this.state.ugx}
                  </Tab>
                </Tabs>
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
                    {this.state.blocks.slice(0, 5).map((block, i) => {
                      return (
                        <>
                          <tr key={i}>
                            <td className='grey-text'>{this.state.blocks[i].height}</td>
                            <td className='grey-text'>{this.state.blocks[i].tx_count}</td>
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
          </div>
        </section>
      </>
    );
  }
}
