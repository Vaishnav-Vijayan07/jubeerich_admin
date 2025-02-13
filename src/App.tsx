import React, { useEffect } from "react";

import AllRoutes from "./routes/Routes";

// For Default import Default.scss
import "./assets/scss/Default.scss";

// Other
import "./assets/scss/Landing.scss";
import "./assets/scss/Icons.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchIdFromSessionStorage, getBranches, getHistory, getStatus } from "./redux/actions";
import { RootState } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const App = () => {
  const dispatch = useDispatch();
  let userInfo = sessionStorage.getItem("jb_user");


  const branch_id = useSelector((state: RootState) => state?.Branches?.branch_id);

  const Branch = useSelector((state: RootState) => state?.Branches?.branches?.data);

  useEffect(() => {
    if (userInfo) {
      // dispatch(getBranches());
      // dispatch(getHistory());
      // dispatch(getStatus());
    }
  }, []);

  // useEffect(() => {
  //   //Set branch id to session storage on initial render if there is no branch_id is in session storage
  //   if (Branch) {
  //     if (!branch_id) {
  //       sessionStorage.setItem("branch_id", Branch[0]?.id);
  //     }
  //   }
  //   dispatch(fetchBranchIdFromSessionStorage());
  // }, [Branch]);

  return (
    <>
      <React.Fragment>
        <ToastContainer />
        <AllRoutes />
      </React.Fragment>
    </>
  );
};

export default App;
