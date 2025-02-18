// import axios from "axios";
// import { useEffect, useState } from "react";
// import { branch_counsellor_id, showErrorAlert } from "../constants";

// const useDropdownData = (type: string) => {
//   const [loading, setLoading] = useState(false);
//   const [dropdownData, setDropdownData] = useState({
//     universities: [],
//     countries: [],
//     courses: [],
//     courseTypes: [],
//     streams: [],
//     campuses: [],
//     sources: [],
//     leadTypes: [],
//     channels: [],
//     officeTypes: [],
//     regions: [],
//     adminUsers: [],
//     statuses: [],
//     cres: [],
//     franchises: [],
//     branchCounsellors: [],
//     maritalStatus: [],
//     flags:[],
//     counsellors:[],
//     application_teams:[],
//     visa_members: []
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const { data } = await axios.get(`/dropdown?types=${type}`);
//         if (data.status) {
//           console.log("dropdown data ==>", data.data);

//           setDropdownData(data.data); // Update state with fetched data
//         } else {
//           // Handle case where status is false
//           showErrorAlert("Failed to fetch dropdown data");
//         }
//       } catch (error) {
//         console.log(error);

//         showErrorAlert(error || "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { loading, dropdownData };
// };

// export default useDropdownData;


import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { showErrorAlert } from "../constants";

const useDropdownData = (type: string) => {
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    universities: [],
    countries: [],
    courses: [],
    courseTypes: [],
    streams: [],
    campuses: [],
    sources: [],
    leadTypes: [],
    channels: [],
    officeTypes: [],
    regions: [],
    adminUsers: [],
    statuses: [],
    cres: [],
    franchises: [],
    branchCounsellors: [],
    maritalStatus: [],
    flags: [],
    counsellors: [],
    application_teams: [],
    visa_members: []
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/dropdown?types=${type}`);
      if (data.status) {
        console.log("Dropdown data ==>", data.data);
        setDropdownData(data.data);
      } else {
        showErrorAlert("Failed to fetch dropdown data");
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      showErrorAlert(error || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loading, dropdownData, refetch: fetchData };
};

export default useDropdownData;
