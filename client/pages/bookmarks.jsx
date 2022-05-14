import React from 'react';
import Nav from '../components/navbar';
import Card from 'react-bootstrap/Card';
import moment from 'moment-timezone';

export default class Bookmarks extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      bookmarkData: [{
        bookmarkId: 0,
        bookmarkedAt: '',
        walletAddress: '',
        data: {
          chain_stats: {
            tx_count: 0,
            funded_txo_sum: 0,
            spent_txo_sum: 0
          }
        }
      }
      ]
    }
    );
    this.removeBookmark = this.removeBookmark.bind(this);
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      this.setState({ star: false, address: queryString.parse(location.search).address });
      this.fetchData(queryString.parse(location.search).address);
    });
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => {
        this.setState({ bookmarkData: data });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push('/search-results?address=' + this.state.input);
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  removeBookmark(bookmarkId) {
    fetch(`/api/bookmarks/${bookmarkId}`, {
      method: 'delete'
    });
    this.setState(prevState => ({
      bookmarkData: prevState.bookmarkData.filter(bookmark => bookmark.bookmarkId !== bookmarkId)
    }));
  }

  render() {
    return (
      <>
        <Nav history={this.props.history} onSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.input} />

          <div className="container-fluid" style={{ maxWidth: '1200px' }}>
            <div className="row pt-3 margin-right-10 margin-left-1">
              <div className='col-sm-9 col-md-11'>
                <p className='address-header font-titillium-web amaano-blue'>
                  <i className="fa-brands fa-btc" />ookmarks
                </p>
              </div>
            </div>
            <div className="row mb-2 margin-right-10 margin-left-1">
              {this.state.bookmarkData.length !== 0
                ? (
                    this.state.bookmarkData.map((bookmarkData, i) => {
                      return (
                      <Card key={i} className='blue-border padding-zero font-size-20 mb-3'>
                        <Card.Header className='font-titillium-web font-bold address-header amaano-blue'>
                          Bookmarked Address: {bookmarkData.walletAddress}
                          <button className='remove-btn pt-1' onClick={this.removeBookmark.bind(this, bookmarkData.bookmarkId)}><i className="fa-solid fa-circle-minus amaano-blue"></i></button>
                        </Card.Header>
                        <ul>
                          <li>
                              <Card.Title className='bookmark-header amaano-secondary'>Total Number of Transactions: {bookmarkData.data.chain_stats.tx_count}</Card.Title>
                          </li>
                          <li>
                              <Card.Title className='bookmark-header amaano-secondary'>Total Balance: {(bookmarkData.data.chain_stats.funded_txo_sum - bookmarkData.data.chain_stats.spent_txo_sum) / 100000000} BTC</Card.Title>
                          </li>
                        </ul>
                          <Card.Footer className='amaano-secondary'>
                          Bookmarked At: {(moment(bookmarkData.bookmarkedAt).tz('Atlantic/Azores').format('MMMM Do YYYY, h:mm:ss a'))}
                        </Card.Footer>
                      </Card>
                      );
                    })
                  )
                : (
                  <Card className='blue-border padding-zero font-size-20 mb-3'>
                    <Card.Header className='font-titillium-web font-bold address-header amaano-secondary'>
                      No Bookmarks
                    </Card.Header>
                  </Card >
                  )}
            </div>
          </div>


      </>
    );

  }
}
