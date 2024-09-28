import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Link as routerLink, useNavigate } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";

// -----
import { collection, getDocs, query, where } from "firebase/firestore";
import Page from "src/components/Page";
import { db } from "src/firebase/Config";
import { CloseIcon } from "src/theme/overrides/CustomIcons";
import { useDispatch, useSelector } from "react-redux";
import { EditManufacturer } from "src/redux/action/Action";
import { paramCase } from "change-case";
// ----------------------------------------
// -------------------------------------
export default function Manufacturer() {
  const [manufacturer, setManufacturer] = useState([]);
  const [singleManufacturer, setSingleManufacturer] = useState("");
  const [specificOrder, setSpecificOrder] = useState([]);
  const [isloading, seIsloading] = useState(true);
  const [loadingSpecificOrder, setLoadingSpecificOrder] = useState(false);
  const [open, setOpen] = useState(false);
  // ----
  const user = useSelector((state) => state.AuthUser.user.email);
  // ---
  // ------------------------dialoge
  const handleClickOpen = (item) => {
    debugger;
    setSingleManufacturer(item.company);
    setOpen(true);
    handleCorrespondingOrder(item);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // --------------------
  const handleCorrespondingOrder = async (item) => {
    setLoadingSpecificOrder(true);
    debugger;
    const que = item.employeeId;
    let orders = [];
    const q = query(
      collection(db, "orders"),
      where("manufacturer.Id", "==", que),
      where("email", "==", user)
    );
    const querymanufacturerOrders = await getDocs(q);
    querymanufacturerOrders.forEach((doc) => {
      const data = doc.data();
      orders.push(data);
    });
    setSpecificOrder(orders);
    setLoadingSpecificOrder(false);
  };

  // ------------------

  const fetchManufacturer = async () => {
    seIsloading(true);
    const manufacturer = [];
    const q = query(
      collection(db, "users"),
      where("role", "==", "manufacturer")
    );
    const querymanufacturer = await getDocs(q);
    querymanufacturer.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      manufacturer.push(data);
    });
    setManufacturer(manufacturer);
    seIsloading(false);
  };

  useEffect(() => {
    fetchManufacturer();
  }, []);
  // ------------------------------------------------
  const navigate = useNavigate();
  const handleDetail = (order) => {
    navigate(`order-detail/${order.orderId}`);
  };
  // ------------------Handle Edit Or Update Manufacturer
  const dispatch = useDispatch();
  const handleEdit = (item) => {
    dispatch(EditManufacturer(item));
    navigate(`/dashboard/edit/${paramCase(item.company)}`);
  };
  return (
    <div>
      <Page title="Manufacturers list">
        <Container>
          <HeaderBreadcrumbs
            heading={"Manufacturers"}
            links={[
              { name: "Dashboard", href: "/dashboard" },
              { name: "Manufacturers", href: "/dashboard/Manufacturer" },
            ]}
            action={
              <Button
                variant="contained"
                component={routerLink}
                to="/dashboard/create-new-manufacturer"
              >
                Create New Manufacturer
              </Button>
            }
          />

          {/* ------------------------------------------------------------------ */}
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <TableContainer>
                <Table sx={{ width: 1 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Companies </TableCell>
                      <TableCell>Company Address </TableCell>
                      <TableCell> - </TableCell>
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
                      manufacturer.map((item) => (
                        <TableRow>
                          <TableCell>
                            <Link
                              href="javascript:void(0)"
                              underline="hover"
                              onClick={() => handleEdit(item)}
                            >
                              {item.company}
                            </Link>
                          </TableCell>
                          <TableCell>{item.address} </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => handleClickOpen(item)}
                            >
                              Show Orders
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
        {/* ---------------------Dialoge Box -------------------------- */}
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={open}
          onClose={handleClose}
        >
          <DialogTitle id="id">
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>Details</Box>
              <Box>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <TableContainer>
            <Table sx={{ tableLayout: "auto", whiteSpace: "nowrap" }}>
              <TableHead>
                <TableRow>
                  <TableCell>#Orders Id</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Order Value</TableCell>
                  <TableCell>Product Quantity</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingSpecificOrder ? (
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : specificOrder.length >= 0 ? (
                  specificOrder?.map((order) => (
                    <TableRow>
                      <TableCell
                        component={routerLink}
                        to={`/dashboard/order-detail/${order?.orderId}`}
                      >
                        <Link href="javascript:void(0)" underline="hover">
                          {order?.orderId}
                        </Link>
                      </TableCell>
                      <TableCell>{order?.customerInfo.Order_Date}</TableCell>
                      <TableCell>{order?.product}</TableCell>
                      <TableCell>${order?.orderValue}</TableCell>
                      <TableCell>{order?.productQuantity}</TableCell>
                      <TableCell>
                        {order.Accept === undefined && (
                          <Button variant="text" color="primary" size="small">
                            In Review
                          </Button>
                        )}
                        {order.Accept === false && (
                          <Button variant="text" color="error" size="small">
                            Declined
                          </Button>
                        )}
                        {order.Accept === true &&
                        order.processing?.delivered === false ? (
                          <Button variant="text" color="success" size="small">
                            In Production
                          </Button>
                        ) : order.Accept === true &&
                          order.processing?.delivered === true ? (
                          <Button variant="text" color="secondary">
                            <CheckIcon /> Delivered
                          </Button>
                        ) : order.Accept === true &&
                          order?.processing === undefined ? (
                          <Button variant="text" color="success" size="small">
                            Start Production
                          </Button>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  ""
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Dialog>
      </Page>
    </div>
  );
}
