import React from "react";
import {
  Grid,
  Card,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Link,
} from "@mui/material";
import { Link as routerLink } from "react-router-dom";
import { TableNoData, TableSkeleton } from "../table";
import { fDate } from "src/utils/formatTime";
export default function PoProcessing({
  Paper,
  isloading,
  inAnalysis,
  map,
  item,
  handleOpen,
}) {
  const Analysis = inAnalysis.filter(
    (order) => order.processing === undefined && order.Accept === true
  );
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card
          sx={{
            py: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ tableLayout: "auto", whiteSpace: "nowrap" }}>
              <TableHead>
                <TableRow>
                  <TableCell>#Order id</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Brand Info</TableCell>
                  <TableCell>Ship Address</TableCell>
                  <TableCell>Products Quantity</TableCell>
                  <TableCell>Order Value</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Loading until document fetch */}

                {isloading ? (
                  <>
                    <TableSkeleton />
                    <TableSkeleton />
                    <TableSkeleton />
                    <TableSkeleton />
                  </>
                ) : Analysis.length <= 0 ? (
                  <TableNoData isNotFound={Analysis.length <= 0} />
                ) : (
                  Analysis?.map((item) => (
                    <TableRow>
                      <TableCell
                        style={{ textDecoration: "none" }}
                        component={routerLink}
                        scope="row"
                        to={`/dashboard/order-detail/${item?.orderId}`}
                      >
                        <Link href="javascript:void(0)"> {item.orderId}</Link>
                      </TableCell>
                      <TableCell align="left">{item.email}</TableCell>
                      <TableCell align="left">{item.userName}</TableCell>
                      <TableCell align="left">
                        {fDate(item.customerInfo.Order_Date)}
                      </TableCell>
                      <TableCell align="left">{item.brandName}</TableCell>
                      <TableCell align="left">{item.ShipAddress}</TableCell>
                      <TableCell align="center">
                        {item.productQuantity}
                      </TableCell>
                      <TableCell align="center">$ {item.orderValue}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => handleOpen(item)}
                        >
                          Process Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );
}
