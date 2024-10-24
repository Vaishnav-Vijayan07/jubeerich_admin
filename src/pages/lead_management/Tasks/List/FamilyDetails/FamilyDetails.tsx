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

interface Props {
  studentId: string | number;
}

const initialFamilyDetailsState = {
  father: {
    name: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
  },
  mother: {
    name: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
    nature_of_occupation: "",
  },
  number_of_siblings: 0,
  siblings_info: [
    {
      name: "",
      occupation: "",
      annual_income: 0,
      income_tax_payer: true,
    },
  ],
  number_of_children: 0,
  children_info: [
    {
      name: "",
      gender: "",
      age: 0,
    },
  ],
  accompanying_child: false,
  accompanying_spouse: false,
  spouse: {
    name: "",
    occupation: "",
    annual_income: 0,
    organization: "",
    income_tax_payer: true,
  },
  relatives_info: "",
};

const FamilyDetails = ({ studentId }: Props) => {
  const [initialLoading, setInitialLoading] = useState(false);

  const [familyDetails, dispatch] = useReducer(
    familyDetailsReducer,
    initialFamilyDetailsState
  );

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
      dispatch({
        type: "UPDATE_SIBLING",
        index: parseInt(index),
        field: siblingField,
        value: type === "checkbox" ? checked : value,
      });
    } else if (relation === "children") {
      console.log("here");

      const [_, index, childField] = name.split(".");
      dispatch({
        type: "UPDATE_CHILD",
        index: parseInt(index),
        field: childField,
        value: type === "checkbox" ? checked : value,
      });
    } else if (
      relation === "mother" ||
      relation === "father" ||
      relation === "spouse"
    ) {
      dispatch({
        type: "UPDATE_PARENT",
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
      let typeToDispatch: any =
        name === "number_of_children"
          ? "UPDATE_NUMBER_OF_CHILDREN"
          : "UPDATE_NUMBER_OF_SIBLINGS";

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

  const handleRemoveItem = (
    type: "children_info" | "siblings_info",
    index: number
  ) => {
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
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save",
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

  // if (initialLoading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "100%", left: "45%" }}
  //     />
  //   );
  // }

  return (
    <>
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i>Family Details
        </h5>
      </Row>

      {/* Father's Information */}
      <ParentDetailsForm
        parentType="father"
        parentDetails={familyDetails.father}
        onChange={handleInputChange}
      />

      {/* Mother's Information */}
      <ParentDetailsForm
        parentType="mother"
        parentDetails={familyDetails.mother}
        onChange={handleInputChange}
      />

      {/* Spouse Information */}
      <ParentDetailsForm
        parentType="spouse"
        parentDetails={familyDetails.spouse}
        onChange={handleInputChange}
      />

      {/* Siblings Information */}
      <SiblingsDetails
        handleInputChange={handleInputChange}
        handleRemoveItem={handleRemoveItem}
        handleAddSibling={handleAddSibling}
        siblings={familyDetails?.siblings_info}
        number_of_siblings={familyDetails?.number_of_siblings}
      />

      {/* Children Information */}
      <ChildrenDetails
        handleInputChange={handleInputChange}
        handleRemoveItem={handleRemoveItem}
        handleAddChildren={handleAddChildren}
        children={familyDetails?.children_info}
        number_of_children={familyDetails?.number_of_children}
        handleDropDowns={handleDropDowns}
      />
      {/* Accompanying Details */}
      <Row className="mt-3">
        <Row>
          <h5 className="mb-4 text-uppercase">Accompanying Details</h5>
        </Row>
      </Row>
      {/* Accompanying Child */}
      <AccompanyingDetails
        type="child"
        data={familyDetails.accompanying_child}
        handleInputChange={handleInputChange}
      />

      {/* Accompanying Spouse */}
      <AccompanyingDetails
        type="spouse"
        data={familyDetails.accompanying_spouse}
        handleInputChange={handleInputChange}
      />

      {/* Relatives Details */}
      <RelativesDetails
        handleInputChange={handleInputChange}
        data={familyDetails.relatives_info}
      />

      <Row>
        <Button
          variant="primary"
          className="mt-4"
          type="submit"
          onClick={saveFamilyDetails}
        >
          Save
        </Button>
      </Row>
    </>
  );
};

export default FamilyDetails;
