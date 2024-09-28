import { useState } from "react";
import { useParams } from "react-router";
// Mui Components
import { Container } from "@mui/system";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
// admin react components
import AdminTracking from "src/components/adminTracking/AdminTracking";
//firebase
import { firebaseGetWithQuery } from "src/utils/firebaseGetWithQuery";

export default function Tracking() {
  // usestate
  const [tracking, setTracking] = useState([]);
  const [search, setSearch] = useState("");
  const [isloading, setIsloading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { orderId } = useParams();

  const fetechTracking = async () => {
    const data = await firebaseGetWithQuery(
      "orders",
      "orderId",
      search ? search : orderId
    ).then((res) => {
      // debugger;
      if (res.length === 0) {
        setIsError(true);
      }
      console.log(res.length === 0);
      setTracking(res);
    });

    setIsloading(false);
  };

  return (
    <div>
      <Page title="Tracking">
        <Container fluid>
          <HeaderBreadcrumbs
            heading="Tracking"
            links={[
              { name: "Dashboard", href: "/dashboard/welcome" },
              { name: "Tracking", href: "/dashboard/tracking" },
            ]}
          />

          <AdminTracking
            tracking={tracking}
            loading={isloading}
            search={search}
            setSearch={setSearch}
            fetechTracking={fetechTracking}
            orderId={orderId}
            isError={isError}
            setIsError={setIsError}
          />
        </Container>
      </Page>
    </div>
  );
}
