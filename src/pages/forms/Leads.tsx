import React, { useEffect, useMemo} from "react";
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

const Leads = () => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
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
    source,
    categories,
    // regions,
    channels,
    office,
    status
  } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    state: state.Leads.leads,
    cres: state.Leads.allCres,
    error: state.Leads.error,
    loading: state.Leads.loading,
    initialLoading: state.Leads.initialloading,
    country: state.Country.countries,
    source: state.Source.sources.data,
    categories: state.Category.category.data,
    channels: state.Channels.channels.data,
    office: state.OfficeTypes.officeTypes,
    status: state.Status.status.data,
  }));

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getCategory());
    dispatch(getChannel());
    dispatch(getSource());
    dispatch(getStatus());
    dispatch(getOfficeTypeData());
  }, [dispatch]);

  useEffect(() => {
    if (userRole == 4) {
      dispatch(getLeadsTL());
    } else {
      dispatch(getLead());
    }
  }, [dispatch, userRole])


  const countryData = useMemo(() => {
    if (!country) return [];
    return country.map((item: any) => ({
      value: item.id.toString(),
      label: item.country_name,
    }));
  }, [country]);

  const sourceData = useMemo(() => {
    if (!source) return [];
    return source.map((item: any) => ({
      value: item.id.toString(),
      label: item.source_name,
    }));
  }, [source]);

  const categoriesData = useMemo(() => {
    if (!categories) return [];
    return categories.map((item: any) => ({
      value: item.id.toString(),
      label: item.category_name,
    }));
  }, [categories]);

  const channelsData = useMemo(() => {
    if (!channels) return [];
    return channels.map((item: any) => ({
      value: item.id.toString(),
      label: item.channel_name,
    }));
  }, [channels]);

  const officeData = useMemo(() => {
    if (!office) return [];
    return office?.map((item: any) => ({
      value: item.id.toString(),
      label: item.office_type_name,
    }));
  }, [office]);

  const statusData = useMemo(() => {
    if (!status) return [];
    return status?.map((item: any) => ({
      value: item.id.toString(),
      label: item.status_name,
    }));
  }, [status]);

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
            country={countryData || []}
            source={sourceData || []}
            categories={categoriesData || []}
            user={user || null}
            cres={cres || []}
            channels={channelsData || []}
            office={officeData || []}
            error={error}
            loading={loading}
            status={statusData || []}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Leads;
