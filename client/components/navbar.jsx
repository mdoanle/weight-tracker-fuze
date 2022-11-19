import React from 'react';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import AppContext from '../lib/app-context';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

export default class NavBar extends React.Component {
  render() {
    return (
      <Navbar bg="primary" variant="dark">
        <Row className='w-100 h-100 justify-content-between'>
          <Col>
            <Navbar.Brand href="#home" className='ms-3'>WeightTrackerFuze</Navbar.Brand>
          </Col>
          <Col>
            <Button variant='danger' href='' className='float-right' onClick={this.context.handleSignOut}>Sign Out</Button>
          </Col>
        </Row>
      </Navbar>
    );
  }
}

NavBar.contextType = AppContext;
