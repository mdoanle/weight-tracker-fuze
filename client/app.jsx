import React from 'react';
import Home from './pages/home';
import NewEntry from './pages/new-entry';
import parseRoute from './lib/parse-route';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './pages/landing';

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
    if (route.path === '') {
      return <Landing />;
    }
  }

  render() {
    return (
      <>
        {this.renderPage()}
      </>
    );
  }
}
