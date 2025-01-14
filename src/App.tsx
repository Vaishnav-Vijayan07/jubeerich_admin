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
