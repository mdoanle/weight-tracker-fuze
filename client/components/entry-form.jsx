import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class EntryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: '',
      date: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch('/api/entriesTest', req)
      .then(res => res.json())
      .then(result => {
        window.location.hash = 'home';
      });
  }

  render() {
    const { handleChange, handleSubmit } = this;
    return (
      <Container className='mt-3'>
        <Row className='mb-3'>
          <h1>New Entry</h1>
        </Row>
        <Row style={{ height: '50vh' }} className='m-3'>
          <Card className='h-auto'>
            <Card.Body>
              <Form onSubmit = {handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight:</Form.Label>
                  <Form.Control
                  type="number"
                  required
                  placeholder="Enter Weight"
                  name='weight'
                  step='0.1'
                  onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date:</Form.Label>
                  <Form.Control
                  type="date"
                  required
                  placeholder="Select a Date"
                  name='date'
                  onChange={handleChange}/>
                </Form.Group>
                <Row style={{ height: '25vh' }}>
                  <Button variant="primary" type="submit" className="align-self-end">
                    Submit
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    );
  }
}
