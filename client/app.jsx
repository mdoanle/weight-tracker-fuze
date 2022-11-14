import React from 'react';
import Home from './pages/home';
import NewEntry from './pages/new-entry';
import NavBar from './components/navbar';
import parseRoute from './lib/parse-route';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      const route = parseRoute(window.location.hash);
      this.setState({
        route
      });
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === 'home') {
      return <Home />;
    }
    if (route.path === 'entry') {
      return <NewEntry />;
    }
  }

  render() {
    return (
      <>
        <NavBar fluid/>
        <Row className='justify-content-center'>
          <Col xxl={8} xl={8} l={8} m={8}>
            {this.renderPage()}
          </Col>
        </Row>
      </>
    );
  }
}
