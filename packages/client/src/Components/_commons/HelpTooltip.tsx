import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface HelpTooltipProps {
  message: string;
  placement?: "top" | "right" | "bottom" | "left";
  text?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  message,
  placement = "right",
  text = "?",
}) => {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip id="help-tooltip">{message}</Tooltip>}
    >
      <span style={{ cursor: "pointer", color: "#007bff" }}>{text}</span>
    </OverlayTrigger>
  );
};

export default HelpTooltip;
