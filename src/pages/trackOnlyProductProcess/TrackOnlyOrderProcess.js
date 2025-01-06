import { Search } from "@mui/icons-material";
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
  Alert,
  Box,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { BLOCKCHAIN_API } from "src/config-global";
import { db } from "src/firebase/Config";
import { fDate } from "src/utils/formatTime";
import useLoggedUser from "src/utils/loggedUser";

export default function TrackOnlyOrderProcess() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [receiveDoc, setReceiveDoc] = useState({});
  const [receiveDoc2, setReceiveDoc2] = useState([
    {
      OrderId: "",
      Status: "",
      Accept: false,
      Reject: false,
      Shipment: false,
      Confirmation: false,
      OrderDate: 0,
      ConfirmationDate: 0,
      RejectanceDate: 0,
      ShipmentDate: 0,
      AcceptanceDate: 0,
      OrderMaterial: [],
    },
  ]); // State for the response from the second API

  const user = useLoggedUser();
  const fetechTracking = async () => {
    setLoading(true);
    const id = search.split("-")[0];

    try {
      // First API call
      const options1 = {
        url: ` http://localhost:9910/api/query-order/${id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      };

      const response1 = await axios(options1);
      setReceiveDoc(response1.data);

      // Second API call
      const options2 = {
        url: `${BLOCKCHAIN_API}/query-order/${id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      };

      const response2 = await axios(options2);
      setReceiveDoc2(response2?.data);
      // Handle the response from the second API as needed.

      setLoading(false);
    } catch (error) {
      console.error(error);
      // setReceiveDoc(null);
      // setReceiveDoc2(null);
      setLoading(false);
    }
  };

  return (
    <Container>
      <HeaderBreadcrumbs
        heading={"Tracking Product Info"}
        links={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Home", href: "dashboard/track-order-processes" },
        ]}
      />
      <Card sx={{ padding: "10px" }}>
        <TextField
          fullWidth
          id="search"
          label="Enter Product id To Track"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton onClick={() => fetechTracking()}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Card>
      <Grid container spacing={2}>
        <Grid
          item
          sm={12}
          sx={{ marginTop: "25px" }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {loading && <CircularProgress />}
          {receiveDoc === undefined && (
            <Alert severity="error">Error, not found</Alert>
          )}
        </Grid>
        {receiveDoc.Accept === true && receiveDoc.processing ? (
          <>
            <Grid item xs={12} sx={{ marginTop: "15px" }}>
              {Object.keys(receiveDoc || {}).length > 0 && (
                <>
                  <Paper elevation={2} variant="outlined">
                    <TableContainer>
                      <Table sx={{ minWidth: "100%" }}>
                        <TableHead>
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              Details
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>
                              Order Id
                            </TableCell>
                            <TableCell>
                              {" "}
                              <Typography>{receiveDoc.orderId}</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>
                              Order Date
                            </TableCell>
                            <TableCell>
                              {" "}
                              <Typography>
                                {fDate(receiveDoc.cutomerInfo.orderDate)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>Product</TableCell>
                            <TableCell>
                              {" "}
                              <Typography>{receiveDoc.product}</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>
                              Product Brand
                            </TableCell>
                            <TableCell>
                              {" "}
                              <Typography>{receiveDoc.brandName}</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>
                              {" "}
                              Style Number
                            </TableCell>
                            <TableCell>
                              {" "}
                              <Typography>
                                {receiveDoc.productStyleNo}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>
                              Product Quantity
                            </TableCell>
                            <TableCell>
                              {" "}
                              <Typography>
                                {receiveDoc.productQuantity}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          {/* ----------------------For Customer */}

                          {user.role === "customer" ? (
                            <TableRow>
                              <TableCell sx={{ width: "50%" }}>
                                Manufacturer
                              </TableCell>
                              <TableCell>
                                {" "}
                                {receiveDoc.manufacturer.map((item) => (
                                  <Typography>
                                    {" "}
                                    {item.Key} : {item.Value}{" "}
                                  </Typography>
                                ))}
                              </TableCell>
                            </TableRow>
                          ) : (
                            <>
                              <TableRow>
                                <TableCell sx={{ width: "50%" }}>
                                  Customer Name
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography>{receiveDoc.userName}</Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ width: "50%" }}>
                                  Cutting Job
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography>{receiveDoc.Cutting}</Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ width: "50%" }}>
                                  Stiching Job
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography>{receiveDoc.Stiching}</Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ width: "50%" }}>
                                  Quality Job
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography>{receiveDoc.Quality}</Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ width: "50%" }}>
                                  Packing Job
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography>{receiveDoc.Packing}</Typography>
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                          <TableRow>
                            <TableCell colSpan={2} align="center" head>
                              <Typography sx={{ fontWeight: "bold" }}>
                                *ICP Response
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>
                              Order Date
                            </TableCell>
                            <TableCell>
                              <Typography>
                                {fDate(
                                  new Date(receiveDoc2[0]?.OrderDate || "")
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>Accept</TableCell>
                            <TableCell>
                              <Typography>
                                {receiveDoc2[0]?.Accept
                                  ? fDate(
                                      new Date(receiveDoc2[0].AcceptanceDate)
                                    )
                                  : "No"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>Reject</TableCell>
                            <TableCell>
                              <Typography>
                                {receiveDoc2[0]?.Reject
                                  ? fDate(
                                      new Date(receiveDoc2[0].RejectanceDate)
                                    )
                                  : "No"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>
                              Shipment
                            </TableCell>
                            <TableCell>
                              <Typography>
                                {receiveDoc2[0]?.Shipment
                                  ? fDate(new Date(receiveDoc2[0].ShipmentDate))
                                  : "No"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ width: "50%" }}>
                              Confirmation
                            </TableCell>
                            <TableCell>
                              <Typography>
                                {receiveDoc2[0]?.Confirmation
                                  ? fDate(
                                      new Date(receiveDoc2[0].ConfirmationDate)
                                    )
                                  : "No"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Divider />
                    {/* ---------------------------------------Table End ------------------ */}
                    <Timeline position="center">
                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          <Box>Order Date</Box>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="overline" display="block">
                            {fDate(receiveDoc.cutomerInfo.orderDate)}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                      {/* ------------------------- */}

                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          <Box>Start Production Date</Box>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography display="block">
                            {fDate(receiveDoc?.startProductionDate)}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                      {/* ------------------------- */}
                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          <Box>Cutting Date</Box>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          {receiveDoc.processing?.cuttingTrack ? (
                            receiveDoc?.processing.cuttingTrack
                              .filter((item) => item.GarmentId === search)
                              .map((block) => (
                                <Typography display="block">
                                  {fDate(block.DateTime)}
                                </Typography>
                              ))
                          ) : (
                            <Typography display="block">-</Typography>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                      {/* ------------------------- */}
                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          <Box>Stiching Date </Box>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          {receiveDoc.processing?.stichingTrack ? (
                            receiveDoc?.processing.stichingTrack
                              .filter((item) => item.GarmentId === search)
                              .map((block) => (
                                <Typography display="block">
                                  {fDate(block.DateTime)}
                                </Typography>
                              ))
                          ) : (
                            <Typography display="block">-</Typography>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                      {/* ------------------------- */}
                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          <Box>Quality Date -</Box>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          {receiveDoc.processing?.qualityTrack ? (
                            receiveDoc?.processing.qualityTrack
                              .filter((item) => item.GarmentId === search)
                              .map((block) => (
                                <Typography display="block">
                                  {fDate(block.DateTime)}
                                </Typography>
                              ))
                          ) : (
                            <Typography display="block">-</Typography>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                      {/* ------------------------- */}
                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          <Box>Packing Date</Box>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          {receiveDoc.processing?.packingTrack ? (
                            receiveDoc?.processing.packingTrack
                              .filter((item) => item.GarmentId === search)
                              .map((block) => (
                                <Typography display="block">
                                  {fDate(block.DateTime)}
                                </Typography>
                              ))
                          ) : (
                            <Typography display="block">-</Typography>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                      {/* ------------------------- */}
                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          <Box>Delivery Date</Box>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography display="block">
                            {fDate(receiveDoc?.processing.deliveredDate)}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                      {/* ------------------------- */}
                    </Timeline>
                  </Paper>
                </>
              )}
            </Grid>
          </>
        ) : receiveDoc === "Request failed with status code 400" ? (
          <Grid item xs={12}>
            {" "}
            <Alert severity="error">Error, not found</Alert>
          </Grid>
        ) : (
          ""
        )}
      </Grid>
    </Container>
  );
}
