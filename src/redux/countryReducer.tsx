import React, { createContext, useState, useContext } from "react";

// Create the context
const AppContext = createContext<any>(null);

// Create a provider component
export const AppProvider = ({ children }: any) => {
  const [selectedValues, setSelectedValues] = useState([
    {
      country_id: null,
      studyPreferenceId: null,
      country_name: "",
      values: [
        {
          universityId: "",
          campusId: "",
          courseTypeId: "",
          streamId: "",
          courseId: "",
          intakeYear: "",
          intakeMonth: "",
          estimatedBudget: "",
        },
      ],
    },
  ]);

  return (
    <AppContext.Provider value={{ selectedValues, setSelectedValues }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAppContext = () => {
  return useContext(AppContext);
};
