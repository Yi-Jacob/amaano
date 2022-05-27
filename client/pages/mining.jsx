import React from 'react';
import Nav from '../components/navbar';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Navbar2 from '../components/miniNav';

export default class Mining extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      intervalId: null,
      difficulty: {
        difficultyChange: 0,
        remainingBlocks: null,
        progressPercent: null
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
      ]
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
      fetch('https://mempool.space/api/v1/difficulty-adjustment'),
      fetch('https://mempool.space/api/v1/blocks-extras/')
    ])
      .then(async ([a, b]) => {
        const difficulty = await a.json();
        const blocks = await b.json();

        return [difficulty, blocks]
      })
      .then(data => {
        this.setState({
          difficulty: data[0],
          blocks: data[1]
        })
      })
  }

  componentDidMount() {
    this.fetchData()
    this.intervalId = setInterval(() => {
      this.fetchData();
    }, 10000)
  }

  render() {
    return (
      <>
        {/* <Nav history={this.props.history} /> */}
        <div className="container">
          <Navbar2 history={this.props.history} />
          <div className="row mx-4 my-3 work-sans ">
            <h2 className='amaano-blue ml-2'>Mining</h2>
            <div className="col-md-12">
              <Card className='mb-2 my-1 px-4 py-4 blue-border'>
                <Card.Title className='card-text amaano-secondary'>
                  Mining is a core component of Bitcoin, it secures the Bitcoin blockchain and can be looked at as the process that actually builds the blockchain by discovering new blocks and joining them to the previous ones.
                  Miners spend resources to create new blocks for transactions to be placed into, and are rewarded for their efforts in newly minted bitcoin.
                  The difficulty is adjusted every 2016 blocks (every 2 weeks approximately) so that the average time between each block remains 10 minutes.
                </Card.Title>
              </Card>
            </div>
          </div>
          <div className="row mx-4 my-4 work-sans">
            <div className="col-md-12">
              <table className='blue-border navbar-custom rounded'>
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
              </table>
            </div>
          </div>
          <div className="row mx-4 my-4 justify-content-center work-sans">
            <div className="col-md-12">
              <table className='blue-border navbar-custom rounded'>
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
                  {this.state.blocks.map((block, i) => {
                    return (
                      <>
                        <tr key={i}>
                          <td>{this.state.blocks[i].height}</td>
                          <td>{this.state.blocks[i].tx_count}</td>
                          <td>{this.state.blocks[i].extras.pool.name}</td>
                          <td>{(moment.unix(this.state.blocks[i].timestamp).format('MMMM Do YYYY, h:mm:ss a').toString())}</td>
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
