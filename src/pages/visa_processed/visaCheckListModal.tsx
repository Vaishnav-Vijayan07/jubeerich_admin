import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { Col, Form, Modal, Row } from 'react-bootstrap';
import { FormInput } from '../../components';

const VisaCheckListModal = (props: any) => {
  const { isOpen, toggleModal, checkLists } = props;

  console.log('checkLists', checkLists);

  const onSubmit = () => {

  }

  return (
    <>
      <Modal show={isOpen} onHide={toggleModal} size='lg'>
        <Form onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <h4 className="modal-title">Visa Checklist</h4>
          </Modal.Header>
          <Modal.Body>
            <Row>
              {checkLists?.map((item: any, index: any) => (
                <div key={index}>
                  <h5>Step: {index + 1} - {item?.step_name}</h5>
                  <Row className='mt-2'>
                    {item.fields.map((field: any, fieldIndex: any) => (
                      <Col md={6} className='mt-2'>
                        {(() => {
                          switch (field?.field_type) {
                            case 'text':
                              return <FormInput key={fieldIndex} label={field?.field_name} type="text" name={field?.field_name} />
                            case 'number':
                              return <FormInput key={fieldIndex} label={field?.field_name} type="number" name={field?.field_name} />
                            case 'date':
                              return <FormInput key={fieldIndex} label={field?.field_name} type="date" name={field?.field_name} />
                            case 'checkbox':
                              let checkNameOne = field?.field_name?.split("/")[0]
                              let checkNameTwo = field?.field_name?.split("/")[1]
                              return (
                                <span className="d-flex mt-4 mb-2">
                                  <Form.Check type="checkbox" label={checkNameOne} name={checkNameOne} className="me-3" />
                                  <Form.Check type="checkbox" label={checkNameTwo} name={checkNameTwo} />
                                </span>
                              )
                            case 'radio':
                              let radioNameOne = field?.field_name?.split("/")[0]
                              let radioNameTwo = field?.field_name?.split("/")[1]
                              return (
                                <span className="d-flex mt-2 mb-2">
                                  <Form.Check type="radio" label={radioNameOne} name={radioNameOne} className="me-3" />
                                  <Form.Check type="radio" label={radioNameTwo} name={radioNameTwo} />
                                </span>
                              )
                            case 'textarea':
                              return <FormInput key={fieldIndex} label={field?.field_name} type="textarea" name={field?.field_name} />
                            default:
                              return <FormInput key={fieldIndex} label={field?.field_name} type="text" name={field?.field_name} />
                          }
                        })()}
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" id="button-addon2" className="mt-1 ms-2">
              Clear
            </Button>
            <Button
              variant="danger"
              id="button-addon2"
              className="mt-1"
              onClick={toggleModal}
            >
              Close
            </Button>
            <Button type="submit" variant="success" id="button-addon2" className="mt-1"
              onClick={toggleModal}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default VisaCheckListModal