import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  getBranchCounsellors,
  getLead,
  getLeadsByCounsellorTL,
  getLeadsRegionalManager,
  getLeadsTL,
} from "../../redux/actions";
import {
  AUTH_SESSION_KEY,
  counsellor_tl_id,
  cre_tl_id,
  regional_manager_id,
} from "../../constants";
import BasicInputElements from "./BasicInputElements";
import axios from "axios";
import useDropdownData from "../../hooks/useDropdownDatas";

const RegionalManagerAssignedLeads = () => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const [counsellors, setCounsellors] = useState([]);
  const [branchForManager, setBranchForManager] = useState([]);
  const { loading: dropDownLoading, dropdownData } = useDropdownData("");

  let userRole: any;
  let userBranchId: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
    userBranchId = JSON.parse(userInfo)?.branch_id;
  }
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    state,
    cres,
    error,
    loading,
    initialLoading,
    categories,
    region,
    franchisees,
    branchCounsellor,
  } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    state: state.Leads.leads,
    cres: state.Leads.allCres,
    error: state.Leads.error,
    loading: state.Leads.loading,
    initialLoading: state.Leads.initialloading,
    categories: state.Category.category.data,
    region: state.Region.regions,
    franchisees: state.Franchise.franchiseUsers,
    branchCounsellor: state.Users?.branchCounsellor,
  }));

  console.log("CRES", cres);

  useEffect(() => {
    fetchAllCounsellors();
    dispatch(getBranchCounsellors(userBranchId));
  }, []);

  useEffect(() => {
    dispatch(getLeadsRegionalManager());
    fetchBranches();
  }, [userRole]);

  const fetchAllCounsellors = useCallback(() => {
    axios
      .get("/get_all_counsellors")
      .then((res) => {
        const counsellorData = res?.data?.data?.map((item: any) => {
          return {
            label: item?.name,
            value: item?.id,
          };
        });
        setCounsellors(counsellorData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const resposne = await axios.get("list_manager_branches");
      setBranchForManager(resposne.data.data);
    } catch (err) {
      console.log("err", err);
    }
  }, []);

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
          { label: "Master", path: "" },
          { label: "Assigned Leads", path: "", active: true },
        ]}
        title={"Assigned Leads"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            country={dropdownData.countries || []}
            source={dropdownData.sources || []}
            leadTypes={dropdownData.leadTypes || []}
            user={user || null}
            cres={dropdownData.cres || []}
            channels={dropdownData.channels || []}
            office={dropdownData.officeTypes || []}
            error={error}
            loading={loading}
            status={dropdownData.statuses || []}
            counsellors={counsellors || []}
            userData={dropdownData.adminUsers || []}
            region={dropdownData.regions}
            regionData={dropdownData.regions || []}
            franchisees={dropdownData.franchises || []}
            branchForManager={branchForManager}
            branchCounsellors={branchCounsellor || []}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default RegionalManagerAssignedLeads;
