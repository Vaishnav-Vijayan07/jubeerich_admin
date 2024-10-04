import { useState } from "react";
import { useAccordionButton } from "react-bootstrap";

function CustomToggle({ eventKey }: any) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const decoratedOnClick = useAccordionButton(eventKey, () => {
    setIsCollapsed(!isCollapsed); // Toggle the collapsed state
  });

  return (
    <i
      className={`mdi ${!isCollapsed ? "mdi-menu-down" : "mdi-menu-up"}`}
      onClick={decoratedOnClick}
    >
      {!isCollapsed ? "Show" : "Hide"}
    </i>
  );
}

export default CustomToggle;
