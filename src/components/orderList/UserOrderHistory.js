import {
  Button,
  Card,
  Container,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { Link as routerLink } from "react-router-dom";
// -----------Dialoge
import CheckIcon from "@mui/icons-material/Check";
// -------------------Firebase
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "src/firebase/Config";
// -------------------Redux
import { useSelector } from "react-redux";
import { PATH_DASHBOARD } from "src/routes/paths";
import HeaderBreadcrumbs from "../HeaderBreadcrumbs";
import { fDate } from "src/utils/formatTime";

// --------------------------------------------------------------------------
export default function UserOrderHistory() {
  const [ordersHistory, setOrdersHistory] = useState([]);
  // selected order detail
  const [orderDetail, setOrderDetail] = useState(null);
  const [isloading, setisloading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const user = useSelector((state) => state.AuthUser.user);
  const uid = user.uid;
  const email = user.email;

  // --------------------
  async function fetchOrderHistory() {
    try {
      setisloading(true);
  
      const q = query(
        collection(db, "orders"),
        where("email", "==", email)
      );
  
      const querySnapshot = await getDocs(q);
  
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      // Custom sort by 'created_at' in descending order
      orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  console.table(orders)
      setOrdersHistory(orders);
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setisloading(false);
    }
  }
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <>
      <Container>
        <HeaderBreadcrumbs
          heading={"Order History"}
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Order History",
              href: PATH_DASHBOARD.general.orderhistory,
            },
          ]}
          action={
            <Button
              variant="contained"
              component={routerLink}
              to="/dashboard/order"
            >
              New Order
            </Button>
          }
        />

        <Card sx={{ p: "5px", marginTop: "10px" }}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={12} lg={12}>
              <TableContainer>
                <Table
                  sx={{
                    minWidth: 720,
                    tableLayout: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        PO Number
                      </TableCell>
                      <TableCell component="th" scope="row">
                        Order Date
                      </TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Manufacturer</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isloading ? (
                      <TableRow>
                        <TableCell align="center" colSpan={7}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      ordersHistory?.map((order) => {
                        return (
                          <TableRow>
                            <TableCell
                              component={routerLink}
                              scope="row"
                              to={`/dashboard/order-detail/${order?.orderId}`}
                            >
                              <Link href="javascript:void(0)" underline="hover">
                                {order.orderId}
                              </Link>
                            </TableCell>

                            <TableCell>
                              {fDate(order?.customerInfo?.Order_Date)}
                            </TableCell>
                            <TableCell>{order.email}</TableCell>
                            <TableCell>{order?.ShipAddress}</TableCell>
                            <TableCell>{order.brandName}</TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>{order.manufacturer.Company}</TableCell>
                            <TableCell>
                              {order.Accept === undefined && (
                                <Button
                                  variant="text"
                                  color="primary"
                                  size="small"
                                >
                                  In Review
                                </Button>
                              )}
                              {order.Accept === false && (
                                <Button
                                  variant="text"
                                  color="error"
                                  size="small"
                                >
                                  Declined
                                </Button>
                              )}
                              {order.Accept === true &&
                              order.processing?.delivered === false ? (
                                <Button
                                  variant="text"
                                  color="success"
                                  size="small"
                                >
                                  In Production
                                </Button>
                              ) : order.Accept === true &&
                                order.processing?.delivered === true ? (
                                <Button variant="text" color="secondary">
                                  <CheckIcon /> Delivered
                                </Button>
                              ) : order?.Accept === true &&
                                order.processing === undefined ? (
                                <Button
                                  variant="text"
                                  color="success"
                                  size="small"
                                >
                                  Start Production
                                </Button>
                              ) : (
                                ""
                              )}
                              {/* {order.processing?.delivered === true && (
                              
                            )} */}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Card>
      </Container>
      {/* ----------------- */}

      {/* <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        style={{ overflowX: "auto" }}
      >
        <DialogTitle id="id">
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Order Detail</Box>
            <Box>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <div>
          <TableContainer>
            <Table sx={{ tableLayout: "auto", whiteSpace: "nowrap" }}>
              <TableHead>
                <TableRow>
                  <TableCell component="th" scope="row">
                    PO Number
                  </TableCell>
                  <TableCell component="th" scope="row">
                    Order Date
                  </TableCell>
                  <TableCell component="th" scope="row">
                    Order To
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Order Value</TableCell>
                  <TableCell>Order Quantity</TableCell>
                  <TableCell>Material Used</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{orderDetail?.orderId}</TableCell>
                  <TableCell width={300}>
                    {orderDetail?.customerInfo?.Order_Date}
                  </TableCell>

                  <TableCell>{orderDetail?.manufacturer}</TableCell>
                  <TableCell> {orderDetail?.email}</TableCell>
                  <TableCell> {orderDetail?.customerInfo?.Address}</TableCell>
                  <TableCell> {orderDetail?.brandName}</TableCell>
                  <TableCell> {orderDetail?.product}</TableCell>
                  <TableCell>$ {orderDetail?.orderValue}</TableCell>
                  <TableCell> {orderDetail?.productQuantity}</TableCell>

                  <TableCell>
                    {orderDetail !== null &&
                      Object.entries(orderDetail?.materialRequirement).map(
                        ([key, value]) => (
                          <>
                            {key}: {value}
                            <br />
                          </>
                        )
                      )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Dialog> */}
    </>
  );
}
