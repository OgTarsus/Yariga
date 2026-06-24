import React from "react";
import { useLink, useRefineOptions } from "@refinedev/core";
import MuiLink from "@mui/material/Link";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import type { RefineLayoutThemedTitleProps } from "@refinedev/mui";

import logo from '../../assets/logo.svg'
import yariga from '../../assets/yariga.svg'

export const ThemedTitle: React.FC<RefineLayoutThemedTitleProps> = ({
  collapsed,
  wrapperStyles,
  icon: iconFromProps,
  text: textFromProps,
}) => {
  const { title: { icon: defaultIcon, text: defaultText } = {} } =
    useRefineOptions();
  const icon =
    typeof iconFromProps === "undefined" ? defaultIcon : iconFromProps;
  const text =
    typeof textFromProps === "undefined" ? defaultText : textFromProps;
  const Link = useLink();

  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      <MuiLink
        underline="none"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          ...wrapperStyles,
        }}
      >
        {collapsed ? <img src={logo} alt="logo" style={{width: 24, height: 24,}} /> : <img src={yariga} alt="yariga" style={{ height: 24,}} />}
      </MuiLink>
    </Link>
  );
};
