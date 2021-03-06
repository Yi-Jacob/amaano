import React from 'react';
import queryString from 'query-string';
import Nav from '../components/navbar';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import moment from 'moment';
import Popover from 'react-bootstrap/Popover'
import Table from 'react-bootstrap/Table';


export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      results: true,
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
    Promise.all([
      fetch(`https://mempool.space/api/address/${address}`)
        .then(res => res.json())
        .then(data => {
          this.setState({ walletData: data });
        })
        .catch(err => {
          alert('No Results Found', err)
          this.setState({ results: false })
        }),
      fetch('https://bitpay.com/api/rates')
        .then(res => res.json())
        .then(data => {
          this.setState({ price: (data[2].rate) });
        }),
      fetch(`https://api.bitaps.com/btc/v1/blockchain/address/transactions/${address}`)
        .then(res => res.json())
        .then(data => {
          this.setState({ transactionHistory: data });
        })
    ])
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push('/search-results?address=' + this.state.input);
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  handleClick(event) {
    event.preventDefault();
  }

  hidePopover(event) {
    setTimeout(function () { closePopPver() }, 5000);
  }


  render() {
    return (
      <>
        <Nav history={this.props.history} onSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.input} />
        {this.state.results ?
          (<div className="container-fluid" style={{ maxWidth: '1200px' }}>
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
              <Card className='mb-2 font-titillium-web px-3 py-2  blue-border'>
                {this.state.transactionHistory.data.list.slice(0, 10).map((transaction, i) => {
                  return (
                    <div className="" key={i}>
                      <div className="row" key={i}>
                        <div className="col-md-12">
                          <Card.Title className='amaano-secondary' style={{ fontWeight: '700' }}>
                            Transaction ID: {transaction.txId}
                          </Card.Title>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 px-0">
                          <ul>
                            <li>
                              {(transaction.amount) > 0 ?
                                (<span>Received: </span>) :
                                (<span>Sent:  </span>)
                              }
                              <span className={(transaction.amount) > 0 ? 'green' : 'red'}>{(transaction.amount) / 100000000} BTC</span>
                              <ul className={(transaction.amount) > 0 ? 'green' : 'red'}>
                                <li>
                                  ${((transaction.amount) / 100000000 * (this.state.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                        <div className="col-md-4 px-0">
                          <ul>
                            <li>
                              <li>
                                <span>Fees: </span>
                                <span className='red'>{(transaction.fee) / 100000000} BTC</span>
                                <ul>
                                  <li>
                                    <span className='red'> ${((transaction.fee) / 100000000 * (this.state.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <span className='small-text py-3 my-4'> ~ {((transaction.fee) / transaction.vSize).toFixed(2)} sat/vB</span>
                                  </li>
                                </ul>
                              </li>
                            </li>
                          </ul>
                        </div>
                        <div className="col-md-5 px-0 my-0">
                          <ul>
                            <li>
                              <span className='green'>Confirmed:</span> {(moment.unix(transaction.blockTime).format('MMMM Do YYYY, h:mm:ss a').toString())}
                            </li>
                            <ul>
                              <li>
                                Block Height {transaction.blockHeight}
                              </li>
                              <li>
                                Confirmations: <span className='green'>{transaction.confirmations}</span>
                              </li>
                            </ul>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                )}

              </Card>
            </div>
          </div>) :
          (
            <div className="row my-2 margin-left-1 margin-right-1">
              <Card className='mb-2 my-2 font-titillium-web px-4 py-4 grey-background blue-border'>
                <div className="row no-gutters">
                  <div className="col-md-12 px-1 justify-content-center text-center">
                    <h2 className='amaano-blue'>
                      No Results Found
                    </h2>
                  </div>
                </div>
              </Card>
            </div>
          )}
      </>
    );
  }
}
