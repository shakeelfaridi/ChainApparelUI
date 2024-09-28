import { useEffect, useState } from "react";
import { Link as routerLink } from "react-router-dom";
//    _________Sweat Alerts
import Swal from "sweetalert2";
// -----------MUI
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Card,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
// ___________________ Firestore ,, redux
import { LoadingButton } from "@mui/lab";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "src/firebase/Config";
import { firebaseGetWithQuery } from "src/utils/firebaseGetWithQuery";
import { fCurrentDate, fDate } from "src/utils/formatTime";
import { TableNoData } from "../table";
import axios from "axios";

// ----------------------------------------------------------------------

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [fetchAgain, setfetchAgain] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  //
  const [submitloading, setSubmitloading] = useState(false);
  //  _____________________NOTE: Fetching Orders from firebase
  const filterOrders = () => {
    const pendingorders = orders.filter(
      (document) => document.Accept !== true && document.Accept !== false
    );

    setPendingOrders(pendingorders);
  };
  const user = useSelector((state) => state.AuthUser.userRole);
  const fetchOrders = async () => {
    setIsLoading(true);

    const companyId = user.employeeId;
    const data = await firebaseGetWithQuery(
      "orders",
      "manufacturer.Id",
      companyId
    ).then((res) => {
     
      setOrders(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchAgain]);

  useEffect(() => {
    filterOrders();
  }, [orders]);

  //   ___________________________Accept Order Requirment
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  async function acceptHandler(order) {
    const { materialRequirement, manufacturer } = order;
    let array = [];
    const arr = Object.entries(materialRequirement);
    arr.map((item, i) =>
      array.push({
        Key: item[0],
        Value: item[1].Vendor,
        VendorId: item[1].VendorId,
      })
    );
   
    setSubmitloading(true);
    // --------------------------------
    let manufact = [];
    const brr = Object.entries(manufacturer);
    brr.map((item) => manufact.push({ Key: item[0], Value: item[1] }));

    const startProductionDate = new Date().toUTCString();
    const options = {
      url: "https://api.chainapparel.net/api/create-order",
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
        manufacturer: manufact,
        orderId: order.orderId,
        orderValue: order.orderValue,
        product: order.product,
        productQuantity: order.productQuantity,
        productStyleNo: order.productStyleNo,
        username: order.userName,
        phoneNumber: parseInt(order.customerInfo.Phone_Number),
        orderDate: order.customerInfo.Order_Date,
        materialReqirement: array,
        StartProductionDate: startProductionDate,
      },
    };
    axios(options)
      .then(async (response) => {
       
        // set Order Status On Offchain To True
        try {
          const id = order.id;
          const startProductionDate = new Date().toUTCString()
          const orderRef = doc(db, "orders", id);
          await setDoc(
            orderRef,
            { Accept: true, id, startProductionDate },
            { merge: true }
          );
          setfetchAgain(fetchAgain + 1);
          setSubmitloading(false);
          Swal.fire({
            position: "center",
            backdrop: `rgba(245, 245, 245,0.3)`,
            icon: "success",
            title: "Order Is Accepted",
            timer: 1500,
          });
        } catch (error) {
          console.log(error.code);
          Swal.fire({
            position: "center",
            backdrop: `rgba(245, 245, 245,0.3)`,
            icon: "error",
            title: "Error",
          });
        }
      })
      .catch((error) => {
        setSubmitloading(false);
        console.log(error.response.data.errors[0].msg);
        Toast.fire({
          icon: "error",
          title: "Something went wrong",
        });
      });
  }
  //   ___________________________Reject Order Requirment
  async function rejectHandler(id) {
    setSubmitloading(true);
    const orderRef = doc(db, "orders", id);
    await setDoc(orderRef, { Accept: false }, { merge: true });
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Order Is Declined",
      timer: 1500,
    });
    setfetchAgain(fetchAgain + 1);
    setSubmitloading(false);
  }

  // ---------------------------------------------------------------------------------
  return (
    <Card>
      <TableContainer component={Paper}>
        <Table
          sx={{ tableLayout: "auto", whiteSpace: "nowrap" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>#OrderId</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Brand Info</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Style No.</TableCell>
              {/* <TableCell >Address</TableCell> */}
              <TableCell>Quantity</TableCell>
              <TableCell>Order Value</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell align="center" colSpan={8}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : pendingOrders.length <= 0 ? (
              <TableNoData isNotFound={pendingOrders.length <= 0} />
            ) : (
              pendingOrders?.map((order) => {
                return (
                  <TableRow>
                    <TableCell
                      style={{ textDecoration: "none" }}
                      component={routerLink}
                      scope="row"
                      to={`/dashboard/order-detail/${order?.orderId}`}
                    >
                      {" "}
                      <Link href="javascript:void(0)"> {order.orderId}</Link>
                    </TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>{order.brandName}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.productStyleNo}</TableCell>
                    {/* <TableCell >
                      <Typography varient="subtitle">
                      {order.customerInfo?.Address}
                      </Typography>
                    </TableCell> */}
                    <TableCell>
                      <Typography varient="subtitle">
                        {order.productQuantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography varient="subtitle">
                        $ {order.orderValue}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography varient="subtitle">
                        {fDate(order.customerInfo?.Order_Date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order.Accept === undefined && (
                        <>
                          <LoadingButton
                            loading={submitloading}
                            variant="contained"
                            color="primary"
                            sx={{ m: "2px" }}
                            size="small"
                            onClick={() => acceptHandler(order)}
                          >
                            <CheckIcon /> Accept
                          </LoadingButton>
                          <LoadingButton
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => rejectHandler(order.id)}
                          >
                            <HighlightOffIcon /> Decline
                          </LoadingButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
