import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getBranchCounsellors, getLead, getLeadsByCounsellorTL, getLeadsRegionalManager, getLeadsTL } from "../../redux/actions";
import { AUTH_SESSION_KEY, counsellor_tl_id, cre_tl_id, regional_manager_id } from "../../constants";
import BasicInputElements from "./BasicInputElements";
import axios from "axios";
import useDropdownData from "../../hooks/useDropdownDatas";
import { usePagination } from "../../hooks/usePagination";
import { useSearchParams } from "react-router-dom";
import CustomLeadFilters from "../../components/CustomLeadFilters";

const RegionalManagerAssignedLeads = () => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const { currentPage, setCurrentPage, currentLimit, setCurrentLimit } = usePagination();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading: dropDownLoading, dropdownData } = useDropdownData("");
  const dispatch = useDispatch<AppDispatch>();
  const [branchForManager, setBranchForManager] = useState([]);
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort_by") || "created_at");
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get("sort_order") || "desc");

  const [selectedCountry, setSelectedCountry] = useState<any>("all");
  const [selectedBranch, setSelectedBranch] = useState<any>("all");
  const [selectedSource, setSelectedSource] = useState<any>("all");

  const [searchValue, setSearchValue] = useState("");

  let userRole: any;
  let userBranchId: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
    userBranchId = JSON.parse(userInfo)?.branch_id;
  }
  const { user, state, error, loading, limit, totalPages, totalCount } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    state: state.Leads.leads,
    cres: state.Leads.allCres,
    error: state.Leads.error,
    loading: state.Leads.loading,
    initialLoading: state.Leads.initialloading,
    totalPages: state.Leads.totalPages,
    limit: state.Leads.limit,
    totalCount: state.Leads.totalCount,
  }));

  const handlePageChange = useCallback((value: any) => {
    console.log(value);

    setCurrentPage(value);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    switch (name) {
      case "country":
        setSelectedCountry(value);
        break;
      case "source":
        setSelectedSource(value);
        break;
      case "branches":
        setSelectedBranch(value);
        break;
      case "sort_by":
        setSortBy(value);
        break;
      case "sort_order":
        setSortOrder(value);
        break;
      default:
        break;
    }
  };

  const applySort = () => {
    dispatch(
      getLeadsRegionalManager(
        currentPage,
        currentLimit,
        searchValue,
        sortBy,
        sortOrder,
        selectedCountry == "all" ? undefined : selectedCountry,
        selectedSource == "all" ? undefined : selectedSource,
        selectedBranch == "all" ? undefined : selectedBranch
      )
    );
  };

  const resetSort = () => {
    dispatch(getLeadsRegionalManager(currentPage, 20, searchValue, "created_at", "asc"));
  };

  const resetFilters = () => {
    setSelectedCountry("all");
    setSelectedSource("all");
    setSelectedBranch("all");
    setSortBy("created_at");
    setSortOrder("asc");
    resetSort();
  };

  const handleLimitChange = useCallback((value: number) => {
    setCurrentLimit(value);
    setCurrentPage(1);
    dispatch(
      getLeadsRegionalManager(
        1,
        20,
        searchValue == "" ? undefined : searchValue,
        sortBy,
        sortOrder,
        selectedCountry == "all" ? undefined : selectedCountry,
        selectedSource == "all" ? undefined : selectedSource,
        selectedBranch == "all" ? undefined : selectedBranch
      )
    );
  }, []);

  const handleSearch = (value: any) => {
    setSearchValue(value);
    setCurrentPage(1);
    setCurrentLimit(20);
    dispatch(
      getLeadsRegionalManager(
        1,
        20,
        value,
        sortBy,
        sortOrder,
        selectedCountry == "all" ? undefined : selectedCountry,
        selectedSource == "all" ? undefined : selectedSource,
        selectedBranch == "all" ? undefined : selectedBranch
      )
    );
  };

  useEffect(() => {
    const params: any = {
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    setSearchParams(params);
  }, [sortBy, sortOrder, setSearchParams]);

  useEffect(() => {
    dispatch(
      getLeadsRegionalManager(
        currentPage,
        currentLimit,
        searchValue == "" ? undefined : searchValue,
        sortBy,
        sortOrder,
        selectedCountry == "all" ? undefined : selectedCountry,
        selectedSource == "all" ? undefined : selectedSource,
        selectedBranch == "all" ? undefined : selectedBranch
      )
    );
    fetchBranches();
  }, [userRole]);

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
          // { label: "Master", path: "" },
          { label: "Assigned Leads", path: "", active: true },
        ]}
        title={"Assigned Leads"}
      />
      <Row>
        <Col>
          <CustomLeadFilters
            countries={dropdownData?.countries}
            source={dropdownData?.sources}
            consellors={dropdownData?.counsellors}
            branches={branchForManager}
            selectedCountry={selectedCountry}
            selectedSource={selectedSource}
            selectedBranch={selectedBranch}
            onFilterChange={handleFilterChange}
            selectedSortBy={sortBy}
            selectedSortOrder={sortOrder}
            onApplySort={applySort}
            onClear={resetFilters}
            userRole={userRole}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            country={dropdownData.countries || []}
            source={dropdownData.sources || []}
            user={user || null}
            cres={dropdownData.cres || []}
            office={dropdownData.officeTypes || []}
            error={error}
            loading={loading}
            status={dropdownData.statuses || []}
            userData={dropdownData.adminUsers || []}
            branchForManager={branchForManager}
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
export default RegionalManagerAssignedLeads;
