import {
  Button,
  Chip,
  Container,
  Dialog,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

// -------------------------------------
import { Stack } from "@mui/system";
// import {
//   addDoc,
//   collection,
//   doc,
//   getDocs,
//   setDoc,
//   updateDoc,
//   arrayUnion,
// } from "firebase/firestore";
import { Check, MoreHoriz } from "@mui/icons-material";
import axios from "axios";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { db } from "src/firebase/Config";
import { firebaseGetWithQuery } from "src/utils/firebaseGetWithQuery";
import { fDate } from "src/utils/formatTime";
import useLoggedUser from "src/utils/loggedUser";
import { BLOCKCHAIN_API } from "src/config-global";
import LoadingScreen from "src/components/LoadingScreen";
import { LoadingButton } from "@mui/lab";
import LoadingSpinner from "src/components/LoadingSpinner";

export default function OrderToVendor() {
  const [pendingOrderToVendor, setPendingOrderToVendor] = useState([]);
  const [value, setValue] = useState(dayjs());
  const handleDateChange = (newValue) => {
    const format = newValue.format("MM/DD/YYYY");
    setValue(newValue);
  };

  const user = useLoggedUser();

  const [isLoading, setIsLoading] = useState(false);

  const [list, setList] = useState({});
  const [res, setRes] = useState([]);
  // const [, set] = useState();
  const [modal, setModal] = useState();
  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState();
  const [order, setOrder] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchOrder = async () => {
    const q = query(
      collection(db, "orders"),
      where("manufacturer.Company", "==", user.company)
    );

    try {
      const querySnapshot = await getDocs(q);

      const updatedDocuments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      debugger;
      // if any order is selected
      if (list?.id) {
        await firebaseGetWithQuery(
          "vendorOrders",
          "orderId",
          list?.orderId
        ).then((res) => setRes(res));
        const view = updatedDocuments.find(
          (item) => item.orderId === list?.orderId
        );

        setList(view);
      }
      setPendingOrderToVendor((prev) => [...updatedDocuments]);
    } catch (error) {
      console.log("Error fetching orders:", error.message);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);

  const handleClickId = async (e) => {
    const value = e.target.value;
    await firebaseGetWithQuery("vendorOrders", "orderId", value).then((res) =>
      setRes(res)
    );
    const view = pendingOrderToVendor.find((item) => item.orderId === value);
    setList(view);
  };

  const handleclick = (key, value) => {
    handleClickOpen();
    setModal({ key, value });
  };
  const handleclickagain = (key, value, res) => {
    handleClickOpen();
    setModal({ key, value, res });
  };

  //
  const handleSendOrder = async () => {
   
    let key = modal?.key;
    setIsLoading(true);
    const id = modal?.res?.id;
    const date = fDate(value);
    const orderedDate = fDate();

    try {
      if (modal.res) {
        const options = {
          url: `${BLOCKCHAIN_API}/create-order`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          data: {
            orderId: list.orderId,
            material: {
              Material: modal.key,
              Quantity: quantity,
              OrderDate: new Date().toUTCString(),
              RequiredOrderDate: date,
            },
          },
        };

        const response = await axios(options);

        const id = modal?.res?.id;

        await setDoc(doc(db, "vendorOrders", id), {
          orderedDate: orderedDate,
          material: modal.key,
          vendor: modal.value.VendorId,
          quantity: quantity,
          requiredDelivery: date,
          manufacturer: user.company,
          shipAddress: user.address,
          orderId: list.orderId,
        });

        enqueueSnackbar("Order Sent. 👍");
        fetchOrder();
        setQuantity(0);
        setValue(dayjs());
        handleClose();
        setIsLoading(false);
      } else {
        const orderedDate = fDate();
        const options = {
          url: `${BLOCKCHAIN_API}/create-order`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          data: {
            orderId: list.orderId,
            material: {
              Material: modal.key,
              Quantity: quantity,
              OrderDate: orderedDate,
              RequiredOrderDate: date,
            },
          },
        };

        const response = await axios(options);

        await setDoc(
          doc(db, "orders", list.id),
          {
            orderedMaterial: arrayUnion(key),
            orderedMaterialData: {
              [key]: quantity,
              [key + "Date"]: date,
              [key + "orderedDate"]: orderedDate,
            },
          },
          { merge: true }
        );

        await addDoc(collection(db, "vendorOrders"), {
          material: modal.key,
          orderedDate: orderedDate,
          vendor: modal.value.VendorId,
          quantity: quantity,
          requiredDelivery: date,
          manufacturer: user.company,
          shipAddress: user.address,
          orderId: list.orderId,
        });

        enqueueSnackbar("Order Sent. 👍");
        fetchOrder();
        setQuantity(0);
        setValue(dayjs());
        handleClose();
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      // Handle the error here, e.g., show an error message to the user or log it.
      enqueueSnackbar("Error sending order. 😞");
      setIsLoading(false);
    }
  };

  // ------------------------
  const { enqueueSnackbar } = useSnackbar();
  const handleConfirmDelivery = async (res) => {
    console.log("im run. confirm");
    setIsLoading(true);
    try {
      const options = {
        url: `${BLOCKCHAIN_API}/confirmation`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
          orderId: res.orderId,
        },
      };
      await axios(options)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      await setDoc(
        doc(db, "vendorOrders", res.id),
        {
          orderReceived: true,
        },
        { merge: true }
      );

      fetchOrder();
      enqueueSnackbar("Delivery Confirmed 👍");
    } catch (error) {
      console.log("🚀 ~ handleConfirmDelivery ~ error:", error);
    } finally{
      setIsLoading(false

      );
    }
  };
  return (
    <Page title="Supplier Orders">
      {isLoading && <LoadingSpinner/>}
      <Container>
        <HeaderBreadcrumbs
          heading={"Supplier Orders"}
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Supplier Orders", href: "/dashboard/material-orders" },
          ]}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack spacing={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">#Order Id</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  // value={product}
                  label="#Order Id"
                  onChange={(e) => handleClickId(e)}
                >
                  {pendingOrderToVendor?.map((order) => (
                    <MenuItem value={order?.orderId}>{order?.orderId}</MenuItem>
                  ))}
                  {/* {productList[0]?.products?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))} */}
                </Select>
              </FormControl>
              {/* ------------------------------------------------------- */}
              {/* Table */}
              {Object.keys(list).length > 0 && (
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
                        <TableCell>Sr #</TableCell>
                        <TableCell>Materials</TableCell>
                        <TableCell>Supplier</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Expected Delivery</TableCell>
                        <TableCell>- / Ordered Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(list?.materialRequirement).map(
                        ([key, value], i) => (
                          <TableRow>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{key}</TableCell>
                            <TableCell>{value?.Vendor}</TableCell>
                            <TableCell>
                              {list.orderedMaterialData
                                ? list.orderedMaterialData[key]
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {list.orderedMaterialData
                                ? list.orderedMaterialData[key + "Date"]
                                : "-"}
                            </TableCell>

                            <TableCell>
                              {list.orderedMaterial?.includes(key) === false ||
                              list.orderedMaterial?.includes(key) ===
                                undefined ? (
                                <Button
                                  variant="contained"
                                  onClick={(e) => handleclick(key, value)}
                                >
                                  Place Order
                                </Button>
                              ) : (
                                // <FileDownloadDone color="success" />
                                list.orderedMaterialData[key + "orderedDate"]
                              )}
                            </TableCell>

                            <TableCell>
                              {res
                                ?.filter((obj) => obj.material === key)
                                ?.map((res) =>
                                  res.ShipmentDate !== undefined &&
                                  res.orderReceived === undefined ? (
                                    <Button
                                      variant="contained"
                                      color="info"
                                      onClick={() => handleConfirmDelivery(res)}
                                    >
                                      Confirm Delivery
                                    </Button>
                                  ) : res.orderReceived === true ? (
                                    <Chip
                                      icon={<Check />}
                                      label={res.ShipmentDate}
                                    />
                                  ) : res.Accepted === false ? (
                                    <Button
                                      variant="contained"
                                      onClick={(e) =>
                                        handleclickagain(key, value, res)
                                      }
                                    >
                                      Order Again
                                    </Button>
                                  ) : res.Accepted === true ? (
                                    <Chip icon={<Check />} label="Accepted" />
                                  ) : (
                                    <Chip
                                      icon={<MoreHoriz />}
                                      label="pending"
                                    />
                                  )
                                )}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Materials</TableCell>
                        <TableCell>Vendors</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Required Delevery Date</TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
                <TableBody>
                  <TableRow>
                    <TableCell>{modal?.key}</TableCell>
                    <TableCell>{modal?.value?.Vendor}</TableCell>
                    <TableCell>
                      <TextField
                        id="standard-basic"
                        size="small"
                        type="number"
                        label="Quantity"
                        variant="standard"
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label="Delivery Date"
                          inputFormat="DD-MM-YYYY"
                          value={value}
                          onChange={handleDateChange}
                          handleDateChange
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </TableCell>
                  </TableRow>
                </TableBody>

                <LoadingButton
                  loading={isLoading}
                  onClick={() => handleSendOrder()}
                  variant="contained"
                >
                  Place Order
                </LoadingButton>
              </Dialog>

              {/* --------------------------------------- */}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
