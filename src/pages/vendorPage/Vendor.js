import {
  Button,
  Chip,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "src/firebase/Config";
import { firebaseGetWithQuery } from "src/utils/firebaseGetWithQuery";
import useLoggedUser from "src/utils/loggedUser";

import { Check, Close, LocalShipping, MoreHoriz } from "@mui/icons-material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { fCurrentDate, fDate } from "src/utils/formatTime";
import { BLOCKCHAIN_API } from "src/config-global";
import axios from "axios";
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import LoadingSpinner from "src/components/LoadingSpinner";

export default function Vendor() {
  const user = useLoggedUser();
  const [vendorOrder, setVendorOrder] = useState([]);

  const refetch = async () => {
    await firebaseGetWithQuery("vendorOrders", "vendor", user.employeeId).then(
      (res) => setVendorOrder(res)
    );
  };

  useEffect(() => {
    firebaseGetWithQuery("vendorOrders", "vendor", user.employeeId).then(
      (res) => setVendorOrder(res)
    );
  }, []);

  //   ----------------------------
  const [loading, setLoading] = useState("");
  const acceptHandler = async (order) => {
    const date =fCurrentDate();
    setLoading(order.orderId);
    try {
      const options = {
        url: `${BLOCKCHAIN_API}/accept-order`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
          orderId: order.orderId,
        },
      };
      await axios(options)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      await setDoc(
        doc(db, "vendorOrders", order.id),
        { Accepted: true, orderAcceptedDate: date },
        { merge: true }
      );
    } catch (error) {
      Swal.fire({
        customClass: {
          container: "my-swal",
        },

        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      console.log("🚀 ~ acceptHandler ~ error:", error);
    } finally {
      setLoading("");
    }

    refetch();
  };
  const rejectHandler = async (order) => {
    setLoading(order.orderId);
    try {
      const options = {
        url: `${BLOCKCHAIN_API}/reject-order`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
          orderId: order.orderId,
        },
      };

      await axios(options)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      await setDoc(
        doc(db, "vendorOrders", order.id),
        { Accepted: false },
        { merge: true }
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log("🚀 ~ acceptHandler ~ error:", error);
    } finally {
      setLoading("");
    }

    refetch();
  };

  const handleShipment = async (order) => {
    setLoading(order.orderId);

    try {
      const options = {
        url: `${BLOCKCHAIN_API}/ship-order`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
          orderId: order.orderId,
        },
      };
      await axios(options)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      const date =fCurrentDate();
      await setDoc(
        doc(db, "vendorOrders", order.id),
        { ShipmentDate: date },
        { merge: true }
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log("🚀 ~ acceptHandler ~ error:", error);
    } finally {
      setLoading(false);
    }

    refetch();
  };

  return (
    <Container>
      {loading && <LoadingSpinner />}
      <HeaderBreadcrumbs
        heading={"Orders"}
        links={[{ name: "Orders", href: "dashboard/vendor" }]}
      />
      <Grid container spacing={2}>
        <TableContainer>
          <Table
            sx={{
              tableLayout: "auto",
              width: "100% ",
              whiteSpace: "nowrap",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Sr#</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Materials</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Required Delivery Date</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Ship Address</TableCell>
                <TableCell>Shippment Date</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Shippment </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendorOrder?.map((order, i) => (
                <>
                  <TableRow>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{order.orderedDate}</TableCell>
                    <TableCell>{order.material}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.requiredDelivery}</TableCell>
                    <TableCell>{order.manufacturer}</TableCell>
                    <TableCell>{order.shipAddress}</TableCell>
                    <TableCell>{order.ShipmentDate}</TableCell>
                    {order.Accepted === true ? (
                      <TableCell>
                        {" "}
                        <Button
                          sx={{ m: "2px" }}
                          size="small"
                          variant="outlined"
                          endIcon={<Check />}
                          // onClick={() => acceptHandler(order)}
                        >
                          Accepted
                        </Button>
                      </TableCell>
                    ) : order.Accepted === false ? (
                      <TableCell>
                        {" "}
                        <Button
                          sx={{ m: "2px" }}
                          size="small"
                          variant="outlined"
                          color="error"
                          endIcon={<Close />}
                          // onClick={() => acceptHandler(order)}
                        >
                          Rejected
                        </Button>
                      </TableCell>
                    ) : order.Accepted === undefined ? (
                      <TableCell>
                        <LoadingButton
                          // loading={loading === order.orderId}
                          sx={{ m: "2px" }}
                          size="small"
                          variant="contained"
                          onClick={() => acceptHandler(order)}
                        >
                          Accept
                        </LoadingButton>
                        <LoadingButton
                          // loading={loading === order.orderId}
                          sx={{ m: "2px" }}
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => rejectHandler(order)}
                        >
                          Reject
                        </LoadingButton>
                      </TableCell>
                    ) : (
                      ""
                    )}

                    <TableCell>
                      {order.orderReceived === true ? (
                        <Chip icon={<Check />} label="Delivered" />
                      ) : order.orderReceived === undefined &&
                        order.Accepted === true &&
                        order.ShipmentDate === undefined ? (
                        <LoadingButton
                          size="small"
                          variant="contained"
                          color="secondary"
                          endIcon={<LocalShipping />}
                          // loading={loading === order.orderId}
                          onClick={() => handleShipment(order)}
                        >
                          Shipped Now
                        </LoadingButton>
                      ) : (
                        <Chip icon={<MoreHoriz />} label="Pending " />
                      )}
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}
