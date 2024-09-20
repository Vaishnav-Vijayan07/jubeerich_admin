import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getSource } from "../../redux/sources/actions";
import {
  getAdminUsers,
  getCategory,
  getChannel,
  getLead,
  getLeadsTL,
  getStatus,
} from "../../redux/actions";
import {
  AUTH_SESSION_KEY,
} from "../../constants";
import { getCountry } from "../../redux/country/actions";
import { getOfficeTypeData } from "../../redux/OfficeType/actions";
import BasicInputElements from "./BasicInputElements";
import axios from "axios";
import { getRegion } from "../../redux/regions/actions";
import { getFranchise } from "../../redux/franchise/actions";
import useDropdownData from "../../hooks/useDropdownDatas";

const Leads = () => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const [counsellors, setCounsellors] = useState([])
  const { loading: dropDownLoading, dropdownData } = useDropdownData("");

  let userRole: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
  }
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    state,
    cres,
    error,
    loading,
    initialLoading,
    country,
    categories,
    status,
    users,
    region,
    franchisees
  } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    state: state.Leads.leads,
    cres: state.Leads.allCres,
    error: state.Leads.error,
    loading: state.Leads.loading,
    initialLoading: state.Leads.initialloading,
    country: state.Country.countries,
    categories: state.Category.category.data,
    status: state.Status.status.data,
    users: state.Users.adminUsers,
    region: state.Region.regions,
    franchisees: state.Franchise.franchiseUsers,
  }));

  useEffect(() => {
    // dispatch(getCountry());
    // dispatch(getAdminUsers());
    // dispatch(getCategory());
    // dispatch(getChannel());
    // dispatch(getSource());
    // dispatch(getStatus());
    // dispatch(getOfficeTypeData());
    // dispatch(getRegion());
    // dispatch(getFranchise());
    // fetchAllCounsellors()
  }, []);

  console.log('Region From Lead', region);
  console.log('Type From Lead', categories);
  

  useEffect(() => {
    console.log("here");
    
    if (userRole == 4) {
      dispatch(getLeadsTL());
    } else {
      dispatch(getLead());
    }
  }, [userRole])

  const fetchAllCounsellors = () => {
    axios.get("/get_all_counsellors").then((res) => {
      const counsellorData = res?.data?.data?.map((item: any) => {
        return (
          {
            label: item?.name,
            value: item?.id
          }
        )
      })
      setCounsellors(counsellorData)
    }).catch((err) => {
      console.log(err)
    })
  }

  const franchiseeData = useMemo(() => {
    if (!franchisees) return [];
    return franchisees?.map((item: any) => ({
      value: item.id.toString(),
      label: item.name,
    }));
  }, [franchisees]);

  console.log("franchiseeData ==>", franchiseeData);
  

  if (initialLoading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/leads" },
          { label: "Leads", path: "/master/leads", active: true },
        ]}
        title={"Leads"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            country={dropdownData.countries || []}
            source={dropdownData.sources|| []}
            categories={dropdownData.leadTypes || []}
            user={user || null}
            cres={cres || []}
            channels={dropdownData.channels || []}
            office={dropdownData.officeTypes || []}
            error={error}
            loading={loading}
            status={dropdownData.statuses || []}
            counsellors={counsellors || []}
            userData={dropdownData.adminUsers || []}
            region={dropdownData.regions}
            regionData={dropdownData.regions || []}
            franchisees={franchiseeData}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Leads;
