import React from 'react';
import Home from './pages/home';
import NewEntry from './pages/new-entry';
import parseRoute from './lib/parse-route';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './pages/landing';
import AppContext from './lib/app-context';
import jwtDecode from 'jwt-decode';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: null,
      isAuthorizing: true
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      const route = parseRoute(window.location.hash);
      this.setState({
        route
      });
    });
    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({
      user,
      isAuthorizing: false
    });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({
      user: null
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
    if (this.state.isAuthorizing) return null;
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </AppContext.Provider>
    );
  }
}

App.contextType = AppContext;
Landing.contextType = AppContext;
Home.contextType = AppContext;
