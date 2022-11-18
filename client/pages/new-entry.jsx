import React from 'react';
import EntryForm from '../components/entry-form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import NavBar from '../components/navbar';

export default function NewEntry(props) {
  return (
    <>
      <NavBar/>
      <Row className='justify-content-center'>
        <Col xxl={8} xl={8} lg={8} md={8}>
          <EntryForm />
        </Col>
      </Row>
    </>
  );
}
