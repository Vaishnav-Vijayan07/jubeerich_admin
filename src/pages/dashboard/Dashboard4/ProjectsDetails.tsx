import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import classNames from "classnames";

// components
import { BasicPortlet } from "../../../components/Portlet";

// dummy data
import { ProjectDetailType } from "./data";
import moment from "moment";

const ProjectsDetails = () => {
  
  const projectsDetails = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      city: "New York",
      country: "USA",
      office: "Headquarters",
      source: "LinkedIn",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      city: "Los Angeles",
      country: "USA",
      office: "Branch Office",
      source: "Referral",
    },
    {
      name: "Robert Brown",
      email: "robert.brown@example.com",
      city: "Chicago",
      country: "USA",
      office: "Regional Office",
      source: "Website",
    },
    {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      city: "Toronto",
      country: "Canada",
      office: "Canadian Office",
      source: "Event",
    },
    {
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      city: "London",
      country: "UK",
      office: "European Office",
      source: "Job Portal",
    },
    {
      name: "Emma Martinez",
      email: "emma.martinez@example.com",
      city: "Barcelona",
      country: "Spain",
      office: "European Office",
      source: "LinkedIn",
    },
    {
      name: "David Garcia",
      email: "david.garcia@example.com",
      city: "Sydney",
      country: "Australia",
      office: "Australian Office",
      source: "Referral",
    },
    {
      name: "Sophia Johnson",
      email: "sophia.johnson@example.com",
      city: "Berlin",
      country: "Germany",
      office: "European Office",
      source: "Website",
    },
    {
      name: "James Lee",
      email: "james.lee@example.com",
      city: "Seoul",
      country: "South Korea",
      office: "Asia-Pacific Office",
      source: "Event",
    },
    {
      name: "Isabella Wong",
      email: "isabella.wong@example.com",
      city: "Hong Kong",
      country: "China",
      office: "Asia-Pacific Office",
      source: "Job Portal",
    },
  ];

  return (
    <>
      <BasicPortlet cardTitle="Recent Leads" titleClass="header-title">
        <div className="table-responsive">
          <table className="table table-centered table-nowrap table-borderless mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Country</th>
                <th>Office</th>
                <th>Source</th>
              </tr>
            </thead>
            {/* <tbody>
              {(projectsDetails || []).map((project: any, i: number) => {
                return (
                  <tr key={i}>
                    <td>{project.company_name}</td>
                    <td>{moment(project.created_at).format("DD-MM-YYYY")}</td>
                    <td>
                      {moment(project.followup_date).format("DD-MM-YYYY")}
                    </td>
                    <td>{project.name}</td>
                    <td>
                      <span
                        className={classNames(
                          "badge bg-soft-warning text-warning text-info p-1"
                        )}
                      >
                        Closed
                      </span>
                    </td>
                    <td>{project.category_id}</td>
                  </tr>
                );
              })}
            </tbody> */}
            <tbody>
              {(projectsDetails || []).map((project: any, i: number) => {
                return (
                  <tr key={i}>
                    <td>{project.name}</td>
                    <td>{project.email}</td>
                    <td>{project.city}</td>
                    <td>{project.country}</td>
                    <td>{project.office}</td>
                    <td>{project.source}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </BasicPortlet>
    </>
  );
};

export default ProjectsDetails;
