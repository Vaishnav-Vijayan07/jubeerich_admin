import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import ParentDetailsForm from "./ParentsDetailForm";
import { FormInput } from "../../../../../components";
import ActionButton from "../ActionButton";
import { showErrorAlert, showSuccessAlert } from "../../../../../constants";
import swal from "sweetalert2";
import Select from "react-select";
import SiblingsDetails from "./SiblingsDetails";
import ChildrenDetails from "./ChildrenDetails";
import AccompanyingDetails from "./AccompanyingDetails";
import RelativesDetails from "./RelativesDetails";
import { familyDetailsReducer } from "./FamilyDataReducer";
import axios from "axios";
import GrandParentDetailsForm from "./GrandParentsDetailForm";
import SkeletonComponent from "../StudyPreference/LoadingSkeleton";
import { regrexValidation } from "../../../../../utils/regrexValidation";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import GroupIcon from '@mui/icons-material/Group';

interface Props {
  studentId: string | number;
}

// const initialFamilyDetailsState = {
//   father: {
//     name: "",
//     occupation: "",
//     annual_income: 0,
//     organization: "",
//     income_tax_payer: true,
//     nature_of_occupation: "",
//   },
//   mother: {
//     name: "",
//     occupation: "",
//     annual_income: 0,
//     organization: "",
//     income_tax_payer: true,
//     nature_of_occupation: "",
//   },
//   number_of_siblings: 0,
//   siblings_info: [
//     {
//       name: "",
//       occupation: "",
//       annual_income: 0,
//       income_tax_payer: true,
//     },
//   ],
//   number_of_children: 0,
//   children_info: [
//     {
//       name: "",
//       gender: "",
//       age: 0,
//     },
//   ],
//   accompanying_child: false,
//   accompanying_spouse: false,
//   spouse: {
//     name: "",
//     occupation: "",
//     annual_income: 0,
//     organization: "",
//     income_tax_payer: true,
//   },
//   relatives_info: "",
// };

const initialFamilyDetailsState = {
  father: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  mother: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  number_of_siblings: 0,
  siblings_info: [
    {
      name: "",
      age: "",
      dob: "",
      occupation: "",
      annual_income: 0,
      organization: "",
      income_tax_payer: true,
      nature_of_occupation: "",
      location: "",
      designation: "",
      duration: 0,
      current_status: "",
      monthly_salary: 0,
      mode_of_payment: "",
      current_income_source: "",
    },
  ],
  number_of_children: 0,
  children_info: [
    {
      name: "",
      gender: "",
      age: 0,
      dob: "",
    },
  ],
  accompanying_child: false,
  accompanying_spouse: false,
  spouse: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  paternal_grand_mother_info: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  paternal_grand_father_info: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  maternal_grand_mother_info: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  maternal_grand_father_info: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  paternal_grand_mother_info_spouse: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  paternal_grand_father_info_spouse: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  maternal_grand_mother_info_spouse: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  maternal_grand_father_info_spouse: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  father_in_law_info: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  mother_in_law_info: {
    name: "",
    age: "",
    dob: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
    location: "",
    designation: "",
    duration: 0,
    current_status: "",
    monthly_salary: 0,
    mode_of_payment: "",
    current_income_source: "",
  },
  relatives_info: "",
};

export const natureOfOccupaton = [
  { label: "Self Employed", value: "self_employed" },
  { label: "Salaried", value: "salaried" },
  { label: "Business", value: "business" },
];

export const currentStatus = [
  { label: "Working", value: "working" },
  { label: "Relieved", value: "relieved" },
];

export const modeOfPayment = [
  { label: "By Cash", value: "by_cash" },
  { label: "Bank", value: "bank" },
];

