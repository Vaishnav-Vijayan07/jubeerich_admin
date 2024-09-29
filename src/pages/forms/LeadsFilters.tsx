import React, { useEffect, useState } from 'react'
import Select, { ActionMeta, OptionsType } from "react-select";
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { AUTH_SESSION_KEY, cre_id, cre_reception_id, customStyles } from '../../constants';

const LeadsFilters = (props: any) => {
    const {
        state,
        country,
        source,
        status,
        counsellors,
        userData,
        cres,
        changeFilteredItemsData
    } = props;

    const [filters, setFilters] = useState({
        status_id: "",
        counsiler_id: "",
        lead_received_date: "",
        followup_date: "",
        preferredCountries: "",
        updated_by: "",
        source_id: "",
    });
    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    const [selectedSourceFilter, setSelectedSourceFilter] = useState<any>(null);
    const [selectedAssignedBy, setSelectedAssignedBy] = useState<any>(null);
    const [selectedCounsellor, setSelectedCounsellor] = useState<any>(null);
    const [selectedCountryFilter, setSelectedCountryFilter] = useState<any>(null);
    const [selectedCREFilter, setSelectedCREFilter] = useState<any>(null);

    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    let userRole: any;
    let user: any;
    let userBranchId: any;
    if (userInfo) {
        user = JSON.parse(userInfo);
        userRole = JSON.parse(userInfo)?.role;
        userBranchId = JSON.parse(userInfo)?.branch_id
    }

    useEffect(() => {
        applyFilters();
    }, [filters]);

    const applyFilters = () => {
        let tempItems = [...state];
        if (filters.status_id) {
            tempItems = tempItems.filter((item) => item.status_id == filters.status_id);
        }
        if (filters.source_id) {
            tempItems = tempItems.filter((item) => item.source_id == filters.source_id);
        }
        if (filters.updated_by) {
            tempItems = tempItems.filter((item) => item.updated_by == filters.updated_by);
        }
        if (filters.counsiler_id) {
            tempItems = tempItems.filter((item) => item.counselors.some((counselor: any) => counselor.id == filters.counsiler_id));
        }
        if (filters.preferredCountries) {
            tempItems = tempItems.filter((item) =>
                item.preferredCountries.some((preferredCountry: any) => preferredCountry.id == filters.preferredCountries)
            );
        }
        if (filters.lead_received_date) {
            tempItems = tempItems.filter((item) => {
                const itemDate = new Date(item.lead_received_date).toDateString();
                const filterDate = new Date(filters.lead_received_date).toDateString();
                return itemDate === filterDate;
            });
        }
        if (filters.followup_date) {
            tempItems = tempItems.filter((item) => {
                const itemDate = new Date(item.followup_date).toDateString();
                const filterDate = new Date(filters.followup_date).toDateString();
                return itemDate === filterDate;
            });
        }
        changeFilteredItemsData(tempItems);
    };

    const handleFilterChange = (selected: any, { name }: any) => {
        setFilters((prevFilters: any) => ({
            ...prevFilters,
            [name]: selected?.value,
        }));

        switch (name) {
            case "status_id":
                setSelectedStatus(selected);
                break;
            case "source_id":
                setSelectedSourceFilter(selected);
                break;
            case "updated_by":
                setSelectedAssignedBy(selected);
                break;
            case "counsiler_id":
                setSelectedCounsellor(selected);
                break;
            case "preferredCountries":
                setSelectedCountryFilter(selected);
                break;
            case "CRE":
                setSelectedCREFilter(selected);
                break;
            default:
                break;
        }
    };

    const handleClear = () => {
        setFilters({
            status_id: "",
            counsiler_id: "",
            lead_received_date: "",
            followup_date: "",
            preferredCountries: "",
            updated_by: "",
            source_id: "",
        });
        setSelectedStatus(null);
        setSelectedSourceFilter(null);
        setSelectedAssignedBy(null);
        setSelectedCounsellor(null);
        setSelectedCountryFilter(null);
    };

    const handleFilterDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <>
            <Card>
                <Card.Body>
                    <h4 className="header-title mb-3">Filters</h4>
                    <Row className="mb-3">
                        <Col lg={3} md={4} sm={6} xs={12}>
                            <Form.Group className="mb-3" controlId="status_id">
                                <Form.Label>Status</Form.Label>
                                <Select
                                    styles={customStyles}
                                    className="react-select react-select-container select-wrapper"
                                    classNamePrefix="react-select"
                                    name="status_id"
                                    options={[{ value: null, label: "All" }, ...status]}
                                    value={selectedStatus}
                                    onChange={handleFilterChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={3} md={4} sm={6} xs={12}>
                            <Form.Group className="mb-3" controlId="source_id">
                                <Form.Label>Source</Form.Label>
                                <Select
                                    styles={customStyles}
                                    className="react-select react-select-container select-wrapper"
                                    classNamePrefix="react-select"
                                    name="source_id"
                                    options={[{ value: null, label: "All" }, ...source]}
                                    value={selectedSourceFilter}
                                    onChange={handleFilterChange}
                                />
                            </Form.Group>
                        </Col>

                        {user?.role == cre_id || user?.role == cre_reception_id ? (
                            <Col lg={3} md={4} sm={6} xs={12}>
                                <Form.Group className="mb-3" controlId="updated_by">
                                    <Form.Label>Assigned By</Form.Label>
                                    <Select
                                        styles={customStyles}
                                        className="react-select react-select-container select-wrapper"
                                        classNamePrefix="react-select"
                                        name="updated_by"
                                        options={[{ value: null, label: "All" }, ...userData]}
                                        value={selectedAssignedBy}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                        ) : (
                            ""
                        )}

                        {user?.role == cre_id || user?.role == cre_reception_id ? (
                            <Col lg={3} md={4} sm={6} xs={12}>
                                <Form.Group className="mb-3" controlId="CRE">
                                    <Form.Label>CRE</Form.Label>
                                    <Select
                                        styles={customStyles}
                                        className="react-select react-select-container select-wrapper"
                                        classNamePrefix="react-select"
                                        name="CRE"
                                        options={[{ value: null, label: "All" }, ...cres]}
                                        value={selectedCREFilter}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                        ) : (
                            ""
                        )}

                        {user?.role == cre_id || user?.role == cre_reception_id ? (
                            <Col lg={3} md={4} sm={6} xs={12}>
                                <Form.Group className="mb-3" controlId="counsiler_id">
                                    <Form.Label>Counsellors</Form.Label>
                                    <Select
                                        styles={customStyles}
                                        className="react-select react-select-container select-wrapper"
                                        classNamePrefix="react-select"
                                        name="counsiler_id"
                                        options={[{ value: null, label: "All" }, ...counsellors]}
                                        value={selectedCounsellor}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                        ) : (
                            ""
                        )}

                        <Col lg={3} md={4} sm={6} xs={12}>
                            <Form.Group className="mb-3" controlId="preferredCountries">
                                <Form.Label>Country</Form.Label>
                                <Select
                                    styles={customStyles}
                                    className="react-select react-select-container select-wrapper"
                                    classNamePrefix="react-select"
                                    name="preferredCountries"
                                    options={[{ value: null, label: "All" }, ...country]}
                                    value={selectedCountryFilter}
                                    onChange={handleFilterChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={3} md={4} sm={6} xs={12}>
                            <Form.Group controlId="lead_received_date" className="cust-date mb-3">
                                <Form.Label>Lead Received Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="lead_received_date"
                                    value={filters.lead_received_date}
                                    onChange={(e: any) => handleFilterDateChange(e)}
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={3} md={4} sm={6} xs={12}>
                            <Form.Group controlId="followup_date" className="cust-date mb-3">
                                <Form.Label>Followup Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="followup_date"
                                    value={filters.followup_date}
                                    onChange={(e: any) => handleFilterDateChange(e)}
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={3} md={4} sm={6} xs={12} style={{ alignSelf: "center" }}>
                            <Form.Group className="align-items-center">
                                <Button style={{ margin: "auto" }} variant="primary" onClick={handleClear}>
                                    Clear
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}

export default LeadsFilters