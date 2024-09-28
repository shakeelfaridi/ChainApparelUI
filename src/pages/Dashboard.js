// @mui
import { Container, Grid } from "@mui/material";
// hooks
import useSettings from "../hooks/useSettings";
// _mock_
// components
import Page from "../components/Page";
// sections
import OrderList from "src/components/orderList/OrderList";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";

// ----------------------------------------------------------------------

export default function Dashboard() {
  return (
    <Page title="New Orders">
      <Container>
        <HeaderBreadcrumbs
          heading={"New Orders"}
          links={[
            { name: "Dashboard", href: "/dashboard" },

            {
              name: "New Order",
              href: "/dashboard/New-Orders",
            },
          ]}
        />
        <Grid container spacing={3} style={{ marginBottom: "24px" }}>
          {/* New -----------------------------   Order ------------------ */}
          <Grid item xs={12} md={12} lg={12}>
            <OrderList />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
