import React from 'react';
import Nav from '../components/navbar';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

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
      ]
    });
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
    // Promise.all([
    //   fetch('https://mempool.space/api/v1/fees/recommended'),
    //   fetch('https://mempool.space/api/mempool/recent')
    // ]).then(async ([data1, data2]) => {
    //   const a = await data1.json();
    //   const b = await data2.json();
    //   return [a, b]
    // })
    //   .then((res) => {
    //     this.setState({ fees: data });
    //     console.log(res)
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    Promise.all([
      fetch('https://mempool.space/api/v1/fees/recommended')
        .then(res => res.json())
        .then(data => {
          this.setState({ fees: data });
        }),
      fetch('https://mempool.space/api/mempool/recent')
        .then(res => res.json())
        .then(data => {
        this.setState({ transactions: data });
      })
    ])
  }

  render() {
    return (
      <div className="black-background">
        <Nav history={this.props.history} onSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.input} />
        <div className="row mx-4 my-4">
          <h1 className='orange ml-2 font-titillium-web'>Transactions</h1>
          <div className="col-md-12">
            <Card className='mb-2 my-1 px-4 py-4 orange-border font-titillium-web grey-background'>
              <Card.Title className='card-text orange'>
                Transaction fees are the difference between the amount of bitcoin sent and the amount received.
                Conceptually, transaction fees are a reflection of the speed with which a user wants their transaction validated on the blockchain.
                The faster a user wants a transaction settled, the higher the fee will be.
              </Card.Title>
            </Card>
          </div>
        </div>
        <div className="row mx-4 my-3">
          <div className="col-md-12">
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
        </div>
        <div className="row mx-4 my-3">
          <div className="col-md-12">
            <Card className='mb-2 my-1 px-4 py-4 orange-border font-titillium-web grey-background'>
              <Card.Title className='card-text orange'>
                Here are the last 10 transactions to occur.
              </Card.Title>
            </Card>
          </div>
        </div>
        <div className="row justify-content-center mx-4 my-4">
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
                {this.state.transactions.map((transaction, i) => {
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
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

}
