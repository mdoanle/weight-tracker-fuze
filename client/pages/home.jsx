import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    fetch('/api/entriesTest')
      .then(res => res.json())
      .then(entries => this.setState({ entries }));
  }

  render() {
    return (
      <Container>
        <Row>
          <h1 className='text-center mt-3'>Welcome!</h1>
        </Row>
        <Row>
          <Col>
            <h2>Entries:</h2>
          </Col>
          <Col>
            <Button variant='primary' className='float-end' href='#entry'>New Entry</Button>
          </Col>
        </Row>
        <Row className='m-3'>
          <Card>
            <Card.Body>
              {
                  this.state.entries.map(entry => (
                    <div key={entry.date}>
                      <Entry entry={entry} />
                    </div>
                  ))
                }
            </Card.Body>
          </Card>
        </Row>
      </Container>
    );
  }
}

function Entry(props) {
  const { weight, date } = props.entry;
  const modDate = date.split('T');
  const finalDate = modDate[0];
  return (
    <Row className='my-2'>
      <Col>
        <div className='my-1 font-weight-bold'>Date:</div>
        {finalDate}
      </Col>
      <Col>
        <div className='my-1 font-weight-bold'>Weight:</div>
        {weight}
      </Col>
    </Row>
  );
}
