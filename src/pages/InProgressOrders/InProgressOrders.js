import React, { useState, useEffect } from "react";
import Page from "src/components/Page";
import { Grid, Container } from "@mui/material";
import InProgress from "src/components/inProgressOrders/InProgress";
import { db } from "src/firebase/Config";
import { getDocs, collection, doc } from "firebase/firestore";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD } from "src/routes/paths";
import { useSelector } from "react-redux";
import { firebaseGetWithQuery } from "src/utils/firebaseGetWithQuery";

export default function InProgressOrders() {
  const [processingOrders, setProcessingOrders] = useState([]);
  const [isloading, setIsloading] = useState(true);

  const user = useSelector((state) => state.AuthUser.userRole);
  const fetchinProgressOrders = async () => {
    setIsloading(true);
    const company = user.employeeId;
    await firebaseGetWithQuery("orders", "manufacturer.Id", company).then(
      (res) => {
        setProcessingOrders(res);
        setIsloading(false);
      }
    );
  };

  useEffect(() => {
    fetchinProgressOrders();
  }, []);

  // const fetchInProcessingOrder = async () => {
  //   let inProgress = [];

  //   const querySnapshot = await getDocs(collection(db, "orders"));
  //   querySnapshot.forEach((doc) => {
  //     let data = doc.data();
  //     data.id = doc.id;
  //     inProgress.push(data);
  //   });
  //   setProcessingOrders(inProgress);

  //   setIsloading(false);
  // };

  // useEffect(() => {
  //   fetchInProcessingOrder();
  // }, []);

  return (
    <div>
      <Page title="In Progress Orders">
        <Container fluid>
          <HeaderBreadcrumbs
            heading={"In Progress"}
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },

              {
                name: "In Progress",
                href: PATH_DASHBOARD.general.inProgress,
              },
            ]}
          />
          <Grid container spacing={2}>
            {/* In Progress Order Components */}
            <InProgress
              processingOrders={processingOrders}
              isloading={isloading}
            />
          </Grid>
        </Container>
      </Page>
    </div>
  );
}
