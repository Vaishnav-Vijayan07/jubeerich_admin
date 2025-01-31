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
import { useSearchParams } from "react-router-dom";
import CustomLeadFilters from "../../components/CustomLeadFilters";

const Leads = () => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort_by") || "created_at");
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get("sort_order") || "asc");

  const [selectedOffice, setSelectedOffice] = useState<any>("all");
  const [selectedCountry, setSelectedCountry] = useState<any>("all");
  const [selectedSource, setSelectedSource] = useState<any>("all");

  const [selectedCounsellors, setSelectedCounsellors] = useState("all");
  const [branchForManager, setBranchForManager] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { loading: dropDownLoading, dropdownData } = useDropdownData("");
  const { currentPage, setCurrentPage, currentLimit, setCurrentLimit } = usePagination();

  const handlePageChange = useCallback((value: any) => {
    console.log(value);

    setCurrentPage(value);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    switch (name) {
      case "office":
        setSelectedOffice(value);
        break;
      case "country":
        setSelectedCountry(value);
        break;
      case "source":
        setSelectedSource(value);
        break;
      case "sort_by":
        setSortBy(value);
        break;
      case "sort_order":
        setSortOrder(value);
        break;
      case "counsellor":
        setSelectedCounsellors(value);
        break;
      default:
        break;
    }
  };

  const handleSortChange = (type: string, value: string) => {
    console.log(type);
    console.log(value);

    if (type == "order") {
      setSortBy(value);
    } else {
      setSortOrder(value);
    }
  };

  const applySort = () => {
    if (userRole == cre_tl_id) {
      dispatch(
        getLeadsTL(
          currentPage,
          currentLimit,
          searchValue == "" ? undefined : searchValue,
          sortBy,
          sortOrder,
          selectedCountry == "all" ? undefined : selectedCountry,
          selectedOffice == "all" ? undefined : selectedOffice,
          selectedSource == "all" ? undefined : selectedSource,
          
        )
      );
    } else {
      if (userRole) {
        dispatch(
          getLead(
            currentPage,
            currentLimit,
            searchValue == "" ? undefined : searchValue,
            sortBy,
            sortOrder,
            selectedCountry == "all" ? undefined : selectedCountry,
            selectedOffice == "all" ? undefined : selectedOffice,
            selectedSource == "all" ? undefined : selectedSource,
            selectedCounsellors == "all" ? undefined : selectedCounsellors
          )
        );
      }
    }
  };

  const resetSort = () => {
    if (userRole == cre_tl_id) {
      dispatch(
        getLeadsTL(currentPage, currentLimit, searchValue == "" ? undefined : searchValue, "created_at", "asc")
      );
    } else {
      if (userRole) {
        dispatch(
          getLead(currentPage, currentLimit, searchValue == "" ? undefined : searchValue, "created_at", "asc")
        );
      }
    }
  };

  const resetFilters = () => {
    setSelectedOffice("all");
    setSelectedCountry("all");
    setSelectedSource("all");
    setSelectedCounsellors("all");
    setSortBy("created_at");
    setSortOrder("asc");
    resetSort();
  };

  const handleLimitChange = useCallback((value: number) => {
    setCurrentLimit(value);
    setCurrentPage(1);
  }, []);

  const handleSearch = (value: any) => {
    setSearchValue(value);
    setCurrentPage(1);
    setCurrentLimit(20);
    if (userRole == cre_tl_id) {
      dispatch(
        getLeadsTL(
          1,
          20,
          value,
          sortBy,
          sortOrder,
          selectedCountry == "all" ? undefined : selectedCountry,
          selectedOffice == "all" ? undefined : selectedOffice,
          selectedSource == "all" ? undefined : selectedSource,
        )
      );
    } else {
      if (userRole) {
        dispatch(
          getLead(
            1,
            20,
            value,
            sortBy,
            sortOrder,
            selectedCountry == "all" ? undefined : selectedCountry,
            selectedOffice == "all" ? undefined : selectedOffice,
            selectedSource == "all" ? undefined : selectedSource,
            selectedCounsellors == "all" ? undefined : selectedCounsellors
          )
        );
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
  const { user, state, error, loading, initialLoading, branchCounsellor, limit, totalPages, totalCount, isSortApplied } = useSelector(
    (state: RootState) => ({
      user: state.Auth.user,
      state: state.Leads.leads,
      totalPages: state.Leads.totalPages,
      limit: state.Leads.limit,
      totalCount: state.Leads.totalCount,
      isSortApplied: state.Leads.isSortApplied,
      error: state.Leads.error,
      loading: state.Leads.loading,
      initialLoading: state.Leads.initialloading,
      branchCounsellor: state.Users?.branchCounsellor,
    })
  );

  useEffect(() => {
    const params: any = {
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    setSearchParams(params);
  }, [sortBy, sortOrder, setSearchParams]);

  // useEffect(() => {
  //   fetchAllCounsellors();
  //   if (userBranchId) dispatch(getBranchCounsellors(userBranchId));
  // }, [userBranchId]);

  useEffect(() => {
    if (userRole == cre_tl_id) {
      dispatch(
        getLeadsTL(
          currentPage,
          currentLimit,
          searchValue == "" ? undefined : searchValue,
          sortBy,
          sortOrder,
          selectedCountry == "all" ? undefined : selectedCountry,
          selectedOffice == "all" ? undefined : selectedOffice,
          selectedSource == "all" ? undefined : selectedSource
        )
      );
    } else {
      console.log(userRole);
      
      if (userRole) {
        dispatch(
          getLead(
            currentPage,
            currentLimit,
            searchValue == "" ? undefined : searchValue,
            sortBy,
            sortOrder,
            selectedCountry == "all" ? undefined : selectedCountry,
            selectedOffice == "all" ? undefined : selectedOffice,
            selectedSource == "all" ? undefined : selectedSource
          )
        );
      }
    }

    if (userRole == regional_manager_id) {
      fetchBranches();
    }

    console.count("loading count");
  }, [userRole, currentPage, currentLimit]);

  // const fetchAllCounsellors = useCallback(() => {
  //   axios
  //     .get("/get_all_counsellors")
  //     .then((res) => {
  //       const counsellorData = res?.data?.data?.map((item: any) => {
  //         return {
  //           label: item?.name,
  //           value: item?.id,
  //         };
  //       });
  //       setCounsellors(counsellorData);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

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
          <CustomLeadFilters
            countries={dropdownData?.countries}
            source={dropdownData?.sources}
            offices={dropdownData?.officeTypes}
            consellors={dropdownData?.counsellors}
            selectedCountry={selectedCountry}
            selectedOffice={selectedOffice}
            selectedSource={selectedSource}
            selectedCounsellors={selectedCounsellors}
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
            leadTypes={dropdownData.leadTypes || []}
            user={user || null}
            cres={dropdownData.cres || []}
            channels={dropdownData.channels || []}
            office={dropdownData.officeTypes || []}
            error={error}
            loading={loading}
            status={dropdownData.statuses || []}
            counsellors={dropdownData?.counsellors || []}
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
            handleSortChange={handleSortChange}
            applySort={applySort}
            sortOrder={sortOrder}
            sortBy={sortBy}
            handleFilterChange={handleFilterChange}
            selectedCountry={selectedCountry}
            selectedSource={selectedSource}
            selectedOffice={selectedOffice}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Leads;
