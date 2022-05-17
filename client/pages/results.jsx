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
      transactionData: [
        {
          txid: '',
          status: {
            block_height: null,
            block_time: null
          }
        }
      ],
      balance: [
        {
        sent: null,
        received: null
      }
    ]
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
    fetch(`https://mempool.space/api/address/${address}/txs`)
      .then(res => res.json())
      .then(data => {
        this.setState({ transactionData: data });
      }),
    fetch(`https://btc.nownodes.io/api/v2/balancehistory//${address}`, {
      headers: {
        "api-key": '66783fe5-6850-495a-a41e-dd61e133335d',
        "Content-Type": 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({balance: data})
        console.log(data)
      }),
    fetch('https://bitpay.com/api/rates')
      .then(res => res.json())
      .then(data => {
        this.setState({ price: (data[2].rate) });
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
              <div className="row pt-3 margin-right-10 margin-left-6">
                <div className='col-sm-9 col-md-11'>
                  <p className='address-header font-titillium-web amaano-blue'>
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
              <div className="row my-2 margin-left-1 margin-right-1">
                <Card className='mb-2 my-2 font-titillium-web px-4 py-4 grey-background blue-border'>
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
              <div className="row mt-3 mb-5 margin-left-1 margin-right-1 px-0 justify-content-center pb-5">
               <div className="col-md-12">


                <Table className='blue-border' responsive='sm'>
                  <tbody>
                    <tr>
                      <td className='blue-border font-bold'>Transaction History</td>
                    </tr>
                    <tr className='font-bold'>
                      <td>Transaction Id</td>
                      <td>Value</td>
                      <td>Fees</td>
                    </tr>

                    {/* {this.state.transactionData.map((transaction, i) => {
                        return (
                          <>
                            <tr key={i}>
                              <td className='grey-text'>{this.state.transactionData[i].txid}</td>
                            </tr>
                          </>
                        )
                        }
                      )}
                    {this.state.balance.reverse().map((balance, i) => {
                      return (
                        <>
                            <td className='grey-text'>{this.state.balance[i].sent}</td>
                        </>
                      )
                    }
                    )} */}



                  </tbody>
                </Table>
               </div>
              </div>
              <Card className='blue-border padding-zero font-size-20 grey-background'>
                <Card.Header className='mx-0 font-titillium-web font-bold amaano-blue card-border'>Transaction History</Card.Header>
                <ul>
                  <li>
                    <Card.Title className='amaano-secondary'>Transaction ID: {this.state.transactionData[0].txid}</Card.Title>
                  </li>
                  <li>
                    <Card.Title className='amaano-secondary'>Block Height: {this.state.balance[this.state.balance.length-1].received}</Card.Title>
                  </li>
                </ul>
              </Card>
                {/* <Card className='blue-border padding-zero font-size-20 grey-background'>
                <Card.Header className='mx-0 font-titillium-web font-bold amaano-blue card-border'>Transaction History</Card.Header>
                <ul>
                  <li>
                    <Card.Title className='amaano-secondary'>Transaction ID: {this.state.transactionData[0].txid}</Card.Title>
                  </li>
                  <li>
                    <Card.Title className='amaano-secondary'>Block Height: {this.state.balance[this.state.balance.length-1].received}</Card.Title>
                  </li>
                </ul>

                <ul className='px-4 py-2 amaano-blue'>
                    {this.state.transactionData.slice(0, 5).map((transactionData, i) => {
                      return (
                        <li key={i}>
                          <Card.Title className='amaano-secondary'>Transaction ID: {transactionData.txid}</Card.Title>
                          <ul>
                            <li>
                              <Card.Title className='amaano-secondary'>Block Height: {transactionData.status.block_height}</Card.Title>
                            </li>
                            <li>
                              <Card.Title className='amaano-secondary'>Time: {(moment.unix(transactionData.status.block_time).format('MMMM Do YYYY, h:mm:ss a').toString())}</Card.Title>
                            </li>
                          </ul>
                        </li>
                      );
                    })}

                  </ul>
                </Card> */}
            </div>) :
            (<h1 className='amano-blue ml-2 font-titillium-web px-5 py-5'>No Results Found, Please Try again.</h1>)}
      </>
    );
  }
}


// import React from 'react';
// import queryString from 'query-string';
// import Nav from '../components/navbar';
// import Card from 'react-bootstrap/Card';
// import moment from 'moment';
// export default class Results extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = ({
//       address: queryString.parse(this.props.location.search).address,
//       price: null,
//       wallet: {
//         final_balance: null,
//         n_tx: null,
//         txs: [{
//           hash: null,
//           block_height: null,
//           result: null,
//           time: null
//           }
//         ]
//       }
//     });
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//     this.handleClick = this.handleClick.bind(this);
//   }
//   componentDidMount() {
//     this.unlisten = this.props.history.listen((location, action) => {
//       this.setState({ results: true, address: queryString.parse(location.search).address });
//       this.fetchData(queryString.parse(location.search).address);
//     });
//     this.fetchData(this.state.address);
//   }
//   componentWillUnmount() {
//     this.unlisten();
//     this.setState({results: true})
//   }

