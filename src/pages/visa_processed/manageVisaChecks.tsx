import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { FormInput } from '../../components'

const ManageVisaChecks = (props: any) => {
  const { isOpen, toggleModal, checkLists } = props;

  const onSubmit = () => {

  }
  
  return (
    <>
      <Form onSubmit={onSubmit}>
          <h4 className="modal-title">Visa Checklist</h4>
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
      </Form>
  </>
  )
}

export default ManageVisaChecks