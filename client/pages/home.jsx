import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import LineChart from '../components/userLineChart';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import NavBar from '../components/navbar';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      seeLightbox: false,
      seeDelete: false,
      deleting: null,
      lightboxImage: null
    };
    this.showLightbox = this.showLightbox.bind(this);
    this.hideLightbox = this.hideLightbox.bind(this);
    this.showDelete = this.showDelete.bind(this);
    this.hideDelete = this.hideDelete.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
  }

  showLightbox(event) {
    this.setState({ seeLightbox: true, lightboxImage: event.target.getAttribute('src'), seeDelete: false });
  }

  showDelete(event) {
    this.setState({ seeDelete: true, deleting: event.target.getAttribute('id') });
  }

  hideLightbox() {
    this.setState({ seeLightbox: false });
  }

  hideDelete() {
    this.setState({ seeDelete: false });
  }

  deleteEntry() {
    const { deleting, entries } = this.state;
    const numDeleting = Number(deleting);
    const stateCopy = entries.filter(entry => entry.entryId !== numDeleting);
    const req = {
      method: 'DELETE'
    };
    fetch(`/api/entries/${deleting}`, req)
      .then(res => res.json())
      .then(() => {
        this.setState({ entries: stateCopy, deleting: null });
        this.hideDelete();
      });
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
      <>
        <NavBar/>
        <Row className='justify-content-center'>
          <Col xxl={8} xl={8} lg={8} md={8}>
            <Container>
              <Modal show={this.state.seeLightbox} onHide={this.hideLightbox} centered>
                <Modal.Header closeButton/>
                <Modal.Body>
                  <Row>
                    <Image src={this.state.lightboxImage}/>
                  </Row>
                </Modal.Body>
              </Modal>

              <Modal show={this.state.seeDelete} onHide={this.hideDelete} backdrop='static' centered>
                <Modal.Body>
                  <Row className='justify-content-center'>
                    <h3 className='d-flex justify-content-center'>You Sure Fam?</h3>
                    <Row style={{ width: '50%' }}>
                      <Button variant="danger" className='mb-2' onClick={this.deleteEntry}>Delete</Button>
                      <Button variant="primary" onClick={this.hideDelete}>Close</Button>
                    </Row>
                  </Row>
                </Modal.Body>
              </Modal>

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
                        <Entry
                        entry={entry}
                        showLightbox={this.showLightbox}
                        showDelete={this.showDelete}
                        />
                      </div>
                    ))
                  }
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          </Col>
        </Row>
      </>
    );
  }
}

function Entry(props) {
  const { weight, date, photoUrl, entryId } = props.entry;
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
          <Image
          fluid
          onClick={props.showLightbox}
          style={{ objectFit: 'contain', height: '100px', width: '100px' }}
          src={photoUrl === null ? 'images/placeholder.png' : photoUrl}
          role='button'/>
        </Row>
      </Col>
      <Col className='d-flex justify-content-center' style={{ width: '50%' }}>
        <Row className='align-items-center' style={{ height: '100%' }}>
          <i onClick={props.showDelete} className="fa-solid fa-xmark" id={entryId} />
        </Row>
      </Col>
    </Row>
  );
}
