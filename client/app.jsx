import React from 'react';
import NavBar from './components/navbar';
import EntryForm from './components/entry-form';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends React.Component {
  render() {
    return (
      <>
        <NavBar/>
        <EntryForm/>
      </>
    );
  }
}
