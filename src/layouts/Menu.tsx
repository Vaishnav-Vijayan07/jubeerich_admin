import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import classNames from "classnames";
import FeatherIcon from "feather-icons-react";

//helpers
import { findAllParent, findMenuItem } from "../helpers/menu";

// constants
import { MenuItemTypes } from "../constants/menu";
import { APICore } from "../helpers/api/apiCore";

interface SubMenus {
  item: MenuItemTypes;
  linkClassName?: string;
  subMenuClassNames?: string;
  activeMenuItems?: Array<string>;
  toggleMenu?: (item: any, status: boolean) => void;
  className?: string;
}

const MenuItemWithChildren = ({ item, linkClassName, subMenuClassNames, activeMenuItems, toggleMenu }: SubMenus) => {
  const [open, setOpen] = useState<boolean>(activeMenuItems!.includes(item.key));

  useEffect(() => {
    setOpen(activeMenuItems!.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = (e: React.MouseEvent) => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
  };

  return (
    <li className={classNames("menu-item", { "menuitem-active": activeMenuItems!.includes(item.key) })}>
      <Link
        to="#"
        onClick={toggleMenuItem}
        data-menu-key={item.key}
        aria-expanded={open}
        className={classNames("menu-link", linkClassName, {
          "active": activeMenuItems!.includes(item.key),
        })}
      >
        {item.icon && (
          <span className="menu-icon">
            <FeatherIcon icon={item.icon} />
          </span>
        )}
        <span className="menu-text">{item.label}</span>
        {!item.badge ? (
          <span className="menu-arrow"></span>
        ) : (
          <span className={`badge bg-${item.badge.variant} rounded-pill ms-auto`}>{item.badge.text}</span>
        )}
      </Link>
      <Collapse in={open}>
        <div>
          <ul className={classNames(subMenuClassNames)}>
            {(item.children || []).map((child, i) => (
              <React.Fragment key={i}>
                {child.children ? (
                  <MenuItemWithChildren
                    item={child}
                    linkClassName={activeMenuItems!.includes(child.key) ? "active" : ""}
                    activeMenuItems={activeMenuItems}
                    subMenuClassNames="sub-menu"
                    toggleMenu={toggleMenu}
                  />
                ) : (
                  <MenuItem
                    item={child}
                    className={activeMenuItems!.includes(child.key) ? "menuitem-active" : ""}
                    linkClassName={activeMenuItems!.includes(child.key) ? "active" : ""}
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </Collapse>
    </li>
  );
};

const MenuItem = ({ item, className, linkClassName }: SubMenus) => {
  return (
    <li className={classNames("menu-item", className)}>
      <MenuItemLink item={item} className={linkClassName} />
    </li>
  );
};

const MenuItemLink = ({ item, className }: SubMenus) => {
  return (
    <Link
      to={item.url!}
      target={item.target}
      className={classNames("side-nav-link-ref menu-link", className)}
      data-menu-key={item.key}
    >
      {item.icon && (
        <span className="menu-icon">
          <FeatherIcon icon={item.icon} />
        </span>
      )}
      <span className="menu-text">{item.label}</span>
      {item.badge && <span className={`badge bg-${item.badge.variant}`}>{item.badge.text}</span>}
    </Link>
  );
};

interface AppMenuProps {
  menuItems: MenuItemTypes[];
}

const AppMenu = ({ menuItems }: AppMenuProps) => {
  const location = useLocation();
  const api = new APICore();
  const menuRef = useRef<HTMLUListElement>(null);
  const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([]);

  const toggleMenu = useCallback((menuItem: MenuItemTypes, show: boolean) => {
    if (show) {
      const activeItems = [menuItem.key, ...findAllParent(menuItems, menuItem)];
      setActiveMenuItems(activeItems);
    } else {
      const activeItems = activeMenuItems.filter(item => item !== menuItem.key);
      setActiveMenuItems(activeItems);
    }
  }, [activeMenuItems, menuItems]);

  // use this function to find the active menu items
  const findActiveMenuItem = useCallback((pathname: string) => {
    const matchingMenuItem = menuItems.reduce((result: MenuItemTypes | null, item) => {
      if (result) return result;
      if (item.url === pathname) return item;
      if (item.children) {
        const childMatch = item.children.find(child => child.url === pathname);
        if (childMatch) return childMatch;
      }
      return null;
    }, null);

    return matchingMenuItem;
  }, [menuItems]);

  // sets the
  useEffect(() => {
    const currentPath = location.pathname.replaceAll(process.env.PUBLIC_URL || "", "");
    const activeMenuItem = findActiveMenuItem(currentPath);
    
    if (activeMenuItem) {
      const activeItems = [activeMenuItem.key, ...findAllParent(menuItems, activeMenuItem)];
      setActiveMenuItems(activeItems);
    } else {
      setActiveMenuItems([]);
    }
  }, [location.pathname, menuItems, findActiveMenuItem]);

  return (
    <ul className="menu" ref={menuRef} id="main-side-menu">
      {menuItems.map((item, idx) => {
        const loggedInUser = api.getLoggedInUser();

        if (item.roles && !item.roles.some((userRole: any) => loggedInUser.power_names?.includes(userRole))) {
          return null;
        }

        return (
          <React.Fragment key={idx}>
            {item.isTitle ? (
              <li className={classNames("menu-title", { "mt-2": idx !== 0 })}>
                {item.label}
              </li>
            ) : (
              <>
                {item.children ? (
                  <MenuItemWithChildren
                    item={item}
                    toggleMenu={toggleMenu}
                    subMenuClassNames="sub-menu"
                    activeMenuItems={activeMenuItems}
                    linkClassName="menu-link"
                  />
                ) : (
                  <MenuItem
                    item={item}
                    linkClassName="menu-link"
                    className={activeMenuItems.includes(item.key) ? "menuitem-active" : ""}
                  />

                )}
              </>
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default AppMenu;