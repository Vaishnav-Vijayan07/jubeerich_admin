import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { withSwal } from "react-sweetalert2";
import { AppDispatch } from "../../redux/store";
import {
    AUTH_SESSION_KEY,
    counsellor_id,
    country_manager_id,
    customStyles,
    showErrorAlert,
    showSuccessAlert,
} from "../../constants";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { regrexValidation } from "../../utils/regrexValidation";
import { APICore } from "../../helpers/api/apiCore";
import { initialState, initialValidationState, OptionType } from "./data";
import axios from "axios";
import { FormInput } from "../../components";

const ExistLeadModal = withSwal((props: any) => {
    const {
        swal,
        country,
        source,
        user,
        loading,
        toggle,
        modal,
        handleUpdateData,
        clearLeadModal,
        clearError,
        counsellors,
        refetchLeads
    } = props;

    const api = new APICore();
    const [selectedCountry, setSelectedCountry] = useState<OptionType[]>();
    const [selectedSource, setSelectedSource] = useState<any>(null);
    const [selectedCounsellor, setSelectedCounsellor] = useState<any>(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [validationErrors, setValidationErrors] = useState(initialValidationState);
    const [scroll, setScroll] = useState<boolean>(false);
    const [formData, setFormData] = useState(initialState);
    const [counsellorsData, setCounsellorsData] = useState<any>([]);
    const [existingLeadId, setExistingLeadId] = useState<any>(null);
    const [isProficiencyTestReq, setIsProficiencyTestReq] = useState<boolean>(false);
    const [isLanguageProficiencyReq, setIsLanguageProficiencyReq] = useState<boolean>(false);
    const [hasAssociationOtherAcademy, setHasAssociationOtherAcademy] = useState<boolean>(false);

    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

    let loggedUserCountries: any;
    let role_id: any;
    if (userInfo) {
        let { countries, role } = JSON.parse(userInfo);
        loggedUserCountries = countries;
        role_id = role;
    }

    const validationSchema = yup.object().shape({
        full_name: yup.string().min(3, 'Min 3 characters').max(100, 'Max 100 characters').required("Name is required"),
        preferred_country: yup.string().required("Country is required").nullable(),
        email: yup.string().email("Invalid email"),
        phone: yup
            .string()
            .matches(/^[0-9]{10}$/, "Phone number must be a 10-digit number")
            .required("Phone is required"),
        source_id: yup.string().required("Source is required").nullable(),
        lead_received_date: yup.date().nullable(),
        counsellor_id: yup.string().required("Counsellor is required"),
        folllwup_date: yup.date().nullable(),
    });

    useEffect(() => {
        if (Object.entries(handleUpdateData).length) {
            handleUpdate(handleUpdateData);
        }
    }, [handleUpdateData]);

    useEffect(() => {
        handleCancelUpdate();
    }, [clearLeadModal]);

    useEffect(() => {
        setValidationErrors(initialValidationState);
    }, [clearError]);

    const formattedCountries = useMemo(() => {
        if ([counsellor_id, country_manager_id].includes(role_id?.toString())) {
            return country?.filter((data: any) =>
                loggedUserCountries.includes(data?.value?.toString())
            ) || [];
        }
        return country || [];
    }, [country]);

    const handleUpdate = (item: any) => {
        console.log('item', item.preferredCountries?.[0]?.followup_date);

        const updatedSource = source?.filter((source: any) => source.value == item?.source_id);
        const updatedCounsellor = counsellors?.find((counselor: any) => counselor.value == item?.counselors?.[0]?.id);

        const updatedCountry = item?.preferredCountries?.map((country: any) => ({
            value: country?.id,
            label: country?.country_name,
        }));

        setSelectedSource(updatedSource[0]);
        setSelectedCountry(updatedCountry);
        setSelectedCounsellor(updatedCounsellor);

        setFormData((prev) => ({
            ...prev,
            id: item?.id || "",
            full_name: item?.full_name || "",
            email: item?.email || "",
            phone: item?.phone || "",
            source_id: item?.source_id || "",
            city: item?.city || "",
            preferred_country: item?.preferredCountries?.[0]?.id || null,
            updated_by: item?.updated_by || "",
            remarks: item?.remarks || "",
            lead_received_date: moment(item?.lead_received_date).format("YYYY-MM-DD") || new Date()?.toISOString().split("T")[0],
            ielts: item?.ielts || false,
            counsellor_id: updatedCounsellor?.value || "",
            followup_date: moment(item.preferredCountries?.[0]?.followup_date).format("YYYY-MM-DD") || new Date()?.toISOString().split("T")[0] || ""
        }));

        console.log('is_proficiency_test_required',item?.is_proficiency_test_required);
        console.log('is_language_proficiency_required',item?.is_language_proficiency_required);
        console.log('has_association_other_academy',item?.has_association_other_academy);

        setIsProficiencyTestReq(item?.is_proficiency_test_required);
        setIsLanguageProficiencyReq(item?.is_language_proficiency_required);
        setHasAssociationOtherAcademy(item?.has_association_other_academy);

        setIsUpdate(true);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('formData ==>', formData);

        try {
            await validationSchema.validate(formData, { abortEarly: false });

            const confirmation = await swal.fire({
                title: "Confirm Action",
                text: `Do you want to ${isUpdate ? "update" : "create"} this lead?`,
                icon: "question",
                iconColor: "#8B8BF5",
                showCancelButton: true,
                confirmButtonText: `Yes, ${isUpdate ? "Update" : "Create"}`,
                cancelButtonText: "Cancel",
                confirmButtonColor: "#8B8BF5",
                cancelButtonColor: "#E97777",
                buttonsStyling: true,
                customClass: {
                    popup: "rounded-4 shadow-lg",
                    confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
                    cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
                    title: "fs-2 fw-normal mb-2",
                },
                width: "26em",
                padding: "2em",
            });

            if (!confirmation.isConfirmed || !user) return;

            const payload = {
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                source_id: formData.source_id,
                city: formData.city,
                preferred_country: formData.preferred_country,
                counsiler_id: formData.counsellor_id,
                updated_by: user.user_id,
                remarks: formData.remarks,
                lead_received_date: formData.lead_received_date,
                ielts: formData.ielts,
                followup_date: formData.followup_date,
                is_proficiency_test_required: isProficiencyTestReq,
                is_language_proficiency_required: isLanguageProficiencyReq,
                has_association_other_academy: hasAssociationOtherAcademy
            };

            const endpoint = isUpdate ? `/update_existing_lead/${formData.id}` : `/create_existing_lead`;
            const method = isUpdate ? axios.put : axios.post;
            const { data } = await method(endpoint, payload);

            if (data?.status) {
                showSuccessAlert(`Lead successfully ${isUpdate ? "updated" : "created"}`);
                refetchLeads();
                toggle();
                setFormData(initialState);
                setValidationErrors(initialValidationState);
            } else {
                setExistingLeadId(data?.existingLeadId)
                showErrorAlert(data?.message);
            }
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors = Object.fromEntries(error.inner.map(({ path, message }) => [path, message]));
                setValidationErrors(errors);
            } else {
                console.log('ERRR', error);
                showErrorAlert(error);
            }
        }
    };


    const handleInputChange = (e: any) => {
        const { name, value, checked } = e.target;

        if (!regrexValidation(name, value)) {
            console.error(`Invalid ${name}: ${value}`);
            return;
        }

        if (name == "ielts") {
            setFormData((prevData) => ({
                ...prevData,
                ielts: checked,
            }));
            return;
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDropDowns = (selected: any, { name }: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: selected.value,
        }));

        switch (name) {
            case "source_id":
                setSelectedSource(selected);
                break;
            case "preferred_country":
                setSelectedCountry(selected);
                setSelectedCounsellor(null);
                fetchCounselorsByCountry(selected?.value)
                break;
            case "counsellor_id":
                setSelectedCounsellor(selected);
                break;
            default:
                break;
        }
    };

    const handleCancelUpdate = () => {
        setSelectedCountry([]);
        setSelectedSource(null);
        setSelectedCounsellor(null);
        setValidationErrors(initialValidationState);
        setFormData(initialState);
        if (isUpdate) {
            setIsUpdate(false);
            handleResetValues();
        }
    };

    const handleResetValues = () => {
        setValidationErrors(initialValidationState);
        setFormData(initialState);
        setSelectedCountry([]);
        setSelectedSource(null);
        setSelectedCounsellor(null);
    };

    const fetchCounselorsByCountry = async (id: any) => {
        try {
            const { data } = await axios.get(`/counselors_by_country/${id}`);
            setCounsellorsData(data?.data)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Modal show={modal} onHide={toggle} dialogClassName={"modal-full-width"} scrollable={scroll}>
                <Form onSubmit={onSubmit} key={"lead-form"}>
                    <Modal.Header closeButton>
                        <h4 className="modal-title">Exist Lead Management</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={4} lg={4}>
                                <Form.Group className="mb-3" controlId="channel_name">
                                    <Form.Label>
                                        <span className="text-danger fs-4">* </span>Full Name
                                    </Form.Label>
                                    <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                                    {validationErrors.full_name && <Form.Text className="text-danger">{validationErrors.full_name}</Form.Text>}
                                </Form.Group>
                            </Col>

                            <Col md={4} lg={4}>
                                <Form.Group className="mb-3 mt-1" controlId="channel_name">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" name="email" maxLength={100} value={formData.email} onChange={handleInputChange} />
                                    {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>}
                                </Form.Group>
                            </Col>

                            <Col md={4} lg={4}>
                                <Form.Group className="mb-3" controlId="phone">
                                    <Form.Label>
                                        <span className="text-danger fs-4">* </span>Phone
                                    </Form.Label>
                                    <Form.Control type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                                    {validationErrors.phone && <Form.Text className="text-danger">{validationErrors.phone}</Form.Text>}
                                </Form.Group>
                            </Col>

                            <Col md={4} lg={4}>
                                <Form.Group className="mb-3" controlId="channel_name">
                                    <Form.Label>
                                        <span className="text-danger fs-4">* </span>Source
                                    </Form.Label>
                                    <Select
                                        className="react-select react-select-container"
                                        styles={customStyles}
                                        classNamePrefix="react-select"
                                        name="source_id"
                                        options={source}
                                        value={selectedSource}
                                        onChange={handleDropDowns}
                                    />
                                    {validationErrors.source_id && <Form.Text className="text-danger">{validationErrors.source_id}</Form.Text>}
                                </Form.Group>
                            </Col>

                            <Col md={4} lg={4}>
                                <Form.Group className="mb-3" controlId="channel_name">
                                    <Form.Label><span className="text-danger fs-4">* </span> Country</Form.Label>
                                    <Select
                                        styles={customStyles}
                                        className="react-select react-select-container"
                                        classNamePrefix="react-select"
                                        name="preferred_country"
                                        options={formattedCountries}
                                        value={selectedCountry}
                                        isMulti={false}
                                        onChange={handleDropDowns}
                                    />
                                    {validationErrors.preferred_country && <Form.Text className="text-danger">{validationErrors.preferred_country}</Form.Text>}
                                </Form.Group>
                            </Col>

                            <Col md={4} lg={4}>
                                <Form.Group className="mb-3 mt-1" controlId="followup_date">
                                    <Form.Label>Followup Date</Form.Label>
                                    <Form.Control type="date" name="followup_date" value={formData?.followup_date} onChange={handleInputChange} />
                                    {validationErrors.followup_date && <Form.Text className="text-danger">{validationErrors.followup_date}</Form.Text>}
                                </Form.Group>
                            </Col>

                            <Col md={4} lg={4}>
                                <Form.Group className="mb-3 mt-1" controlId="channel_name">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" name="city" value={formData.city} onChange={handleInputChange} />
                                    {validationErrors.city && <Form.Text className="text-danger">{validationErrors.city}</Form.Text>}
                                </Form.Group>
                            </Col>

                            <Col md={4} lg={4}>
                                <Form.Group className="mb-3 mt-1" controlId="lead_received_date">
                                    <Form.Label>Lead Received Date</Form.Label>
                                    <Form.Control type="date" name="lead_received_date" value={formData?.lead_received_date} onChange={handleInputChange} />
                                    {validationErrors.lead_received_date && <Form.Text className="text-danger">{validationErrors.lead_received_date}</Form.Text>}
                                </Form.Group>
                            </Col>

                            <Col md={4} lg={4}>
                                <Form.Group className="mb-3" controlId="franchise_id">
                                    <Form.Label>
                                        <span className="text-danger fs-4">* </span>Counsellors
                                    </Form.Label>
                                    <Select
                                        styles={customStyles}
                                        className="react-select react-select-container"
                                        classNamePrefix="react-select"
                                        name="counsellor_id"
                                        options={[{ value: null, label: "None" }, ...counsellorsData]}
                                        value={selectedCounsellor}
                                        onChange={handleDropDowns}
                                        isDisabled={!counsellorsData.length}
                                    />
                                    {validationErrors.counsellor_id && <Form.Text className="text-danger">{validationErrors.counsellor_id}</Form.Text>}
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="isProficiencyTestReq">
                                    <Form.Label>Is proficiency test required?</Form.Label>
                                    <div className="d-flex justify-content-start align-items-center mt-1">
                                        <Form.Check
                                            type="radio"
                                            name="isProficiencyTestReq"
                                            checked={isProficiencyTestReq}
                                            onChange={() => setIsProficiencyTestReq(true)}
                                            label={<span className="ps-1 fw-bold">Yes</span>}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="isProficiencyTestReq"
                                            checked={!isProficiencyTestReq}
                                            onChange={() => setIsProficiencyTestReq(false)}
                                            label={<span className="ps-1 fw-bold">No</span>}
                                            className="ms-3"
                                        />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="isLanguageProficiencyReq">
                                    <Form.Label>Is language proficiency required?</Form.Label>
                                    <div className="d-flex justify-content-start align-items-center mt-1">
                                        <Form.Check
                                            type="radio"
                                            name="isLanguageProficiencyReq"
                                            checked={isLanguageProficiencyReq}
                                            onChange={() => setIsLanguageProficiencyReq(true)}
                                            label={<span className="ps-1 fw-bold">Yes</span>}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="isLanguageProficiencyReq"
                                            checked={!isLanguageProficiencyReq}
                                            onChange={() => setIsLanguageProficiencyReq(false)}
                                            label={<span className="ps-1 fw-bold">No</span>}
                                            className="ms-3"
                                        />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="hasAssociationOtherAcademy">
                                    <Form.Label>Has association with other academy?</Form.Label>
                                    <div className="d-flex justify-content-start align-items-center mt-1">
                                        <Form.Check
                                            type="radio"
                                            name="hasAssociationOtherAcademy"
                                            checked={hasAssociationOtherAcademy}
                                            onChange={() => setHasAssociationOtherAcademy(true)}
                                            label={<span className="ps-1 fw-bold">Yes</span>}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="hasAssociationOtherAcademy"
                                            checked={!hasAssociationOtherAcademy}
                                            onChange={() => setHasAssociationOtherAcademy(false)}
                                            label={<span className="ps-1 fw-bold">No</span>}
                                            className="ms-3"
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={8} lg={8}>
                                <Form.Group className="mb-3 mt-1" controlId="channel_name">
                                    <FormInput label="Remarks" type="textarea" name="remarks" value={formData.remarks} onChange={handleInputChange} />
                                    {validationErrors.remarks && <Form.Text className="text-danger">{validationErrors.remarks}</Form.Text>}
                                </Form.Group>
                            </Col>
                        </Row>
                        {existingLeadId &&
                            <Row >
                                <Col md={12}>
                                    <h5>
                                        Lead with same email or phone already exist, check
                                        <Link to={`/leads/manage/${existingLeadId}`}> here</Link>
                                    </h5>
                                </Col>
                            </Row>
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" id="button-addon2" className="mt-1 ms-2" onClick={() => [handleResetValues()]}>
                            Clear
                        </Button>
                        <Button
                            variant="danger"
                            id="button-addon2"
                            className="mt-1"
                            onClick={() => {
                                if (isUpdate) {
                                    setExistingLeadId(null);
                                    handleCancelUpdate();
                                    toggle();
                                    handleResetValues();
                                } else {
                                    setExistingLeadId(null);
                                    toggle();
                                    handleResetValues();
                                }
                            }}
                        >
                            {isUpdate ? "Cancel" : "Close"}
                        </Button>
                        <Button type="submit" variant="success" id="button-addon2" className="mt-1" disabled={loading}>
                            {isUpdate ? "Update Lead" : "Create Lead"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
});

export default ExistLeadModal;