//   fetchData(address) {
//     fetch(`https://blockchain.info/rawaddr/${address}`)
//       .then(response => response.ok ? response.json() : Promise.reject({ err: response.status }))
//       .then(data => {
//           this.setState({ wallet: data });
//         })
//       .catch(err => {
//         alert('No Results Found', err)
//         this.setState({results : false})
//         console.log(err)
//       });
//     fetch('https://bitpay.com/api/rates')
//       .then(res => res.json())
//       .then(data => {
//         this.setState({ price: (data[2].rate) });
//       })
//   }

//   handleSubmit(event) {
//     event.preventDefault();
//     this.props.history.push('/search-results?address=' + this.state.input);
//   }
//   handleChange(event) {
//     this.setState({ input: event.target.value });
//   }
//   handleClick(event) {
//     event.preventDefault();
//     const timeStamp = new Date().toLocaleString();
//     const postData = {
//       userId: 1,
//       walletAddress: this.state.address,
//       data: this.state.walletData,
//       bookmarkedAt: timeStamp
//     };
//   }
//   render() {
//     return (
//       <>
//         <Nav history={this.props.history} onSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.input} />
//           {this.state.results ?
//           (<div className="container-fluid work-sans " style={{ maxWidth: '1200px' }}>
//               <div className="row pt-3 margin-right-10 margin-left-6">
//                 <div className='col-sm-9 col-md-11'>
//                   <p className='address-header  font-underline amaano-blue'>
//                     Search Address: {this.state.address}
//                   </p>
//                 </div>
//               </div>
//               <div className="row my-2 margin-left-1 margin-right-1">
//                 <Card className='mb-2 my-2  px-4 py-4 grey-background blue-border'>
//                   <div className="row no-gutters">
//                     <div className="col-md-3 col-sm-10 px-1 justify-content-center margin-left-14" style={{ minWidth: '275px' }}>
//                       <img className='blue-border' src={`https://www.bitcoinqrcodemaker.com/api/?style=bitcoin&address=${this.state.address}`} alt="bitcoin QR code generator" height="250" width="275" />
//                     </div>
//                     <div className="col-md-8 col-sm-10 margin-left-1 px-0 mt-2 justify-content-start align-self-center amaano-blue">
//                       <Card.Title className='info-text'>Total Balance: {(this.state.wallet.final_balance) / 100000000} BTC</Card.Title>
//                       <Card.Title className='info-text'>$
//                       {((this.state.wallet.final_balance) / 100000000 * (this.state.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </Card.Title>
//                       <Card.Title className='info-text'>Total Number of Transactions: {this.state.wallet.n_tx}</Card.Title>
//                     </div>
//                   </div>
//                 </Card>
//               </div>
//               <div className="row mt-3 mb-5 margin-left-1 margin-right-1 px-0 justify-content-center pb-5">
//                 <Card className='blue-border padding-zero font-size-20 grey-background'>
//                 <Card.Header className='mx-0  font-bold amaano-blue'>Transaction History</Card.Header>
//                 <ul className='px-4 py-2 amaano-blue'>
//                     {this.state.wallet.txs.map((tx, i) => {
//                       return (
//                         <li key={i}>
//                           <Card.Title className='amaano-secondary'>Transaction ID: {tx.hash}</Card.Title>
//                           <ul>
//                             <li>
//                               <Card.Title className='amaano-secondary'>Transaction Amount: <span className={tx.result > 0 ? 'green' : 'red'}>
//                                   {tx.result / 100000000}
//                                 </span> BTC
//                               </Card.Title>
//                             </li>
//                             <li>
//                               <Card.Title className='amaano-secondary'>
//                                 $ <span className={tx.result > 0 ? 'green' : 'red'}>
//                                    {((tx.result) / 100000000 * (this.state.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                 </span>
//                               </Card.Title>
//                             </li>
//                             <li>
//                               <Card.Title className='amaano-secondary'>Block Height: {tx.block_height}</Card.Title>
//                             </li>
//                             <li>
//                               <Card.Title className='amaano-secondary'>
//                                 Time: {(moment.unix(tx.time).format('MMMM Do YYYY, h:mm:ss a').toString())}
//                                 </Card.Title>
//                             </li>

//                           </ul>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </Card>
//               </div>
//             </div>) :
//           (<h1 className='amaano-blue ml-2 work-sans  px-5 py-5'>No Results Found, Please Try again.</h1>)}
//       </>
//     );
//   }
// }
