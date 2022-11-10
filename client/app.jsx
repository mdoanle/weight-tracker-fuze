import React from 'react';
import Home from './pages/home';
import NewEntry from './pages/new-entry';
import NavBar from './components/navbar';
import parseRoute from './lib/parse-route';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <NavBar/>
        {this.renderPage()}
      </>
    );
  }
}
