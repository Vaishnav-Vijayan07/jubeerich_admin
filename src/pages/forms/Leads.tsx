import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getBranchCounsellors, getLead, getLeadsByCounsellorTL, getLeadsTL } from "../../redux/actions";
import { AUTH_SESSION_KEY, counsellor_tl_id, cre_tl_id, regional_manager_id } from "../../constants";
import BasicInputElements from "./BasicInputElements";
import axios from "axios";
import useDropdownData from "../../hooks/useDropdownDatas";
import { usePagination } from "../../hooks/usePagination";

const Leads = () => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const [counsellors, setCounsellors] = useState([]);
  const [branchForManager, setBranchForManager] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { loading: dropDownLoading, dropdownData } = useDropdownData("");
  const { currentPage, setCurrentPage, currentLimit, setCurrentLimit } = usePagination();

  const handlePageChange = useCallback((value: any) => {
    console.log(value);

    setCurrentPage(value);
  }, []);

  const handleLimitChange = useCallback((value: number) => {
    setCurrentLimit(value);
    setCurrentPage(1);
  }, []);

  const handleSearch = (value: any) => {
    setSearchValue(value);
    if (userRole == cre_tl_id) {
      dispatch(getLeadsTL(1, 20, value));
    } else {
      if (userRole) {
        dispatch(getLead(1, 20, value));
      }
    }
  };

  let userRole: any;
  let userBranchId: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
    userBranchId = JSON.parse(userInfo)?.branch_id;
  }
  const dispatch = useDispatch<AppDispatch>();
  const { user, state, error, loading, initialLoading, branchCounsellor, limit, totalPages, totalCount, isSearchApplied } = useSelector(
    (state: RootState) => ({
      user: state.Auth.user,
      state: state.Leads.leads,
      totalPages: state.Leads.totalPages,
      limit: state.Leads.limit,
      totalCount: state.Leads.totalCount,
      isSearchApplied: state.Leads.isSearchApplied,
      error: state.Leads.error,
      loading: state.Leads.loading,
      initialLoading: state.Leads.initialloading,
      branchCounsellor: state.Users?.branchCounsellor,
    })
  );

  useEffect(() => {
    fetchAllCounsellors();
    if (userBranchId) dispatch(getBranchCounsellors(userBranchId));
  }, [userBranchId]);

  useEffect(() => {
    if (userRole == cre_tl_id) {
      dispatch(getLeadsTL(currentPage, currentLimit, searchValue == "" ? undefined : searchValue));
    } else {
      if (userRole) {
        dispatch(getLead(currentPage, currentLimit, searchValue == "" ? undefined : searchValue));
      }
    }

    if (userRole == regional_manager_id) {
      fetchBranches();
    }

    console.count("loading count");
  }, [userRole, currentPage, currentLimit]);

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

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          // { label: "Master", path: "/leads/manage" },
          { label: "Leads", path: "/leads/manage", active: true },
        ]}
        title={"Leads"}
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
            flags={dropdownData.flags || []}
            initialLoading={initialLoading}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            limit={limit}
            totalCount={totalCount}
            currentLimit={currentLimit}
            handleLimitChange={handleLimitChange}
            handleSearch={handleSearch}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Leads;
