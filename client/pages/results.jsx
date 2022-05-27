import React from 'react';
import queryString from 'query-string';
import Nav from '../components/navbar';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import moment from 'moment';
import Popover from 'react-bootstrap/Popover'
import Table from 'react-bootstrap/Table';
import Navbar2 from '../components/miniNav';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      transaction: false,
      address: queryString.parse(this.props.location.search).address,
      price: null,
      input: null,
      walletData: {
        chain_stats: {
          tx_count: 0,
          funded_txo_sum: 0,
          spent_txo_sum: 0
        }
      },
      transactionHistory: {
        data: {
          list: [{
            fee: null,
            amount: null,
            blockHeight: null,
            blockTime: null,
            confirmations: null,
            txId: null,
            inputsCount: null,
            outsCount: null,
            vSize: null
          }]
        }
      },
      transactionData: {
        txid: null,
        vin: [{
          prevout: {
            scriptpubkey_address: null,
            value: null
          }
        }],
        vout: [{
          scriptpubkey_address: null,
          value: null
        }],
        fee: null,
        size: null,
        status: {
          confirmed: null,
          block_height: null,
          block_time: null
        }
      }

    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.pathname == '/search-results') {
        this.setState({ address: queryString.parse(location.search).address });
        this.fetchData(queryString.parse(location.search).address);
      }
    });
    this.fetchData(this.state.address);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  fetchData(address) {
    fetch(`https://mempool.space/api/tx/${address}`)
    .then(data => data.json())
    .then((data) => {
      this.setState({
        transaction: true,
        transactionData: data
      })
      console.log(data)
    })
    if(this.state.transaction === false) {
      fetch((`https://mempool.space/api/address/${address}`))
        .then(data => data.json())
        .then((data) => {
          this.setState({
            walletData: data
          })
          console.log(data)
        }),
        fetch(`https://api.bitaps.com/btc/v1/blockchain/address/transactions/${address}`)
          .then(data => data.json())
          .then((data) => {
            this.setState({
              transactionHistory: data
            })
            console.log(data)
          }),
        fetch('https://bitpay.com/api/rates')
          .then(data => data.json())
          .then((data) => {
            this.setState({
              price: data[2].rate
            })
          })
    }
  }

  handleClickUp(event) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push('/search-results?=' + this.state.input);
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  handleClick(event) {
    event.preventDefault();
  }

  hidePopover(event) {
    setTimeout(function () { closePopPver() }, 500);
  }


  render() {
    return (
      <>
        {/* <Nav history={this.props.history} /> */}
        {/* <Navbar2 history={this.props.history} /> */}
      {this.state.transaction ? (
      <div className="container-fluid" style={{ maxWidth: '1200px' }}>
            <Navbar2 history={this.props.history} />
        <div className="row">
          <div className="col-md-12">
            <p className='address-header font-titillium-web amaano-blue pt-3 pb-0 mb-0'>
                  Transaction Id: {this.state.transactionData.txid}
                  <OverlayTrigger
                    delay
                    rootClose
                    trigger='click'
                    placement='right'
                    overlay={
                      <Popover className='blue-border'>
                        <Popover.Body>
                          Copied!
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <button className='scrolldown amaano-blue' onClick={() => { navigator.clipboard.writeText(this.state.address) }}>
                      <i class="fa-solid fa-copy"></i>
                    </button>
                  </OverlayTrigger>
              </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
                <table>
                  <tbody>
                    <tr>
                      <td>Confirmed</td>
                      <td>{(moment.unix(this.state.transactionData.status.block_time).format('MMMM Do YYYY, h:mm:ss a').toString())}</td>
                    </tr>
                    <tr>
                      <td>Block</td>
                      <td>{this.state.transactionData.status.block_height}</td>
                    </tr>
                    <tr>
                      <td>Fees</td>
                      <td>
                        {(this.state.transactionData.fee) / 100000000} BTC ||
                        ${((this.state.transactionData.fee) / 100000000) * this.state.price}
                      </td>
                    </tr>
                    <tr>
                      <td>Size ~ {this.state.transactionData.size}</td>
                      <td>Fee Rate {((this.state.transactionData.fee) / (this.state.transactionData.size)).toFixed(2)} sat/vB</td>
                    </tr>
                  </tbody>
                </table>
          </div>
        </div>
        <div className="row mt-4">

          <div className="col-md-6">
            <table>
                  <tbody>
                    <tr>
                      <td colSpan={2}>Inputs</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>Amount</td>
                    </tr>
                    {this.state.transactionData.vin.map((input, i) => {
                      return (
                        <tr key={i}>
                          <td>{input.prevout.scriptpubkey_address}</td>
                          <td>{(input.prevout.value) / 100000000} BTC</td>
                        </tr>
                      )
                    })}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
               <table>
                 <tbody>
                    <tr>
                      <td colSpan={2}>Outputs</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>Amount</td>
                    </tr>
                    {this.state.transactionData.vout.map((input, i) => {
                      return (
                        <tr key={i}>
                          <td>{input.scriptpubkey_address}</td>
                          <td>{(input.value) / 100000000} BTC</td>
                        </tr>
                      )
                    })}
                 </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <button onClick={this.handleClickUp} className='scrolldown'>
            <i class="fa-solid fa-3x fa-caret-up"></i>
          </button>
          </div>
      </div>
      ) : (


        <div className="container-fluid" style={{ maxWidth: '1200px' }}>
              <Navbar2 history={this.props.history} />
            <div className="row margin-right-10 margin-left-6">
              <div className='col-sm-9 col-md-11'>
                <p className='address-header font-titillium-web amaano-blue pt-3 pb-0 mb-0'>
                  Search Address: {this.state.walletData.address}
                  <OverlayTrigger
                    delay
                    rootClose
                    trigger='click'
                    placement='right'
                    overlay={
                      <Popover className='blue-border'>
                        <Popover.Body>
                          Copied!
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <button className='scrolldown amaano-blue' onClick={() => { navigator.clipboard.writeText(this.state.address) }}>
                      <i class="fa-solid fa-copy"></i>
                    </button>
                  </OverlayTrigger>
                </p>

              </div>
            </div>
            <div className="row my-0 margin-left-1 margin-right-1">
              <Card className='mb-2 my-2 px-4 py-4 grey-background blue-border'>
                <div className="row no-gutters">
                  <div className="col-md-3 col-sm-10 px-1 justify-content-center margin-left-14" style={{ minWidth: '275px' }}>
                    <img className='blue-border' src={`https://www.bitcoinqrcodemaker.com/api/?style=bitcoin&address=${this.state.address}`} alt="bitcoin QR code generator" height="250" width="275" />
                  </div>
                  <div className="col-md-8 col-sm-10 margin-left-1 px-0 mt-2 justify-content-start align-self-center amaano-blue">
                    <Card.Title className='info-text'>Total Balance: {(this.state.walletData.chain_stats.funded_txo_sum - this.state.walletData.chain_stats.spent_txo_sum) / 100000000} BTC</Card.Title>
                    <Card.Title className='info-text'>$
                      {((this.state.walletData.chain_stats.funded_txo_sum - this.state.walletData.chain_stats.spent_txo_sum) / 100000000 * (this.state.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Card.Title>
                    <Card.Title className='info-text'>Total Number of Transactions: {this.state.walletData.chain_stats.tx_count}</Card.Title>
                  </div>
                </div>
              </Card>
            </div>
            <div className="row margin-right-10 margin-left-6">
              <div className='col-md-12'>
                <p className='address-header font-titillium-web amaano-blue pt-2 pb-0'>
                  Transaction History
                </p>
              </div>
            </div>

            <div className="row margin-left-1 margin-right-1 mb-3">

                {this.state.transactionHistory.data.list.slice(0, 10).map((transaction, i) => {
                  return (
                      <>
                      <div className="row" key={i}>
                        <div className="col-md-12">
                          <table>
                            <tbody>
                              <tr className='font-bold'>
                                <td>Transaction ID:</td>
                                <td>{transaction.txId}</td>
                              </tr>
                              <tr>
                                <td>{(transaction.amount) > 0 ?
                                  (<span>Received: </span>) :
                                  (<span>Sent:  </span>)
                                }</td>
                                <td><span className={(transaction.amount) > 0 ? 'green' : 'red'}>{(transaction.amount) / 100000000} BTC || ${((transaction.amount) / 100000000 * (this.state.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></td>
                              </tr>
                              <tr>
                                <td>Confirmed:</td>
                                <td>{(moment.unix(transaction.blockTime).format('MMMM Do YYYY, h:mm:ss a').toString())} || Block: {transaction.blockHeight}</td>
                              </tr>
                              <tr>
                                <td>Fees</td>
                                <td><span className='red'>{(transaction.fee) / 100000000} BTC || ${((transaction.fee) / 100000000 * (this.state.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> <span className='small-text py-3 my-4'> ~ {((transaction.fee) / transaction.vSize).toFixed(2)} sat/vB - {transaction.confirmations} Confirmations</span></td>
                              </tr>
                            </tbody>
                          </table>

                        </div>
                      </div>


                      </>
                  )
                }
                )}
            </div>
            <div className="row">
              <button onClick={this.handleClickUp} className='scrolldown'>
                <i class="fa-solid fa-3x fa-caret-up"></i>
              </button>
            </div>
          </div>)}
      </>
    );
  }
}
