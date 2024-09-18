import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { withSwal } from "react-sweetalert2";
import { baseUrl } from '../../../../constants';
import VisaProcessRow from './VisaProcessRow';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { getCourse } from '../../../../redux/course/actions';
import { getUniversity } from '../../../../redux/University/actions';

const VisaProcess = withSwal((props: any) => {
  const { swal, studentId } = props;
  let userInfo = sessionStorage.getItem("jb_user");
  let loggedUser: any;
  if (userInfo) {
    loggedUser = JSON.parse(userInfo)
  }

  const initialVisaDeclineForm = {
    id: "0",
    student_id: studentId,
    country_id: "",
    visa_type: "",
    course_applied: "",
    university_applied: "",
    rejection_reason: "",
  };

  const initialVisaApproveForm = {
    id: "0",
    student_id: studentId,
    country_id: "",
    visa_type: "",
    course_applied: "",
    university_applied: "",
  };

  const initialTravelHistoryForm = {
    id: "0",
    student_id: studentId,
    country_id: "",
    start_date: "",
    end_date: "",
    purpose_of_travel: "",
  };

  const [loading, setLoading] = useState(false);
  const [visaDeclineData, setVisaDeclineData] = useState<any>(null);
  const [visaApproveData, setVisaApproveData] = useState<any>(null);
  const [travelHistoryData, setTravelHistoryData] = useState<any>(null);
  const [visaDeclineFormData, setVisaDeclineFormData] = useState<any>([initialVisaDeclineForm]);
  const [visaApproveFormData, setVisaApproveFormData] = useState<any>([initialVisaApproveForm]);
  const [travelHistoryFormData, setTravelHistoryFormData] = useState<any>([initialTravelHistoryForm]);

  const dispatch = useDispatch<AppDispatch>();

  const { country, courses, universities } = useSelector((state: RootState) => ({
    country: state.Country.countries,
    courses: state.Course.course?.data,
    universities: state.University.universities?.data
  }));

  useEffect(() => {
    getVisaProcess()
  }, [studentId])

  useEffect(() => {
    dispatch(getCourse())
    dispatch(getUniversity())
  }, [studentId])

  const formatSelectOptions = (data: any[], valueKey: string, labelKey: string) => {
    if (!data) return [];
    return data.map((item) => ({
      value: item[valueKey]?.toString(),
      label: item[labelKey] as string,
    }));
  };

  const countryData = useMemo(() => formatSelectOptions(country, "id", "country_name"), [country]);

  const courseData = useMemo(() => formatSelectOptions(courses, "id", "course_name"), [courses]);

  const universityData = useMemo(() => formatSelectOptions(universities, "id", "university_name"), [universities]);

  const getVisaProcess = async () => {
    const result = await axios.get(`${baseUrl}/api/visa_process/${studentId}`);
    if (result) {
      setVisaApproveData(result?.data?.data?.previousVisaApprove);
      setVisaDeclineData(result?.data?.data?.previousVisaDeclineData);
      setTravelHistoryData(result?.data?.data?.travelHistory);

      setVisaApproveFormData(result?.data?.data?.previousVisaApprove);
      setVisaDeclineFormData(result?.data?.data?.previousVisaDeclineData);
      setTravelHistoryFormData(result?.data?.data?.travelHistory);
    }
  }

  const handleVisaInputChange = (index: any, e: any, formName: any) => {
    console.log('Target', e.target);
    const { name, value } = e.target;

    switch (formName) {
      case 'visa_decline':
        const newVisaDeclineFormData = [...visaDeclineFormData];
        newVisaDeclineFormData[index][name] = value;
        setVisaDeclineFormData(newVisaDeclineFormData);
        break;
      case 'visa_approve':
        const newVisaApproveFormData = [...visaApproveFormData];
        newVisaApproveFormData[index][name] = value;
        setVisaApproveFormData(newVisaApproveFormData);
        break;
      case 'travel_history':
        const newTravelHistoryFormData = [...travelHistoryFormData];
        newTravelHistoryFormData[index][name] = value;
        setTravelHistoryFormData(newTravelHistoryFormData);
        break;
      default:
        break;
    }
  };

  const handleVisaSelectChange = (
    index: number,
    field: string,
    value: any,
    formName: any
  ) => {

    switch (formName) {
      case 'visa_decline':
        const newVisaDeclineFormData = [...visaDeclineFormData];
        newVisaDeclineFormData[index][field] = value;
        setVisaDeclineFormData(newVisaDeclineFormData);
        break;
      case 'visa_approve':
        const newVisaApproveFormData = [...visaApproveFormData];
        newVisaApproveFormData[index][field] = value;
        setVisaApproveFormData(newVisaApproveFormData);
        break;
      case 'travel_history':
        const newTravelHistoryFormData = [...travelHistoryFormData];
        newTravelHistoryFormData[index][field] = value;
        setTravelHistoryFormData(newTravelHistoryFormData);
        break;
      default:
        break;
    }
  };

  const addMoreVisaForm = (formName: string) => {
    console.log('formName', formName);

    switch (formName) {
      case 'visa_decline':
        setVisaDeclineFormData([
          ...visaDeclineFormData,
          initialVisaDeclineForm
        ]);
        break;
      case 'visa_approve':
        setVisaApproveFormData([
          ...visaApproveFormData,
          initialVisaApproveForm
        ]);
        break;
      case 'travel_history':
        setTravelHistoryFormData([
          ...travelHistoryFormData,
          initialTravelHistoryForm
        ]);
        break;
      default:
        break;
    }
  };

  const removeVisaItem = async(id: any, formName: any) => {
    try {
      let result = await axios.delete(`${baseUrl}/api/delete_visa_item/${formName}/${id}`);
      console.log('result',result);
      
    } catch (error) {
      console.log(error);
    }
  }

  const removeVisaForm = (index: any, itemId: any, formName: string) => {
    switch (formName) {
      case 'visa_approve':
        if (itemId == 0) {
          const newVisaApproveFormData = [...visaApproveFormData];
          newVisaApproveFormData.splice(index, 1);
          setVisaApproveFormData(newVisaApproveFormData);
        } else {
          removeVisaItem(itemId, "visa_approve")
        }
        break;
      case 'visa_decline':
        if (itemId == 0) {
          const newVisaDeclineFormData = [...visaDeclineFormData];
          newVisaDeclineFormData.splice(index, 1);
          setVisaDeclineFormData(newVisaDeclineFormData);
        } else {
          removeVisaItem(itemId, "visa_decline")
        }
        break;
      case 'travel_history':
        if (itemId == 0) {
          const newVisaTravelFormData = [...travelHistoryFormData];
          newVisaTravelFormData.splice(index, 1);
          setTravelHistoryFormData(newVisaTravelFormData);
        } else {
          removeVisaItem(itemId, "travel_history")
        }
        break;
      default:
        break;
    }
  };

  const saveVisaFormData = (submitName: string) => {
    switch (submitName) {
      case 'visa_decline':
        submitDeclinedVisa();
        break;
      case 'visa_approve':
        submitApprovedVisa();
        break;
      case 'travel_history':
        submitTravelHistory();
        break;
      default:
        break;
    }
  }

  const submitDeclinedVisa = async () => {
    try {
      let body = {
        userId: loggedUser.user_id,
        visaDecline: visaDeclineFormData
      }

      console.log('BODY', body);

      let result = await axios.post(`${baseUrl}/api/visa_decline_process/`, body);
      console.log('result', result);
    } catch (error) {
      console.log(error);
    }
  }

  const submitApprovedVisa = async () => {
    try {
      let body = {
        userId: loggedUser.user_id,
        visaApproved: visaApproveFormData
      }

      console.log('BODY', body);

      let result = await axios.post(`${baseUrl}/api/visa_approve_process/`, body);
      console.log('result', result);
    } catch (error) {
      console.log(error);
    }
  }

  const submitTravelHistory = async () => {
    try {
      let body = {
        userId: loggedUser.user_id,
        travelHistory: travelHistoryFormData
      }

      console.log('BODY', body);

      let result = await axios.post(`${baseUrl}/api/travel_history/`, body);
      console.log('result', result);
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "100%", left: "45%" }}
      />
    );
  }

  return (
    <>
      <VisaProcessRow
        saveVisaForm={saveVisaFormData}
        visaDecline={visaDeclineFormData}
        visaApprove={visaApproveFormData}
        travelHistory={travelHistoryFormData}
        countries={countryData}
        courses={courseData}
        universities={universityData}
        handleVisaInputChange={handleVisaInputChange}
        handleVisaSelectChange={handleVisaSelectChange}
        addMoreVisaForm={addMoreVisaForm}
        removeVisaForm={removeVisaForm} />
    </>
  )
})

export default VisaProcess