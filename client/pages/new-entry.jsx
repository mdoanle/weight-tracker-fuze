import React from 'react';
import EntryForm from '../components/entry-form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function NewEntry(props) {
  return (
    <Row className='justify-content-center'>
      <Col xl={8}>
        <EntryForm />
      </Col>
    </Row>
  );
}
