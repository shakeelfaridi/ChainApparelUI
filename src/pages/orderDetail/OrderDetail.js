import { CheckCircleTwoTone, Close, Download } from "@mui/icons-material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import QRCode from "react-qr-code";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link as routerLink } from "react-router-dom";
import { PageNotFoundIllustration } from "src/assets";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { db } from "src/firebase/Config";
import { fCurrentDate, fDate, fDateTime } from "src/utils/formatTime";
import useLoggedUser from "src/utils/loggedUser";
import Swal from "sweetalert2";
import BoxComp from "src/components/Box";
import axios from "axios";

export default function OrderDetail() {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const isManufacturer = useLoggedUser();
  let { id } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);

  const fetchOrder = async () => {
    let orders = [];

    const q = query(collection(db, "orders"), where("orderId", "==", id));
    const queryOrders = await getDocs(q);
    queryOrders.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      orders.push(data);
    });
    setOrderDetail(orders[0]);
  };

  async function acceptHandler(order) {
    const { materialRequirement } = order;
    let array = [];
    const arr = Object.entries(materialRequirement);
    arr.map((item) => array.push({ Key: item[0], Value: item[1] }));

    const startProductionDate = fCurrentDate();
    const options = {
      url: " http://localhost:9910/api/create-order",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        id: order.id,
        // prductCodes: ["a", "b", "c", "d", "f"],
        prductCodes: order.productcodes,
        Accept: "true",
        ShipAddress: order.ShipAddress,
        brandName: order.brandName,
        productUrl: order.productUrl,
        email: order.email,
        manufacturer: order.manufacturer,
        orderId: order.orderId,
        orderValue: order.orderValue,
        product: order.product,
        productQuantity: order.productQuantity,
        productStyleNo: order.productStyleNo,
        username: order.userName,
        phoneNumber: order.customerInfo.Phone_Number,
        orderDate: order.customerInfo.Order_Date,
        materialReqirement: array,
        startProductionDate: startProductionDate,
      },
    };
    axios(options)
      .then(async (response) => {
        const id = order.id;
        const startProductionDate = fCurrentDate()
        const orderRef = doc(db, "orders", id);
        await setDoc(
          orderRef,
          { Accept: true, id, startProductionDate },
          { merge: true }
        );

        Swal.fire({
          position: "center",
          backdrop: `rgba(245, 245, 245,0.3)`,
          icon: "success",
          title: "Order Is Accepted",
          timer: 1500,
        });
      })
      .catch((err) => console.log(err));

    fetchOrder();
  }
  async function rejectHandler(order) {
    const orderRef = doc(db, "orders", order.id);
    await setDoc(orderRef, { Accept: false }, { merge: true });
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Order Is Declined",
      timer: 1500,
    });

    fetchOrder();
  }
  useEffect(() => {
    fetchOrder();
  }, [id]);

  return (
    <Page title="Order Detail">
      {orderDetail === undefined && (
        <PageNotFoundIllustration sx={{ width: "600px", margin: "auto" }} />
      )}

      {orderDetail !== undefined && (
        <>
          <Container>
            {" "}
            <HeaderBreadcrumbs
              heading={"Complete Order Detail"}
              links={[
                { name: "Dashboard", href: "/dashbaord" },
                {
                  name: "Order Detail",
                  href: "/dashboard/order-detail/:id",
                },
              ]}
              action={
                <Button variant="contained" component={routerLink} to={-1}>
                  Back
                </Button>
              }
            />
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item lg={12} md={12} sm={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1 }} aria-label="simple table">
                    <TableBody>
                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Qr Code</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          <Box
                            style={{
                              height: "auto",
                              margin: "0 auto",
                              width: "100%",
                            }}
                          >
                            {orderDetail?.orderId ? (
                              <QRCode
                                value={`Order Date: ${orderDetail?.customerInfo.Order_Date},Product Name: ${orderDetail?.product},Brand Name:${orderDetail?.brandName}`}
                                size={100}
                              />
                            ) : (
                              <Skeleton animation="wave" />
                            )}
                          </Box>

                          {/* {orderDetail?.orderId || (
                            <Skeleton animation="wave" />
                          )} */}
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Order Id</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          {orderDetail?.orderId || (
                            <Skeleton animation="wave" />
                          )}
                        </TableCell>
                      </TableRow>
                      <br />

                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Order Date</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          {fDate(orderDetail?.customerInfo.Order_Date) || (
                            <Skeleton animation="wave" />
                          )}
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------------- */}
                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Product</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {orderDetail?.product || (
                              <Skeleton animation="wave" />
                            )}
                            <Button
                              sx={{ marginLeft: "10px" }}
                              variant="outlined"
                              onClick={handleClickOpen}
                            >
                              View Product Style
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Manufacturer</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {orderDetail?.manufacturer.Company || (
                              <Skeleton animation="wave" />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Style No.</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          {orderDetail?.productStyleNo || (
                            <Skeleton animation="wave" />
                          )}
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------------- */}
                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Product Quantity</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          {orderDetail?.productQuantity || (
                            <Skeleton animation="wave" />
                          )}
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------------- */}
                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Product Codes</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          <Box sx={{ display: "block" }}>
                            <Typography>
                              {"Start :  " +
                                orderDetail?.productcodes.slice(0, 1)}
                            </Typography>

                            <Typography>
                              {" "}
                              {"End   :   " +
                                orderDetail?.productcodes.slice(-1)}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------------- */}
                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Order Value</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          $
                          {orderDetail?.orderValue || (
                            <Skeleton animation="wave" />
                          )}
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------------- */}
                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Material Used</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          {orderDetail !== null &&
                            Object.entries(
                              orderDetail?.materialRequirement
                            ).map(([key, value]) => (
                              <>
                                <ul>
                                  <li>
                                    {key} : {value.Vendor}
                                  </li>
                                </ul>
                              </>
                            ))}
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------------- */}
                      {/* --------------------- */}
                      <TableRow>
                        <TableCell variant="head">
                          <Typography variant="h6">Order Stauts</Typography>
                        </TableCell>
                        <TableCell variant="head">
                          {orderDetail?.Accept === undefined && (
                            <Button variant="text" color="primary" size="small">
                              In Review
                            </Button>
                          )}
                          {orderDetail?.Accept === false && (
                            <Button variant="text" color="error" size="small">
                              Declined
                            </Button>
                          )}
                          {orderDetail?.Accept === true &&
                          orderDetail?.processing?.delivered === false ? (
                            <Button variant="text" color="success" size="small">
                              In Production
                            </Button>
                          ) : orderDetail?.Accept === true &&
                            orderDetail?.processing?.delivered === true ? (
                            <Button variant="text" color="secondary">
                              <CheckCircleTwoTone /> Delivered
                            </Button>
                          ) : orderDetail?.Accept === true ? (
                            <Button variant="text" color="success" size="small">
                              Start Production
                            </Button>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      </TableRow>
                      <br />
                      {/* --------------------- */}
                      {/* {isManufacturer?.role === "manufacturer" &&
                        orderDetail?.Accept === undefined && (
                          <Box>
                            <Button onClick={() => acceptHandler(orderDetail)}>
                              Accept
                            </Button>
                            <Button
                              onClick={() => rejectHandler(orderDetail)}
                              variant="error"
                            >
                              Reject
                            </Button>
                          </Box>
                        )} */}

                      {/* --------------------- */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid items xs={10} sx={{ marginTop: "20px" }}>
                <Paper elevation={2} variant="outlined">
                  <Timeline position="right">
                    <TimelineItem>
                      <TimelineOppositeContent color="text.secondary">
                        <Box>Start Produnction Date -</Box>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={
                            orderDetail?.startProductionDate
                              ? "success"
                              : "grey"
                          }
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        {fDate(orderDetail?.startProductionDate) || "-"}
                      </TimelineContent>
                    </TimelineItem>
                    {/* ------------------------- */}

                    <TimelineItem>
                      <TimelineOppositeContent color="text.secondary">
                        <Box>Cutting -</Box>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={
                            orderDetail?.processing?.Cutting === "completed"
                              ? "success"
                              : "grey"
                          }
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="overline" display="block">
                          {orderDetail?.processing?.CuttingTrack
                            ? fDate(
                                orderDetail?.processing?.CuttingTrack[0]
                                  .DateTime
                              )
                            : "-"}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    {/* ------------------------- */}
                    <TimelineItem>
                      <TimelineOppositeContent color="text.secondary">
                        <Box>Stiching -</Box>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={
                            orderDetail?.processing?.Stiching === "completed"
                              ? "success"
                              : "grey"
                          }
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="overline" display="block">
                        {orderDetail?.processing?.StichingTrack
                            ? fDate(
                                orderDetail?.processing?.StichingTrack[0]
                                  .DateTime
                              )
                            : "-"}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    {/* ------------------------- */}
                    <TimelineItem>
                      <TimelineOppositeContent color="text.secondary">
                        <Box>Quality -</Box>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={
                            orderDetail?.processing?.Quality === "completed"
                              ? "success"
                              : "grey"
                          }
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="overline" display="block">
                        {orderDetail?.processing?.QualityTrack
                            ? fDate(
                                orderDetail?.processing?.QualityTrack[0]
                                  .DateTime
                              )
                            : "-"}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    {/* ------------------------- */}
                    <TimelineItem>
                      <TimelineOppositeContent color="text.secondary">
                        <Box>Packing -</Box>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={
                            orderDetail?.processing?.Packing === "completed"
                              ? "success"
                              : "grey"
                          }
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="overline" display="block">
                        {orderDetail?.processing?.PackingTrack
                            ? fDate(
                                orderDetail?.processing?.PackingTrack[0]
                                  .DateTime
                              )
                            : "-"}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    {/* ------------------------- */}
                    <TimelineItem>
                      <TimelineOppositeContent color="text.secondary">
                        <Box>Delivered -</Box>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={
                            orderDetail?.processing?.delivered === true
                              ? "success"
                              : "grey"
                          }
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        {orderDetail?.processing?.delivered === true
                          ? "✔️"
                          : "-"}
                        <Typography variant="overline" display="block">
                          { orderDetail?.processing?.deliveredDate ? fDate(orderDetail?.processing?.deliveredDate)  : "-"}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </Paper>
              </Grid>
            </Grid>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="id">
                <Box display="flex" alignItems="center">
                  <Box flexGrow={1}>Product image</Box>
                  <Box>
                    <IconButton onClick={handleClose}>
                      <Close />
                    </IconButton>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                {orderDetail?.productUrl ? (
                  <LazyLoadImage
                    src={orderDetail?.productUrl}
                    alt="img"
                    effect="blur"
                  />
                ) : (
                  <CircularProgress />
                )}
              </DialogContent>
            </Dialog>
          </Container>
        </>
      )}
    </Page>
  );
}
