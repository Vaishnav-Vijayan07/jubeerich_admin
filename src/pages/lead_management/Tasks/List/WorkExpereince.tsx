import React, { useEffect, useState } from "react";
import { Button, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import { withSwal } from "react-sweetalert2";
import WorkExpRow from "./WorkExpRow";
import { isAllItemsPresentWork } from "../../../../utils/fieldsChecker";
import useRemoveFromApi from "../../../../hooks/useRemoveFromApi";

const initialStateWork = {
  id: 0,
  years: 0,
  designation: "",
  company: "",
  from: "",
  to: "",
};

const WorkExpereince = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [loading, setLoading] = useState(false);

  const [workExperienceFromApi, setWorkExperienceFromApi] = useState<any>(null);
  const getAcademicInfo = () => {
    axios
      .get(`getStudentAcademicInfo/${studentId}`)
      .then((res) => {
        setWorkExperienceFromApi(
          res.data.data?.workValues.length > 0
            ? res.data.data.workValues
            : [initialStateWork]
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const { removeFromApi, loading: deleteLoading } =
    useRemoveFromApi(getAcademicInfo);

  // apis

  useEffect(() => {
    if (studentId) {
      getAcademicInfo();
    }
  }, [studentId]);

  const saveStudentAcademicInfo = async () => {
    const newFormData = new FormData();

    if (workExperienceFromApi.length > 0) {
      const validItems = workExperienceFromApi.filter((item: any) =>
        isAllItemsPresentWork(item)
      );

      validItems.forEach((work: any, index: any) => {
        const itemId = work.id ?? "0";

        newFormData.append(`workExperience[${index}][id]`, itemId);
        newFormData.append(`workExperience[${index}][years]`, work.years);
        newFormData.append(
          `workExperience[${index}][designation]`,
          work.designation
        );
        newFormData.append(`workExperience[${index}][company]`, work.company);
        newFormData.append(`workExperience[${index}][from]`, work.from);
        newFormData.append(`workExperience[${index}][to]`, work.to);
      });
    }

    newFormData.append("user_id", studentId.toString());

    swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios
            .post("saveStudentWorkInfo", newFormData)
            .then((res) => {
              console.log("res: =>", res);
              setLoading(false);
              showSuccessAlert(res.data.message);
              getAcademicInfo();
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              showErrorAlert("Error occured");
            });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleWorkExperienceChange = (index: any, e: any) => {
    const { name, value } = e.target;
    const newWorkExperience = [...workExperienceFromApi];
    newWorkExperience[index][name] = value;
    setWorkExperienceFromApi(newWorkExperience);
  };

  const addMoreWorkExperience = () => {
    setWorkExperienceFromApi([
      ...workExperienceFromApi,
      {
        years: 0,
        designation: "",
        company: "",
        from: "",
        to: "",
      },
    ]);
  };

  const removeWorkExperience = (index: any, itemId: any) => {
    if (itemId == 0) {
      console.log("FROM STATE");
      const newWorkExperience = [...workExperienceFromApi];
      newWorkExperience.splice(index, 1);
      setWorkExperienceFromApi(newWorkExperience);
    } else {
      console.log("FROM API");
      removeFromApi(itemId, "work");
    }
  };

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
      <Row className={deleteLoading ? "opacity-25" : ""}>
        <WorkExpRow
          workExperience={workExperienceFromApi}
          handleWorkExperienceChange={handleWorkExperienceChange}
          addMoreWorkExperience={addMoreWorkExperience}
          removeWorkExperience={removeWorkExperience}
        />
      </Row>
      <Row>
        <Button
          variant="primary"
          className="mt-4"
          type="submit"
          onClick={saveStudentAcademicInfo}
          disabled={deleteLoading}
        >
          {deleteLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {" Loading..."} {/* Show spinner and text */}
            </>
          ) : (
            "Save Details" // Normal button text when not loading
          )}
        </Button>
      </Row>
    </>
  );
});

export default WorkExpereince;
