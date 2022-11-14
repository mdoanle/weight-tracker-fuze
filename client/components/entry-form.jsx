import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

export default class EntryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: '',
      date: '',
      file: null
    };
    this.fileInputRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.state.file);
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name === 'file' && event.target.files.length !== 0) {
      this.setState({
        [name]: URL.createObjectURL(event.target.files[0])
      });
    } else {
      this.setState({ [name]: value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('weight', this.state.weight);
    formData.append('date', this.state.date);
    formData.append('image', this.fileInputRef.current.files[0]);
    const req = {
      method: 'POST',
      body: formData
    };
    fetch('/api/entries', req)
      .then(res => res.json())
      .then(result => {
        window.location.hash = 'home';
        this.setState({
          date: '',
          weight: ''
        });
        this.fileInputRef.current.value = null;
      });
  }

  render() {
    const { handleChange, handleSubmit } = this;
    return (
      <Container className='mt-3'>
        <Row className='mb-3'>
          <h1>New Entry</h1>
        </Row>
        <Row style={{ height: '50vh' }} className='m-3 justify-content-center'>
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
                <Row className='mt-5'>
                  <Form.Group controlId='formFile'>
                    <Row className='justify-content-center'>
                      <Image
                      style={{ height: 400, width: 400 }}
                      className='h-auto'
                        src={this.state.file === null || this.state.file === '' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png' : this.state.file}
                      thumbnail='true'
                      />
                    </Row>
                    <Form.Label className='mt-5 d-block'>Upload Photo:</Form.Label>
                    <Form.Control
                  type='file'
                  name='file'
                  ref={this.fileInputRef}
                  accept=".png, .jpg, .jpeg"
                  onChange = {this.handleChange}
                  />
                  </Form.Group>
                </Row>
                <Row style={{ height: '15vh' }}>
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
