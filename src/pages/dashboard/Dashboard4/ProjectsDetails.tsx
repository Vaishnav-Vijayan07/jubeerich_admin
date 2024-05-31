import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import classNames from "classnames";

// components
import { BasicPortlet } from "../../../components/Portlet";

// dummy data
import { ProjectDetailType } from "./data";
import moment from "moment";


const ProjectsDetails = ({ projectsDetails }: any) => {
  return (
    <>
      <BasicPortlet cardTitle="Recently Closed Leads" titleClass="header-title">
        <div className="table-responsive">
          <table className="table table-centered table-nowrap table-borderless mb-0">
            <thead className="table-light">
              <tr>
                <th>Company Name</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Client</th>
                <th>Status</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {(projectsDetails || []).map((project: any, i: number) => {
                return (
                  <tr key={i}>
                    <td>{project.company_name}</td>
                    <td>{moment(project.created_at).format("DD-MM-YYYY")}</td>
                    <td>{moment(project.followup_date).format("DD-MM-YYYY")}</td>
                    <td>{project.name}</td>
                    <td>
                      <span
                        className={classNames(
                          "badge bg-soft-warning text-warning text-info p-1",
                        )}
                      >
                        Closed
                      </span>
                    </td>
                    <td>{project.category_id}</td>
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
