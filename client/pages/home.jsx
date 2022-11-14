import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import LineChart from '../components/userLineChart';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };

  }

  componentDidMount() {
    fetch('/api/entries')
      .then(res => res.json())
      .then(entries => {
        this.setState({ entries });
      });
  }

  render() {
    return (
      <Container>
        <Row>
          <h1 className='text-center mt-3'>Welcome!</h1>
        </Row>
        <Row className='mb-5 justify-content-center'>
          <LineChart/>
        </Row>
        <Row className='justify-content-center'>
          <Col>
            <h2>Entries:</h2>
          </Col>
          <Col>
            <Button variant='primary' className='float-end' href='#entry'>New Entry</Button>
          </Col>
        </Row>
        <Row className='m-3 justify-content-center'>
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
  const { weight, date, photoUrl } = props.entry;
  const modDate = date.split('T');
  const finalDate = modDate[0];
  return (
    <Row className='my-2 justify-content-center'>
      <Col>
        <div className='my-1 font-weight-bold'>Date:</div>
        <div style={{ fontSize: '2vh' }}>
          {finalDate}
        </div>
      </Col>
      <Col>
        <div className='my-1 font-weight-bold'>Weight:</div>
        <div style={{ fontSize: '2vh' }}>
          {weight}
        </div>
      </Col>
      <Col>
        <div className='my-1 font-weight-bold'>Photo:</div>
        <Row>
          <Image fluid style={{ objectFit: 'contain', height: '100px', width: '100px' }} src={photoUrl === null ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png' : photoUrl}/>
        </Row>
      </Col>
    </Row>
  );
}
