import { Button } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { Link as routerLink } from "react-router-dom";

export default function Profile() {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading={"Profile"}
        links={[
          { name: "Dashboard", href: "/dashbaord" },
          {
            name: "Profile",
            href: "/dashbaord/profile",
          },
        ]}
        action={
          <Button variant="contained" component={routerLink} to={-1}>
            Back
          </Button>
        }
      />
    </Container>
  );
}
