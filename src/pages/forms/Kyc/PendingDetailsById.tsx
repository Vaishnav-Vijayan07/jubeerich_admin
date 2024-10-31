import React, { useEffect, useMemo, useState } from "react";
import { Form, Row } from "react-bootstrap";
import BasicDetails from "./BasicDetails";
import FormButtons from "./FormButtons";
import ProgramAvailabiltyCheck from "./ProgramAvailabiltyCheck";
import CampusCheck from "./CampusCheck";
import EntryRequirementCheck from "./EntryRequirementCheck";
import DocumentQualityCheck from "./DocumentQualityCheck";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl, showSuccessAlert } from "../../../constants";
import moment from "moment";
import DocumentQuantityCheck from "./DocumentQuantityCheck";
import PreviousImmigrationCheck from "./PreviousImmigrationCheck";
import ApplicationFeeCheck from "./ApplicationFeeCheck";
import { Col } from "react-bootstrap";
import { FormInput } from "../../../components";
import { withSwal } from "react-sweetalert2";

const PendingDetailsById = withSwal((props: any) => {
  const { swal } = props;
  const { id } = useParams();
  const [remark, setRemark] = useState<any>('');
  const [current, setCurrent] = React.useState(0);
  const [item, setItem] = useState<any>({});

  const formattedItem = useMemo(
    () => ({
      id: item?.existApplication?.id,
      full_name: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.full_name || 'N/A',
      country_name: item?.studyPreferDetails?.studyPreference?.country?.country_name || 'N/A',
      university_name: item?.studyPreferDetails?.preferred_university?.university_name || 'N/A',
      course_name: item?.studyPreferDetails?.preferred_courses?.course_name || 'N/A',
      office_type_name: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.office_type_name?.office_type_name || 'N/A',
      source_name: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.source_name?.source_name || 'N/A',
      lead_received_date: moment(item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.lead_received_date).format('DD-MM-YYYY') || 'N/A',
      date: "2021-01-12 18:30:00",
      assigned_by: "Counsellor",
      assign_type: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.assign_type || 'N/A',
      assigned_to: item?.assigned_user?.name || 'N/A',
      employee_name: "John Doe",
      status: (item?.existApplication?.application_status) ? 'Approved': 'Not Approved',
    }),
    [item]
  );

  const studentId = useMemo(() => item?.studyPreferDetails?.studyPreference?.userPrimaryInfoId, [item]);
  const applicationId = useMemo(() => item?.existApplication?.id, [item]);

  const availabilityCheck = useMemo(
    () => ({
      id: item?.existApplication?.id,
      country_name: item?.studyPreferDetails?.studyPreference?.country?.country_name || 'N/A',
      university_name: item?.studyPreferDetails?.preferred_university?.university_name || 'N/A',
      stream_name: item?.studyPreferDetails?.preferred_stream?.stream_name || 'N/A',
      program_name: item?.studyPreferDetails?.preferred_courses?.course_name || 'N/A',
      intake_applying_for: `${item?.studyPreferDetails?.intakeMonth || 'N/A'} / ${item?.studyPreferDetails?.intakeYear || 'N/A'}`,
      course_link: item?.studyPreferDetails?.preferred_courses?.campuses?.[0]?.campus_course?.course_link
    }),
    [item]
  );

  const campusCheck = useMemo(
    () => ({
      id: item?.existApplication?.id,
      campus_name: item?.studyPreferDetails?.preferred_campus?.campus_name || 'N/A'
    }),
    [item]
  );

  const getApplicationsById = async(id: any) => {
    try {
      const result = await axios.get(`${baseUrl}/api/application/${id}`);
      if(result){
        setItem(result?.data?.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(id) getApplicationsById(id);
  }, [])
  



  const buttonNavigations = (type: "next" | "prev") => {
    if (type === "next") {
      setCurrent(current + 1);
    } else {
      setCurrent(current - 1);
    }
  };

  const rejectApplication = async(id: any) => {
    try {

      let payload = {
        student_id: studentId,
        remarks: remark,
        application_id :applicationId
      }

      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
      });

      if (result.isConfirmed) {
        const res = await axios.post(`/kyc_reject`, payload);
        if(res){
          showSuccessAlert('Rejected Succesfully')
        }
      }
   
    } catch (error) {
      console.log(error);
    }
  }

  const handleRejection = (value: number) => {
    rejectApplication(value);
  }

  return (
    <>
      <Row className="mt-2">
        <BasicDetails data={formattedItem} />
      </Row>

      {current === 0 && <ProgramAvailabiltyCheck data={availabilityCheck} />}
      {current === 1 && <CampusCheck data={campusCheck} />}
      {current === 2 && <EntryRequirementCheck studentId={studentId} />}
      {current === 3 && <DocumentQuantityCheck studentId={studentId} applicationId={applicationId} />}
      {current === 4 && <DocumentQualityCheck studentId={studentId} />}
      {current === 5 && <PreviousImmigrationCheck studentId={studentId}/>}
      {current === 6 && <ApplicationFeeCheck studentId={studentId}/>}

      <Row style={{ padding: '0px' }}>
        <Col md={12} style={{ padding: '0px' }}>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <FormInput name="remarks" type="textarea" rows="6" label="Remarks" value={remark} onChange={(e) => setRemark(e.target?.value)} />
          </Form.Group>
        </Col>
        <FormButtons handleNavigation={buttonNavigations} current={current} handleReject={handleRejection} />
      </Row>
    </>
  );
});

export default PendingDetailsById;
