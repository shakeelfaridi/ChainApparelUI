import { Container } from "@mui/system";
import React from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ProductNewEditForm from "src/sections/@dashboard/e-commerce/ProductNewEditForm";

export default function NewProduct() {
  return (
    <Page title="Add New Product">
      <Container>
        <HeaderBreadcrumbs
          heading={"Add New Product"}
          links={[
            { name: "Dashboard", href: "/dashbaord" },
            {
              name: "Add New Product",
              href: "/dashboard/add-new-products",
            },
          ]}
        />
        <ProductNewEditForm />
      </Container>
    </Page>
  );
}
