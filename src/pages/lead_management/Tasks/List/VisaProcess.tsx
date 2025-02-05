import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { withSwal } from "react-sweetalert2";
import { baseUrl, showErrorAlert, showSuccessAlert } from "../../../../constants";
import VisaProcessRow from "./VisaProcessRow";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getCourse } from "../../../../redux/course/actions";
import { getUniversity } from "../../../../redux/University/actions";
import { allowedFileTypes, travel_history, visa_approve, visa_decline } from "./data";
import { getCountry } from "../../../../redux/country/actions";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import validateFields from "../../../../helpers/validateHelper";
import { count } from "console";

const VisaProcess = withSwal((props: any) => {
  const { swal, studentId } = props;
  let userInfo = sessionStorage.getItem("jb_user");
  let loggedUser: any;
  if (userInfo) {
    loggedUser = JSON.parse(userInfo);
  }

  const initialVisaDeclineForm = {
    id: "0",
    student_id: studentId,
    country_id: "",
    visa_type: "",
    course_applied: "",
    university_applied: "",
    rejection_reason: "",
    decline_letter: null,
    errors: {},
  };

  const initialVisaApproveForm = {
    id: "0",
    student_id: studentId,
    country_id: "",
    visa_type: "",
    course_applied: "",
    university_applied: "",
    approve_letter: "",
    errors: {},
  };

  const initialTravelHistoryForm = {
    id: "0",
    student_id: studentId,
    country_id: "",
    start_date: "",
    end_date: "",
    purpose_of_travel: "",
    errors: {},
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [visaDeclineFormData, setVisaDeclineFormData] = useState<any>([initialVisaDeclineForm]);
  const [visaApproveFormData, setVisaApproveFormData] = useState<any>([initialVisaApproveForm]);
  const [travelHistoryFormData, setTravelHistoryFormData] = useState<any>([initialTravelHistoryForm]);
  const [visaApproveDocs, setVisaApproveDocs] = useState<any[]>([]);
  const [visaDeclinedDocs, setVisaDeclinedDocs] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { country, courses, universities } = useSelector((state: RootState) => ({
    country: state.Country.countries,
    courses: state.Course.course?.data,
    universities: state.University.universities?.data,
  }));

  useEffect(() => {
    getVisaProcess();
  }, [studentId]);

  useEffect(() => {
    dispatch(getCourse());
    dispatch(getCountry());
    dispatch(getUniversity());
  }, [studentId]);

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
    const emptyFile = new File([], "empty.txt", {
      type: "text/plain",
    });
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}api/visa_process/${studentId}`);
      console.log("response", response);

      if (response && response.data) {
        const data = response.data.data;
        setVisaApproveFormData(data?.previousVisaApprove);
        setVisaDeclineFormData(data?.previousVisaDeclineData);
        setTravelHistoryFormData(data?.travelHistory);

        if (Array.isArray(data?.previousVisaApprove)) {
          for (let i = 0; i < data?.previousVisaApprove.length; i++) {
            setVisaApproveDocs((prevFile: any) => [...prevFile, emptyFile]);
          }
        }

        if (Array.isArray(data?.previousVisaDeclineData)) {
          for (let i = 0; i < data?.previousVisaDeclineData.length; i++) {
            setVisaDeclinedDocs((prevFile: any) => [...prevFile, emptyFile]);
          }
        }
        setLoading(false);
      } else {
        setVisaApproveFormData(initialVisaApproveForm);
        setVisaDeclineFormData(initialVisaDeclineForm);
        setTravelHistoryFormData(initialTravelHistoryForm);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching visa process data:", error);
      showErrorAlert("Error fetching visa process data");
      setLoading(false);
    }
  };

  const handleVisaInputChange = (index: any, e: any, formName: any) => {
    const { name, value } = e.target;

    switch (formName) {
      case visa_decline:
        const newVisaDeclineFormData = [...visaDeclineFormData];
        newVisaDeclineFormData[index][name] = value;
        setVisaDeclineFormData(newVisaDeclineFormData);
        break;
      case visa_approve:
        const newVisaApproveFormData = [...visaApproveFormData];
        newVisaApproveFormData[index][name] = value;
        setVisaApproveFormData(newVisaApproveFormData);
        break;
      case travel_history:
        const newTravelHistoryFormData = [...travelHistoryFormData];
        newTravelHistoryFormData[index][name] = value;
        setTravelHistoryFormData(newTravelHistoryFormData);
        break;
      default:
        break;
    }
  };

  const handleVisaSelectChange = (index: number, field: string, value: any, formName: any) => {
    switch (formName) {
      case visa_decline:
        const newVisaDeclineFormData = [...visaDeclineFormData];
        newVisaDeclineFormData[index][field] = value;
        setVisaDeclineFormData(newVisaDeclineFormData);
        break;
      case visa_approve:
        const newVisaApproveFormData = [...visaApproveFormData];
        newVisaApproveFormData[index][field] = value;
        setVisaApproveFormData(newVisaApproveFormData);
        break;
      case travel_history:
        const newTravelHistoryFormData = [...travelHistoryFormData];
        newTravelHistoryFormData[index][field] = value;
        setTravelHistoryFormData(newTravelHistoryFormData);
        break;
      default:
        break;
    }
  };

  const addMoreVisaForm = (formName: string) => {
    switch (formName) {
      case visa_decline:
        setVisaDeclineFormData([...visaDeclineFormData, initialVisaDeclineForm]);
        break;
      case visa_approve:
        setVisaApproveFormData([...visaApproveFormData, initialVisaApproveForm]);
        break;
      case travel_history:
        setTravelHistoryFormData([...travelHistoryFormData, initialTravelHistoryForm]);
        break;
      default:
        break;
    }
  };

  const removeVisaItem = async (id: any, formName: any) => {
    try {
      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to remove this visa item?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Remove`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
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

      if (result.isConfirmed) {
        setLoading(true);

        try {
          let result = await axios.delete(`${baseUrl}api/delete_visa_item/${formName}/${id}`);
          showSuccessAlert(result.data.message);
          setVisaApproveDocs([]);
          setVisaDeclinedDocs([]);
          getVisaProcess();
        } catch (err) {
          console.error(err);
          showErrorAlert("Error occurred");
          setVisaApproveDocs([]);
          setVisaDeclinedDocs([]);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeVisaForm = (index: any, itemId: any, formName: string) => {
    switch (formName) {
      case visa_approve:
        if (itemId == 0) {
          const newVisaApproveFormData = [...visaApproveFormData];
          newVisaApproveFormData.splice(index, 1);
          setVisaApproveFormData(newVisaApproveFormData);
        } else {
          removeVisaItem(itemId, visa_approve);
        }
        break;
      case visa_decline:
        if (itemId == 0) {
          const newVisaDeclineFormData = [...visaDeclineFormData];
          newVisaDeclineFormData.splice(index, 1);
          setVisaDeclineFormData(newVisaDeclineFormData);
        } else {
          removeVisaItem(itemId, visa_decline);
        }
        break;
      case travel_history:
        if (itemId == 0) {
          const newVisaTravelFormData = [...travelHistoryFormData];
          newVisaTravelFormData.splice(index, 1);
          setTravelHistoryFormData(newVisaTravelFormData);
        } else {
          removeVisaItem(itemId, travel_history);
        }
        break;
      default:
        break;
    }
  };

  const saveVisaFormData = (submitName: string) => {
    switch (submitName) {
      case visa_decline:
        submitDeclinedVisa();
        break;
      case visa_approve:
        submitApprovedVisa();
        break;
      case travel_history:
        submitTravelHistory();
        break;
      default:
        break;
    }
  };

  const submitDeclinedVisa = async () => {
    const validationRules = {
      course_applied: { required: true,message:"Please enter a course applied" },
      country_id: { required: true,message:"Please select a country" },
      rejection_reason: { required: false, message: "Please enter a rejection reason" }, 
      university_applied: { required: true,message:"Please enter a university applied" },
      visa_type: { required: false, message: "Please enter a visa type" },
    };

    const { isValid, errors } = validateFields(visaDeclineFormData, validationRules);

    if (!isValid) {
      setVisaDeclineFormData((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }

    const newFormData = new FormData();

    for (let data of visaDeclinedDocs) {
      newFormData.append("visaDeclinedDocs", data);
    }

    newFormData.append("visaDecline", JSON.stringify(visaDeclineFormData));
    newFormData.append("userId", loggedUser.user_id);

    for (let [key, value] of Object.entries(newFormData)) {
      console.log(`${key}: ${value}`);
    }

    const body = {
      userId: loggedUser.user_id,
      visaDecline: visaDeclineFormData,
    };

    try {
      const confirmationResult = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to save the visa declined details?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Save`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
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

      if (confirmationResult.isConfirmed) {
        setLoading(true);
        try {
          const response = await axios.post(`${baseUrl}api/visa_decline_process/`, newFormData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          });
          // const response = await axios.post(`${baseUrl}api/visa_decline_process/`, body);
          console.log("response", response);
          showSuccessAlert(response.data.message);
          setVisaDeclinedDocs([]);
          getVisaProcess();
        } catch (error) {
          console.error("Error during API call:", error);
          showErrorAlert("Error occurred");
          setVisaDeclinedDocs([]);
        } finally {
          setLoading(false);
          setVisaDeclinedDocs([]);
        }
      }
    } catch (error) {
      console.error("Error during confirmation process:", error);
    }
  };

  const submitApprovedVisa = async () => {
    const validationRules = {
      course_applied: { required: true, message: "Please enter a course applied" },
      country_id: { required: true, message: "Please select a country" },
      university_applied: { required: true, message: "Please enter a university applied" },
      visa_type: { required: false, message: "Please enter a visa type" },
    };

    const { isValid, errors } = validateFields(visaApproveFormData, validationRules);

    if (!isValid) {
      setVisaApproveFormData((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }

    const newFormData = new FormData();

    for (let data of visaApproveDocs) {
      newFormData.append("visaApprovedDocs", data);
    }

    newFormData.append("visaApproved", JSON.stringify(visaApproveFormData));
    newFormData.append("userId", loggedUser.user_id);

    for (let [key, value] of Object.entries(newFormData)) {
      console.log(`${key}: ${value}`);
    }

    const body = {
      userId: loggedUser.user_id,
      visaApproved: visaApproveFormData,
    };

    try {
      const confirmationResult = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to save the visa approved details?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Save`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
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

      if (confirmationResult.isConfirmed) {
        setLoading(true);

        try {
          const response = await axios.post(`${baseUrl}api/visa_approve_process/`, newFormData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          });
          // const response = await axios.post(`${baseUrl}api/visa_approve_process/`, body);
          console.log("response", response);
          showSuccessAlert(response.data.message);
          setVisaApproveDocs([]);
          getVisaProcess();
        } catch (error) {
          console.error("Error during API call:", error);
          showErrorAlert("Error occurred");
          setVisaApproveDocs([]);
        } finally {
          setLoading(false);
          setVisaApproveDocs([]);
        }
      }
    } catch (error) {
      console.error("Error during confirmation process:", error);
    }
  };

  const submitTravelHistory = async () => {
    const validationRules = {
      country_id: { required: true, message: "Please select a country" },
      start_date: { required: false, message: "Please select a start date" },
      end_date: { required: false, message: "Please select an end date" },
      purpose_of_travel: { required: false, message: "Please enter a purpose of travel" },
    };

    const { isValid, errors } = validateFields(travelHistoryFormData, validationRules);

    if (!isValid) {
      setTravelHistoryFormData((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }

    const body = {
      userId: loggedUser.user_id,
      travelHistory: travelHistoryFormData,
    };

    try {
      const confirmationResult = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to save the travel history details?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Save`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
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

      if (confirmationResult.isConfirmed) {
        setLoading(true);

        try {
          const response = await axios.post(`${baseUrl}api/travel_history/`, body);
          console.log("response", response);
          showSuccessAlert(response.data.message);
          getVisaProcess();
        } catch (error) {
          console.error("Error during API call:", error);
          showErrorAlert("Error occurred");
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error during confirmation process:", error);
    }
  };

  const handleFileChange = (e: any, docType: any, index: any) => {
    const file = e.target.files?.[0];
    const { name } = e.target;

    if (file&& !allowedFileTypes.includes(file.type)) {
      showErrorAlert("Only PDF and image files are allowed.");
      return;
    }

    switch (docType) {
      case visa_approve:
        visaApproveDocs.splice(index, 1, file);
        setVisaApproveDocs([...visaApproveDocs]);
        break;
      case visa_decline:
        visaDeclinedDocs.splice(index, 1, file);
        setVisaDeclinedDocs([...visaDeclinedDocs]);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonComponent />
      ) : (
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
          removeVisaForm={removeVisaForm}
          handleFileChange={handleFileChange}
          studentId={studentId}
        />
      )}
    </>
  );
});

export default VisaProcess;
