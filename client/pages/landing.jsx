import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import AppContext from '../lib/app-context';

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignIn: false,
      showSignUp: false,
      username: '',
      password: ''
    };
    this.closeSignIn = this.closeSignIn.bind(this);
    this.openSignIn = this.openSignIn.bind(this);
    this.closeSignUp = this.closeSignUp.bind(this);
    this.openSignUp = this.openSignUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSignUp(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    };
    fetch('/api/users/sign-up', req)
      .then(res => res.json())
      .then(() => {
        window.location.hash = '';
        this.setState({
          showSignUp: false,
          showSignIn: true
        });
      });
  }

  handleLogIn(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    };
    fetch('/api/users/sign-in', req)
      .then(res => res.json())
      .then(result => {
        if (result.user && result.token) {
          this.context.handleSignIn(result);
        }
      });
  }

  closeSignIn() {
    this.setState({
      showSignIn: false
    });
  }

  openSignIn() {
    this.setState({
      showSignIn: true
    });
  }

  closeSignUp() {
    this.setState({
      showSignUp: false
    });
  }

  openSignUp() {
    this.setState({
      showSignUp: true
    });
  }

  render() {
    const { user } = this.context;

    if (user) {
      window.location.hash = 'home';
    }

    return (
      <div className='bg-image'>
        <Container fluid style={{ height: '100vh', width: '100vw' }}>

          <Modal show={this.state.showSignIn} onHide={this.closeSignIn} centered>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.handleLogIn}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Enter username" name='username' onChange={this.handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" name='password' onChange={this.handleChange} />
                </Form.Group>
                <Button variant="primary" type="submit" className='float-right'>
                  Login
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={this.state.showSignUp} onHide={this.closeSignUp} centered>
            <Modal.Header closeButton>
              <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.handleSignUp}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Enter desired username" name='username' onChange={this.handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" name='password' onChange={this.handleChange} />
                </Form.Group>
                <Button variant="primary" type="submit" className='float-right'>
                  Sign up
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Row className='h-100 justify-content-center'>
            <Row className='justify-content-center align-items-center'>
              <Card style={{ width: '25rem', height: '15rem' }} className='text-center' border='secondary'>
                <Row className='h-100 mb-3 mt-3'>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '2rem' }}>Hello! Welcome to WeightTrackerFuze</Card.Title>
                    <Row className='justify-content-center mt-4'>
                      <Button variant="primary" className='w-50' onClick={this.openSignIn}>Log In</Button>
                    </Row>
                    <Row className='mt-3'>
                      <Card.Link href='#' onClick={this.openSignUp}>No account? Sign up here!</Card.Link>
                    </Row>
                  </Card.Body>
                </Row>
              </Card>
            </Row>
          </Row>

        </Container>
      </div>
    );
  }
}

Landing.contextType = AppContext;
