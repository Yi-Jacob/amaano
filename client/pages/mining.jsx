import React from 'react';
import Nav from '../components/navbar';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import Card from 'react-bootstrap/Card';

export default class Mining extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      difficulty: {
        difficultyChange: 0,
        remainingBlocks: null,
        progressPercent: null
      },
      blocks: [
        {
          height: null,
          tx_count: 0,
          timestamp: null
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
    Promise.all([
      fetch('https://mempool.space/api/v1/difficulty-adjustment')
        .then(res => res.json())
        .then(data => {
          this.setState({ difficulty: data });
        }),
    fetch('https://mempool.space/api/blocks/')
      .then(res => res.json())
      .then(data => {
        this.setState({ blocks: data });
      })
    ])

  }

  render() {
    return (
      <div className="black-background">
        <Nav history={this.props.history} />
        <div className="row mx-4 my-3">
          <h1 className='orange ml-2 font-titillium-web'>Mining</h1>
          <div className="col-md-12">
            <Card className='mb-2 my-1 px-4 py-4 orange-border font-titillium-web grey-background'>
              <Card.Title className='card-text orange'>
                Mining is a core component of Bitcoin, it secures the Bitcoin blockchain and can be looked at as the process that actually builds the blockchain by discovering new blocks and joining them to the previous ones.
                Miners spend resources to create new blocks for transactions to be placed into, and are rewarded for their efforts in newly minted bitcoin.
                The difficulty is adjusted every 2016 blocks (every 2 weeks approximately) so that the average time between each block remains 10 minutes.
              </Card.Title>
            </Card>
          </div>
        </div>
        <div className="row mx-4 my-4">
          <div className="col-md-12">
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
        <div className="row mx-4 my-3">
          <div className="col-md-12">
            <Card className='mb-2 my-1 px-4 py-4 orange-border font-titillium-web grey-background'>
              <Card.Title className='card-text orange'>
                Here are the last 10 blocks to have been mined.
              </Card.Title>
            </Card>
          </div>
        </div>
        <div className="row mx-4 my-4 justify-content-center">
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
                {this.state.blocks.map((block, i) => {
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
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
