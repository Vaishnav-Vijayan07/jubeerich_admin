import jwtDecode from "jwt-decode";
import axios, { AxiosRequestConfig } from "axios";

import config from "../../config";
import { baseUrl } from "../../constants";

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = `${baseUrl}/api/`;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let message;

    if (error && error.response && error.response.status === 404) {
      // Redirect to a not-found page
      // window.location.href = '/not-found';
    } else if (error && error.response && error.response.status === 403) {
      // Redirect to an access-denied page
      window.location.href = "/unauthorized";
    } else {
      switch (error?.response?.status) {
        case 401:
          message = "Invalid credentials";
          break;
        case 403:
          message = "Access Forbidden";
          break;
        case 404:
          message = "Sorry! The data you are looking for could not be found";
          break;
        default: {
          // Check if the error response contains a "message" field
          if (error.response && error.response.data && error.response.data.message) {
            message = error.response.data.message;
          } else if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
            // Check if the error response contains an "errors" array (validation errors)
            const validationErrors = error.response.data.errors;
            message = validationErrors.map((error: any) => error.msg).join(", ");
          } else {
            message = "An error occurred";
          }
        }
      }

      // Reject the Promise with the error message
      return Promise.reject(message);
    }
  }
);

// to store the key for the user session in the sessionStorage
const AUTH_SESSION_KEY = "jb_user";

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: string | null) => {
  if (token) axios.defaults.headers.common["X-Access-Token"] = token;
  else delete axios.defaults.headers.common["X-Access-Token"];
};

const getUserFromCookie = () => {
  const user = sessionStorage.getItem(AUTH_SESSION_KEY);
  return user ? (typeof user == "object" ? user : JSON.parse(user)) : null;
};

class APICore {
  /**
   * Fetches data from given url
   */
  get = (url: string, params: any) => {
    let response;
    if (params) {
      var queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }
    return response;
  };

  getFile = (url: string, params: any) => {
    let response;
    if (params) {
      var queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, { responseType: "blob" });
    } else {
      response = axios.get(`${url}`, { responseType: "blob" });
    }
    return response;
  };

  getMultiple = (urls: string, params: any) => {
    const reqs = [];
    let queryString = "";
    if (params) {
      queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
    }

    for (const url of urls) {
      reqs.push(axios.get(`${url}?${queryString}`));
    }
    return axios.all(reqs);
  };

  /**
   * post given data to url
   */
  create = (url: string, data: any) => {
    console.log("dataaaaaaa", data);

    return axios.post(url, data);
  };

  /**
   * Updates patch data
   */
  updatePatch = (url: string, data: any) => {
    return axios.patch(url, data);
  };

  /**
   * Updates data
   */
  update = (url: string, data: any) => {
    return axios.put(url, data);
  };

  /**
   * Deletes data
   */
  delete = (url: string, data: any) => {
    return axios.delete(url, { data });
  };

  /**
   * post given data to url with file
   */
  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

  createWithMultipleFile = (url: string, data: any, files:any) => {
    const formData = new FormData();

    files.forEach((file: any) => {
        formData.append(`exam_documents`, file)
    });

    for (const k in data) {  
      formData.append(k, data[k]);
    }

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

  /**
   * post given data to url with file
   */
  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.patch(url, formData, config);
  };

  updateWithMultipleFile = (url: string, data: any, files: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    files.forEach((file: any) => {
      formData.append(`exam_documents`, file)
    });

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.put(url, formData, config);
  };

  isUserAuthenticated = () => {
    const user = this.getLoggedInUser();

    if (!user) {
      return false;
    }
    const decoded: any = jwtDecode(user.token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      sessionStorage.removeItem("branch_id");
      return false;
    } else {
      return true;
    }
  };

  setLoggedInUser = (session: any) => {
    if (session) sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    else {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      sessionStorage.removeItem("branch_id");
    }
  };
  /**
   * Returns the logged in user
   */
  getLoggedInUser = () => {
    return getUserFromCookie();
  };

  setUserInSession = (modifiedUser: any) => {
    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (userInfo) {
      const { token, user } = JSON.parse(userInfo);
      this.setLoggedInUser({ token, ...user, ...modifiedUser });
    }
  };
}

/*
Check if token available in session
*/
let user = getUserFromCookie();
if (user) {
  const { token } = user;
  if (token) {
    setAuthorization(token);
  }
}

export { APICore, setAuthorization };
