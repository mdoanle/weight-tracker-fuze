import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default class NavBar extends React.Component {
  render() {
    return (
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#home" className='ms-3'>Navbar</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
}