const FamilyDetails = ({ studentId }: Props) => {
  const [initialLoading, setInitialLoading] = useState(false);

  const [familyDetails, dispatch] = useReducer(familyDetailsReducer, initialFamilyDetailsState);

  const fetchFamilyDetails = async () => {
    setInitialLoading(true);
    try {
      const { data } = await axios.get(`family_information/${studentId}`);

      if (data.data) {
        dispatch({ type: "SET_BACKEND_DATA", data: data.data });
      } else {
        dispatch({ type: "SET_BACKEND_DATA", data: initialFamilyDetailsState });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchFamilyDetails();
    }
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    console.log(name, value, type, checked);

    const [relation, field] = name.split(".");

    console.log(relation);

    if (relation === "siblings") {
      const [_, index, siblingField] = name.split(".");

      if (!regrexValidation(siblingField, value.toString())) {
        console.error(`Invalid ${siblingField}: ${value}`);
        return; // Stop updating if validation fails
      }

      dispatch({
        type: "UPDATE_SIBLING",
        index: parseInt(index),
        field: siblingField,
        value: type === "checkbox" ? checked : value,
      });

    } else if (relation === "children") {
      const [_, index, childField] = name.split(".");

      if (!regrexValidation(childField, value.toString())) {
        console.error(`Invalid ${childField}: ${value}`);
        return; // Stop updating if validation fails
      }

      dispatch({
        type: "UPDATE_CHILD",
        index: parseInt(index),
        field: childField,
        value: type === "checkbox" ? checked : value,
      });

    } else if (relation === "mother" || relation === "father" || relation === "spouse") {

      const regexPatterns: Record<string, RegExp> = {
        [`${relation}.name`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
        [`${relation}.occupation`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
        [`${relation}.organization`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
        [`${relation}.designation`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
        [`${relation}.current_income_source`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
        [`${relation}.location`]: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
      };

      // Check if the field has a validation regex
      if (regexPatterns[name]) {
        if (!regexPatterns[name].test(value.toString())) {
          console.error(`Invalid ${name}: ${value}`);
          return; // Stop updating if validation fails
        }
      }

      dispatch({
        type: "UPDATE_PARENT",
        parentType: relation,
        field,
        value: type === "checkbox" ? checked : value,
      });
    } else if (
      relation == "paternal_grand_mother_info" ||
      relation == "paternal_grand_father_info" ||
      relation == "maternal_grand_mother_info" ||
      relation == "maternal_grand_father_info" ||
      relation == "paternal_grand_mother_info_spouse" ||
      relation == "paternal_grand_father_info_spouse" ||
      relation == "maternal_grand_mother_info_spouse" ||
      relation == "maternal_grand_father_info_spouse" ||
      relation === "mother_in_law_info" ||
      relation === "father_in_law_info"
    ) {

      const regexPatterns: Record<string, RegExp> = {
        [`${relation}.name`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
        [`${relation}.occupation`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
        [`${relation}.designation`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
        [`${relation}.organization`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
        [`${relation}.current_income_source`]: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
        [`${relation}.location`]: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
      };

      // Check if the field has a validation regex
      if (regexPatterns[name]) {
        if (!regexPatterns[name].test(value.toString())) {
          console.error(`Invalid ${name}: ${value}`);
          return; // Stop updating if validation fails
        }
      }

      dispatch({
        type: "UPDATE_GRAND_PARENT",
        parentType: relation,
        field,
        value: type === "checkbox" ? checked : value,
      });

    } else if (name.startsWith("accompanying_")) {
      dispatch({
        type: "UPDATE_ACCOMPANYING",
        accompanyingType: name.split("_")[1],
        value: value === "true",
      });
    } else if (name === "number_of_children" || name === "number_of_siblings") {
      let typeToDispatch: any = name === "number_of_children" ? "UPDATE_NUMBER_OF_CHILDREN" : "UPDATE_NUMBER_OF_SIBLINGS";

      dispatch({
        type: typeToDispatch,
        value: value,
      });
    } else {
      dispatch({
        type: "UPDATE_RELATIVES",
        value,
      });
    }
  };

  const handleRemoveItem = (type: "children_info" | "siblings_info", index: number) => {
    if (type === "children_info") {
      dispatch({
        type: "REMOVE_CHILD",
        index,
      });
    } else if (type === "siblings_info") {
      dispatch({
        type: "REMOVE_SIBLING",
        index,
      });
    }
  };

  const handleAddSibling = () => {
    const { number_of_siblings, siblings_info } = familyDetails;

    console.log(number_of_siblings, siblings_info);

    // Limit to the number of passports specified
    if (siblings_info.length >= Number(number_of_siblings)) {
      showErrorAlert("Cannot add more siblings than the specified number.");
      return;
    }

    dispatch({
      type: "ADD_SIBLING",
    });
  };

  const handleAddChildren = () => {
    const { number_of_children, children_info } = familyDetails;

    console.log(number_of_children, children_info);

    // Limit to the number of children specified
    if (children_info.length >= Number(number_of_children)) {
      showErrorAlert("Cannot add more children than the specified number.");
      return;
    }

    dispatch({
      type: "ADD_CHILD",
    });
  };

  const saveFamilyDetails = async () => {
    console.log("Family Details", familyDetails);
    const result = await swal.fire({
      title: "Confirm Action",
      text: `Do you want to save the family details?`,
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

    if (result.isConfirmed) {
      const {
        father,
        mother,
        number_of_siblings,
        siblings_info,
        children_info,
        spouse,
        accompanying_spouse,
        number_of_children,
        accompanying_child,
        relatives_info,
        paternal_grand_mother_info,
        paternal_grand_father_info,
        maternal_grand_mother_info,
        maternal_grand_father_info,
        paternal_grand_mother_info_spouse,
        paternal_grand_father_info_spouse,
        maternal_grand_mother_info_spouse,
        maternal_grand_father_info_spouse,
        father_in_law_info,
        mother_in_law_info,
      } = familyDetails;

      const res = await axios.post(`family_information`, {
        user_id: studentId,
        father,
        mother,
        number_of_children,
        number_of_siblings,
        siblings_info,
        children_info,
        spouse,
        accompanying_spouse,
        accompanying_child,
        relatives_info,
        paternal_grand_mother_info,
        paternal_grand_father_info,
        maternal_grand_mother_info,
        maternal_grand_father_info,
        paternal_grand_mother_info_spouse,
        paternal_grand_father_info_spouse,
        maternal_grand_mother_info_spouse,
        maternal_grand_father_info_spouse,
        father_in_law_info,
        mother_in_law_info,
      });
      if (res) {
        fetchFamilyDetails();
        showSuccessAlert("Family Details Updated Succesfully");
      }
    }
  };

  const handleDropDowns = (selected: any, { name }: any) => {
    const [_, index, item] = name.split(".");

    // Parse the index for proper selection in the array
    const parsedIndex = parseInt(index, 10);

    // Dispatch action to update the children_info in the reducer
    dispatch({
      type: "UPDATE_CHILD",
      index: parsedIndex,
      field: item,
      value: selected.value,
    });
  };

  const typographyStyle = {
    fontWeight: 600,
    textTransform: "uppercase",
  };

  const groupIconStyle = {
    color: "primary.main",
    mr: 1
  }

  const accordionSummaryStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1
  }

  const SaveButton = () => {
    return (
      <>
        <Row style={{ padding: '2px' }}>
          <Col md={4} style={{ padding: '2px' }}>
            <Button variant="primary" className="mt-4" type="submit" onClick={saveFamilyDetails}>
              Save
            </Button>
          </Col>
        </Row>
      </>
    )
  }

  const getAccordionBGColor = (value: any) => {
    return { 
      backgroundColor: `${value ? "#F1F2F4" : ""}`,
      marginBottom: "10px"
    }
  }

  return (
    <>
      {initialLoading ? (
        <SkeletonComponent />
      ) : (
        <>
          <Row>
            <h5 className="mb-4 text-uppercase">
              <i className="mdi mdi-account-circle me-1"></i>Family Details
            </h5>
          </Row>

          <Row className="ps-4 pe-4">
            {/* Father's Information */}
            <Accordion defaultExpanded sx={getAccordionBGColor(familyDetails.father.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Father's Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <ParentDetailsForm parentType="father" parentDetails={familyDetails.father} onChange={handleInputChange} />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Mother's Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.mother.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Mother's Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <ParentDetailsForm parentType="mother" parentDetails={familyDetails.mother} onChange={handleInputChange} />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Spouse Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.spouse.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Spouse Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <ParentDetailsForm parentType="spouse" parentDetails={familyDetails.spouse} onChange={handleInputChange} />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Siblings Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.siblings_info?.[0]?.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Siblings Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <SiblingsDetails
                    handleInputChange={handleInputChange}
                    handleRemoveItem={handleRemoveItem}
                    handleAddSibling={handleAddSibling}
                    siblings={familyDetails?.siblings_info}
                    number_of_siblings={familyDetails?.number_of_siblings}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Children Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.children_info?.[0]?.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Children Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <ChildrenDetails
                    handleInputChange={handleInputChange}
                    handleRemoveItem={handleRemoveItem}
                    handleAddChildren={handleAddChildren}
                    children={familyDetails?.children_info}
                    number_of_children={familyDetails?.number_of_children}
                    handleDropDowns={handleDropDowns}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Paternal Grand Mother's Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.paternal_grand_mother_info.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Paternal Grand Mother's Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="paternal_grand_mother_info"
                    parentDetails={familyDetails.paternal_grand_mother_info}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Paternal Grand Fathers's Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.paternal_grand_father_info.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Paternal Grand Fathers's Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="paternal_grand_father_info"
                    parentDetails={familyDetails.paternal_grand_father_info}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Maternal Grand Mother's Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.maternal_grand_mother_info.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} > Maternal Grand Mother's Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="maternal_grand_mother_info"
                    parentDetails={familyDetails.maternal_grand_mother_info}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Maternal Grand Fathers's Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.maternal_grand_father_info.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Maternal Grand Fathers's Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="maternal_grand_father_info"
                    parentDetails={familyDetails.maternal_grand_father_info}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Paternal Grand Mother's Information Spouse */}
            <Accordion sx={getAccordionBGColor(familyDetails.paternal_grand_mother_info_spouse.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Paternal Grand Mother's Information Spouse</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="paternal_grand_mother_info_spouse"
                    parentDetails={familyDetails.paternal_grand_mother_info_spouse}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Paternal Grand Fathers's Information Spouse */}
            <Accordion sx={getAccordionBGColor(familyDetails.paternal_grand_father_info_spouse.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Paternal Grand Fathers's Information Spouse</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="paternal_grand_father_info_spouse"
                    parentDetails={familyDetails.paternal_grand_father_info_spouse}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Maternal Grand Mother's Information Spouse */}
            <Accordion sx={getAccordionBGColor(familyDetails.maternal_grand_mother_info_spouse.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Maternal Grand Mother's Information Spouse</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="maternal_grand_mother_info_spouse"
                    parentDetails={familyDetails.maternal_grand_mother_info_spouse}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Maternal Grand Fathers's Information Spouse */}
            <Accordion sx={getAccordionBGColor(familyDetails.maternal_grand_father_info_spouse.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Maternal Grand Fathers's Information Spouse</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="maternal_grand_father_info_spouse"
                    parentDetails={familyDetails.maternal_grand_father_info_spouse}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Father In Law Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.father_in_law_info.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Father In Law Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="father_in_law_info"
                    parentDetails={familyDetails.father_in_law_info}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Mother In Law Information */}
            <Accordion sx={getAccordionBGColor(familyDetails.mother_in_law_info.name)}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Mother In Law Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  <GrandParentDetailsForm
                    parentType="mother_in_law_info"
                    parentDetails={familyDetails.mother_in_law_info}
                    onChange={handleInputChange}
                  />
                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

            {/* Accompanying Details */}
            <Accordion sx={{ marginBottom: "10px" }}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={accordionSummaryStyle}
              >
                <GroupIcon sx={groupIconStyle} />
                <Typography component="span" sx={typographyStyle} >Accompanying Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="p-2">
                  {/* Accompanying Child */}
                  <AccompanyingDetails type="child" data={familyDetails.accompanying_child} handleInputChange={handleInputChange} />

                  {/* Accompanying Spouse */}
                  <AccompanyingDetails type="spouse" data={familyDetails.accompanying_spouse} handleInputChange={handleInputChange} />

                  {/* Relatives Details */}
                  <RelativesDetails handleInputChange={handleInputChange} data={familyDetails.relatives_info} />

                </Row>
                <SaveButton />
              </AccordionDetails>
            </Accordion>

          </Row>
        </>
      )}
    </>
  );
};

export default FamilyDetails;
