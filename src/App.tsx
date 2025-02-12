import React, { useEffect } from "react";

import AllRoutes from "./routes/Routes";

// For Default import Default.scss
import "./assets/scss/Default.scss";

// Other
import "./assets/scss/Landing.scss";
import "./assets/scss/Icons.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
  return (
    <>
      <React.Fragment>
        <DndProvider backend={HTML5Backend}>
          <ToastContainer />
          <AllRoutes />
        </DndProvider>
      </React.Fragment>
    </>
  );
};

export default App;
