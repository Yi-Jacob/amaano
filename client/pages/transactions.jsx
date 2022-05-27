import React from 'react';
import Nav from '../components/navbar';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Navbar2 from '../components/miniNav';

export default class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      fees: {
        fastestFee: null,
        halfHourFee: null,
        hourFee: null
      },
      transactions: [
        {
          txid: null,
          value: null,
          fee: null
        }
      ],
      price: null
    });
  }

  handleClickUp(event) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push('/search-results?=' + this.state.input);
    this.setState({
      input: ''
    });
  }

  fetchData() {
    Promise.all([
      fetch('https://mempool.space/api/v1/fees/recommended'),
      fetch('https://mempool.space/api/mempool/recent'),
      fetch('https://api.bitaps.com/market/v1/ticker/btcusd')
    ])
      .then(async ([a, b, c]) => {
        const fees = await a.json();
        const transactions = await b.json();
        const price = await c.json();

        return [fees, transactions, price]
      })
      .then(data => {
        this.setState({
          fees: data[0],
          transactions: data[1],
          price: data[2].data.last,
        })
      })
  }

  componentDidMount() {
    this.fetchData()
    this.intervalId = setInterval(() => {
      this.fetchData();
    }, 1000)
  }

  render() {
    return (

      <>
      <div className="container">
          <Navbar2 history={this.props.history} />
          {/* <Nav history={this.props.history} onSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.input} /> */}
          <div className="row mx-4 my-3 work-sans ">
            <h2 className='amaano-blue ml-2'>Transactions</h2>
            <div className="col-md-12">
              <Card className='mb-2 my-1 px-4 py-4 blue-border'>
                <Card.Title className='card-text amaano-secondary'>
                  Transaction fees are the difference between the amount of bitcoin sent and the amount received.
                  Conceptually, transaction fees are a reflection of the speed with which a user wants their transaction validated on the blockchain.
                  The faster a user wants a transaction settled, the higher the fee will be.
                </Card.Title>
              </Card>
            </div>
          </div>
          <div className="row mx-4 my-3">
            <div className="col-md-12">
              <table className='blue-border navbar-custom rounded'>
                <tbody className='blue-border'>
                  <tr >
                    <td colSpan={2} className='blue-border font-bold'>Current Transaction Fees</td>
                  </tr>
                  <tr>
                    <td>High Priority<span className='small-text py-3 my-4'> ~ 10 minutes</span></td>
                    <td>{this.state.fees.fastestFee} sat/vB || <span className='green'>${((this.state.fees.fastestFee) * .0425).toFixed(2)}</span></td>
                  </tr>
                  <tr>
                    <td>Medium Priority<span className='small-text py-3 my-4'> ~ 30 minutes</span></td>
                    <td>{this.state.fees.halfHourFee} sat/vB || <span className='green'>${((this.state.fees.halfHourFee) * .0425).toFixed(2)}</span></td>
                  </tr>
                  <tr>
                    <td>Low Priority<span className='small-text py-3 my-4'> ~ 60 minutes</span></td>
                    <td>{this.state.fees.hourFee} sat/vB || <span className='green'>${((this.state.fees.hourFee) * .0425).toFixed(2)}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row justify-content-center mx-4 my-4">
            <div className="col-md-12">
              <table className='blue-border navbar-custom rounded' responsive='sm'>
                <tbody>
                  <tr>
                    <td colSpan={4} className='orange-border font-bold'>Latest Transactions</td>
                  </tr>
                  <tr className='font-bold'>
                    <td>Transaction Id</td>
                    <td>Value</td>
                    <td>Amount</td>
                    <td>Fees</td>
                  </tr>
                  {this.state.transactions.map((transaction, i) => {
                    return (
                      <>
                        <tr key={i}>
                          <td>{this.state.transactions[i].txid}</td>
                          <td>${(((this.state.transactions[i].value) / 100000000) * (this.state.price))?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>{(this.state.transactions[i].value) / 100000000} BTC</td>
                          <td>{(this.state.transactions[i].fee) / 100} sat/vB</td>
                        </tr>
                      </>
                    );
                  }
                  )}
                </tbody>
              </table>
            </div>
            <div className="row">
              <button onClick={this.handleClickUp} className='scrolldown'>
                <i class="fa-solid fa-3x fa-caret-up"></i>
              </button>
            </div>
          </div>
      </div>

      </>
    );
  }

}
