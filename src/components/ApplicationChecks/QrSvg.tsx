import React from "react";

type Props = {
  type: string;
};

function SvgType({ type }: Props) {
  const renderItem = () => {
    switch (type) {
      case "format":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        );
      case "scan":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* QR Code Frame Top Left */}
            <path d="M4 4v4h4" />

            {/* QR Code Frame Top Right */}
            <path d="M20 4v4h-4" />

            {/* QR Code Frame Bottom Left */}
            <path d="M4 20v-4h4" />

            {/* QR Code Frame Bottom Right */}
            <path d="M20 20v-4h-4" />

            {/* Center QR Pattern */}
            <rect x="9" y="9" width="2" height="2" />
            <rect x="13" y="9" width="2" height="2" />
            <rect x="9" y="13" width="2" height="2" />
            <rect x="13" y="13" width="2" height="2" />

            {/* Scanning Line Animation */}
            <line x1="7" y1="12" x2="17" y2="12" />
          </svg>
        );
    }
  };

  return renderItem();
}

export default SvgType;
