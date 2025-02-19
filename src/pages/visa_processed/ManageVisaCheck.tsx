import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { FormInput } from '../../components'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ManageVisaCheck = (props: any) => {
    const { id: countryId, app_id } = useParams();
    const [checkListData, setCheckListData] = useState<any>(null);
    const [applicationId, setApplicationId] = useState<any>(null)

    const fetchList = async () => {
        const { data } = await axios.get(`/get_visa_checks_by_country/`, { params: { id: countryId, application_id: app_id } });
        if (data?.status) {
            setCheckListData(data?.data);
            setApplicationId(data?.data?.[0]?.fields?.[0]?.values?.[0]?.application_id);
        }
    }

    useEffect(() => {
        fetchList()
    }, [countryId])

    const saveVisaChecklist = async (stepIndex: number) => {
        try {
            let updateData =  checkListData[stepIndex];
            let payload = {
                id: countryId,
                visaCheckList: updateData,
                app_id: applicationId
            }
            const { data } = await axios.post(`/save_visa_checks_by_country`, payload);
            if(data?.status) {
                fetchList();
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleFormInputChange = (stepIndex: number, fieldIndex: number, value: any) => {
        console.log('value', value);

        setCheckListData((prev: any) => {
            let updatedList = [...prev];

            if (!updatedList[stepIndex]) return prev;

            if (!updatedList[stepIndex].fields) return prev;

            updatedList[stepIndex] = {
                ...updatedList[stepIndex],
                fields: [...updatedList[stepIndex].fields]
            };

            // updatedList[stepIndex].fields[fieldIndex] = {
            //     ...updatedList[stepIndex].fields[fieldIndex].values,
            //     field_value: value
            // };
            
            if (updatedList[stepIndex]?.fields[fieldIndex]?.values?.length) {
                updatedList[stepIndex].fields[fieldIndex].values[0].field_value = value;
            } else {
                console.error("values array is empty or undefined");
            }            

            return updatedList;
        });
    };

    console.log('checkListData', checkListData);

    return (
        <>
            <Card>
                <Card.Header>
                    <h4 className="modal-title">Visa Checklist</h4>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            {checkListData?.map((item: any, index: any) => (
                                <div key={index}>
                                    <h5>Step: {index + 1} - {item?.step_name}</h5>
                                    <Row className='mt-2'>
                                        {item.fields.map((field: any, fieldIndex: any) => (
                                            <Col md={6} className='mt-2'>
                                                {(() => {
                                                    switch (field?.field_type) {
                                                        case 'text':
                                                            return <FormInput key={fieldIndex} label={field?.field_name} type="text" name={field?.field_name} value={field?.values?.[0]?.field_value} onChange={(e: any) => handleFormInputChange(index, fieldIndex, e.target.value)} />
                                                        case 'number':
                                                            return <FormInput key={fieldIndex} label={field?.field_name} type="number" name={field?.field_name} value={field?.values?.[0]?.field_value} onChange={(e: any) => handleFormInputChange(index, fieldIndex, e.target.value)} />
                                                        case 'date':
                                                            return <FormInput key={fieldIndex} label={field?.field_name} type="date" name={field?.field_name} value={field?.values?.[0]?.field_value} onChange={(e: any) => handleFormInputChange(index, fieldIndex, e.target.value)} />
                                                        case 'checkbox':
                                                            let checkNameOne = field?.field_name?.split("/")[0]?.trim();
                                                            let checkNameTwo = field?.field_name?.split("/")[1]?.trim();
                                                            return (
                                                                <span className="d-flex mt-4 mb-2">
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        label={checkNameOne}
                                                                        name={checkNameOne}
                                                                        checked={field?.values?.[0]?.field_value == checkNameOne?.toLowerCase()}
                                                                        className="me-3"
                                                                        onChange={(e: any) => handleFormInputChange(index, fieldIndex, e.target.checked ? checkNameOne?.toLowerCase() : "")}
                                                                    />
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        label={checkNameTwo}
                                                                        name={checkNameTwo}
                                                                        checked={field?.values?.[0]?.field_value == checkNameTwo?.toLowerCase()}
                                                                        onChange={(e: any) => handleFormInputChange(index, fieldIndex, e.target.checked ? checkNameTwo?.toLowerCase() : "")}
                                                                    />
                                                                </span>

                                                            )
                                                        case 'textarea':
                                                            return <FormInput key={fieldIndex} label={field?.field_name} type="textarea" name={field?.field_name} value={field?.values?.[0]?.field_value} onChange={(e: any) => handleFormInputChange(index, fieldIndex, e.target.value)} />
                                                        default:
                                                            return <FormInput key={fieldIndex} label={field?.field_name} type="text" name={field?.field_name} value={field?.values?.[0]?.field_value} onChange={(e: any) => handleFormInputChange(index, fieldIndex, e.target.value)} />
                                                    }
                                                })()}
                                            </Col>
                                        ))}
                                        <Row className='d-flex justify-content-end mt-2'>
                                            <Col>
                                                <Button onClick={() => saveVisaChecklist(index)}>
                                                    Save Visa Checks
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                </div>
                            ))}
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default ManageVisaCheck