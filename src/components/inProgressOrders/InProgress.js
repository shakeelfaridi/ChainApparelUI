import {
  Button,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { TableSkeleton } from "../table";
import { Link as routerLink } from "react-router-dom";
import { SignalCellularAlt } from "@mui/icons-material";

export default function InProgress({ processingOrders, isloading }) {
  const inProductions = processingOrders.filter((order) => order.processing);

  return (
    <>
      <Grid item xs={12}>
        <Card>
          {/* Table Container Starts */}
          <TableContainer sx={{ padding: "10px" }}>
            <Table>
              {/* Table Head Starts */}
              <TableHead>
                <TableRow>
                  <TableCell>#order-id</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Product Quantity</TableCell>
                  <TableCell>Track Order Progress</TableCell>
                </TableRow>
              </TableHead>
              {/* Table Body */}
              <TableBody>
                {isloading && (
                  <>
                    <TableSkeleton />
                    <TableSkeleton />
                    <TableSkeleton />
                  </>
                )}
                {!isloading &&
                  inProductions.map((item) => (
                    <TableRow>
                      <TableCell
                        style={{ textDecoration: "none" }}
                        component={routerLink}
                        scope="row"
                        to={`/dashboard/order-detail/${item?.orderId}`}
                      >
                        <Link href="javascript:void(0)"> {item.orderId}</Link>
                      </TableCell>
                      <TableCell>{item.userName}</TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.productQuantity}</TableCell>
                      <TableCell
                        style={{ textDecoration: "none" }}
                        component={routerLink}
                        scope="row"
                        to={`/dashboard/tracking/${item?.orderId}`}
                      >
                        <Button
                          variant="contained"
                          endIcon={<SignalCellularAlt />}
                        >
                          Track
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </>
  );
}
