import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { fetchBranchIdFromSessionStorage, setSessionStorageItem } from "../redux/actions";

interface ProfileMenuItem {
    label: string;
    value: string;
}

interface BranchDropDownProps {
    menuItems: Array<ProfileMenuItem>;
    profilePic?: string;
    branchname: string;
    userTitle?: string;
}

const BranchDropDown = (props: BranchDropDownProps) => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const dispatch = useDispatch()

    /*
     * toggle profile-dropdown
     */
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
            <Dropdown.Toggle
                id="dropdown-profile"
                as="a"
                onClick={toggleDropdown}
                className={classNames(
                    "nav-link nav-user me-0 waves-effect waves-light my-dropdown-toggle",
                    { show: dropdownOpen }
                )}
            >
                <span className="pro-user-name ms-1">
                    {props["branchname"]} <i className="mdi mdi-chevron-down"></i>
                </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu dropdown-menu-end profile-dropdown">
                <div onClick={toggleDropdown}>
                    {(props.menuItems || []).map((item, i) => {
                        return (
                            <React.Fragment key={i}>
                                {i === props["menuItems"].length - 1 && (
                                    <div className="dropdown-divider"></div>
                                )}
                                <div
                                    className="dropdown-item notify-item"
                                    style={{cursor:"pointer"}}
                                    key={i + "-profile-menu"}
                                    onClick={()=> {
                                        sessionStorage.setItem("branch_id", item.value);
                                        dispatch(fetchBranchIdFromSessionStorage())
                                    }}
                                >
                                    <span>{item.label}</span>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default BranchDropDown;