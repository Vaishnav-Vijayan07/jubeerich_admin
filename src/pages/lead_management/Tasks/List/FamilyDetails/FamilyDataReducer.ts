interface FamilyDetailsState {
  father: ParentDetails;
  mother: ParentDetails;
  spouse: Spouse;
  paternal_grand_father_info: GrandParentDetails;
  paternal_grand_mother_info: GrandParentDetails;
  maternal_grand_father_info: GrandParentDetails;
  maternal_grand_mother_info: GrandParentDetails;
  paternal_grand_father_info_spouse: GrandParentDetails;
  paternal_grand_mother_info_spouse: GrandParentDetails;
  maternal_grand_father_info_spouse: GrandParentDetails;
  maternal_grand_mother_info_spouse: GrandParentDetails;
  father_in_law_info: GrandParentDetails;
  mother_in_law_info: GrandParentDetails;
  number_of_siblings: number;
  siblings_info: SiblingDetails[];
  number_of_children: number;
  children_info: ChildDetails[];
  accompanying_child: boolean;
  accompanying_spouse: boolean;
  relatives_info: string;
}

interface ParentDetails {
  name: string;
  occupation: string;
  annual_income: number;
  organization: string;
  income_tax_payer: boolean;
  nature_of_occupation: string;
}
interface GrandParentDetails {
  name: string;
  occupation: string;
  annual_income: number;
  organization: string;
  income_tax_payer: boolean;
  nature_of_occupation: string;
}
interface Spouse {
  name: string;
  occupation: string;
  annual_income: number;
  organization: string;
  income_tax_payer: boolean;
}

interface SiblingDetails {
  // name: string;
  // occupation: string;
  // annual_income: number;
  // income_tax_payer: boolean;
  name: string,
  age: string,
  dob: string,
  occupation: string,
  annual_income: number,
  organization: string,
  income_tax_payer: boolean,
  nature_of_occupation: string,
  location: string,
  designation: string,
  duration: number,
  current_status: string,
  monthly_salary: number,
  mode_of_payment: string,
  current_income_source: string,
}

interface ChildDetails {
  // name: string;
  // gender: string;
  // age: number;
  name: string,
  gender: string,
  age: number,
  dob: string
}

type FamilyDetailsAction =
  | { type: "SET_BACKEND_DATA"; data: FamilyDetailsState }
  | {
      type: "UPDATE_PARENT";
      parentType: "father" | "mother" | "spouse";
      field: string;
      value: any;
    }
  | {
      type: "UPDATE_GRAND_PARENT";
      parentType: "paternal_grand_mother_info" | "paternal_grand_father_info" | "maternal_grand_mother_info" | "maternal_grand_father_info" | "paternal_grand_mother_info_spouse" | "paternal_grand_father_info_spouse" | "maternal_grand_mother_info_spouse" | "maternal_grand_father_info_spouse" | "father_in_law_info" | "mother_in_law_info" ;
      field: string;
      value: any;
    }
  | {
      type: "UPDATE_SIBLING";
      index: number;
      field: string;
      value: any;
    }
  | {
      type: "ADD_SIBLING";
    }
  | {
      type: "REMOVE_SIBLING";
      index: number;
    }
  | {
      type: "UPDATE_CHILD";
      index: number;
      field: string;
      value: any;
    }
  | {
      type: "ADD_CHILD";
    }
  | {
      type: "REMOVE_CHILD";
      index: number;
    }
  | {
      type: "UPDATE_ACCOMPANYING";
      accompanyingType: "child" | "spouse";
      value: boolean;
    }
  | {
      type: "UPDATE_RELATIVES";
      value: string;
    }
  | {
      type: "UPDATE_NUMBER_OF_SIBLINGS";
      value: number;
    }
  | {
      type: "UPDATE_NUMBER_OF_CHILDREN";
      value: number;
    };

export const familyDetailsReducer = (
  state: FamilyDetailsState,
  action: FamilyDetailsAction
): FamilyDetailsState => {
  console.log(action);
  switch (action.type) {
    case "SET_BACKEND_DATA":
      return { ...action.data };

    case "UPDATE_PARENT":
      return {
        ...state,
        [action.parentType]: {
          ...state[action.parentType],
          [action.field]: action.value,
        },
      };
    case "UPDATE_GRAND_PARENT":
      return {
        ...state,
        [action.parentType]: {
          ...state[action.parentType],
          [action.field]: action.value,
        },
      };

    case "UPDATE_SIBLING":
      return {
        ...state,
        siblings_info: state.siblings_info.map((sibling, index) =>
          index === action.index
            ? { ...sibling, [action.field]: action.value }
            : sibling
        ),
      };

    case "ADD_SIBLING":
      if (state.siblings_info.length >= state.number_of_siblings) {
        return state; // Prevent adding more siblings than specified
      }
      return {
        ...state,
        siblings_info: [
          ...state.siblings_info,
          {
            // name: "",
            // occupation: "",
            // annual_income: 0,
            // income_tax_payer: true,
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
      };

    case "REMOVE_SIBLING":
      return {
        ...state,
        siblings_info: state.siblings_info.filter(
          (_, index) => index !== action.index
        ),
        number_of_siblings: state.siblings_info.length - 1,
      };

    case "UPDATE_CHILD":
      return {
        ...state,
        children_info: state.children_info.map((child, index) =>
          index === action.index
            ? { ...child, [action.field]: action.value }
            : child
        ),
      };

    case "ADD_CHILD":
      if (state.children_info.length >= state.number_of_children) {
        return state; // Prevent adding more children than specified
      }
      return {
        ...state,
        children_info: [
          ...state.children_info,
          // { name: "", gender: "", age: 0 },
          {
            name: "",
            gender: "",
            age: 0,
            dob: ""
          }
        ],
      };

    case "REMOVE_CHILD":
      return {
        ...state,
        children_info: state.children_info.filter(
          (_, index) => index !== action.index
        ),
        number_of_children: state.children_info.length - 1,
      };

    case "UPDATE_ACCOMPANYING":
      return {
        ...state,
        [`accompanying_${action.accompanyingType}`]: action.value,
      };
    case "UPDATE_NUMBER_OF_SIBLINGS":
      return {
        ...state,
        number_of_siblings: action.value,
      };
    case "UPDATE_NUMBER_OF_CHILDREN":
      return {
        ...state,
        number_of_children: action.value,
      };

    case "UPDATE_RELATIVES":
      return {
        ...state,
        relatives_info: action.value,
      };

    default:
      return state;
  }
};
