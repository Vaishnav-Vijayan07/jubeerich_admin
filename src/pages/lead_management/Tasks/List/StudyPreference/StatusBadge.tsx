import React from "react";
import { Badge } from "react-bootstrap";

type Props = {
  status: string;
};
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning"; // Yellow badge for pending
    case "submitted":
      return "info"; // Blue badge for submitted
    case "approved":
      return "success"; // Green badge for approved
    case "rejected":
      return "danger"; // Red badge for rejected
    default:
      return "secondary"; // Default color (gray) for unknown statuses
  }
};

function StatusBadge({ status }: Props) {
  return (
    <Badge bg={getStatusBadgeColor(status)} className="p-1">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default StatusBadge;
