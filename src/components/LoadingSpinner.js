import React from "react";
import { Stack } from "@mui/material";
import Iconify from "./Iconify";
import { Icon } from "@iconify/react";

const LoadingSpinner = () => (
  <Stack
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999 /* Adjust the z-index value as needed */,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      backgroundColor:
        "rgba(255, 255, 255, 0.5)" /* Optional: Add a semi-transparent background */,
    }}
  >
    <Icon icon="svg-spinners:12-dots-scale-rotate" width="50" />
  </Stack>
);

export default LoadingSpinner;
