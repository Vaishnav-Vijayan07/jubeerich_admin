import axios from "axios";
import { useEffect, useState } from "react";
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
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/dropdown?types=${type}`);
        if (data.status) {
          setDropdownData(data.data); // Update state with fetched data
        } else {
          // Handle case where status is false
          showErrorAlert("Failed to fetch dropdown data");
        }
      } catch (error) {
        console.log(error);

        showErrorAlert(error || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, dropdownData };
};

export default useDropdownData;