import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormProvider from "src/components/hook-form/FormProvider";
import Swal from "sweetalert2";
import * as Yup from "yup";
// Redux
import { useSelector } from "react-redux";
// component
import Page from "../../components/Page";
// MUI
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// firestore
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, storage } from "src/firebase/Config";
// -----------------------------------
import { Check, Close } from "@mui/icons-material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD } from "src/routes/paths";
import MaterialInfoInput from "./materialInfoInput";
// formated time
import { LoadingButton } from "@mui/lab";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { RHFUploadSingleFile } from "src/components/hook-form";
import { fDate,fCurrentDate,fTimestamp } from "src/utils/formatTime";
import useLoggedUser from "src/utils/loggedUser";
import { useNavigate } from "react-router";
// ---------------------------------
export default function SubmitOrder() {
  const initialstate = {
    Phone_Number: "",
    Order_Date: new Date().toUTCString(),
  };
  function setorderid() {
    const date = new Date();
    const components = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ];

    const id = components.join("");
    return id;
  }
  // import user from reduc
  const user = useSelector((state) => state.AuthUser.userRole);
  // is loading state
  const [fetchloading, setFetchloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadprogress, setuploadprogress] = useState(0);
  const [uploading, setuploading] = useState(false);
  // order information
  const [selectedmanufacturer, setSelectedmanufacturer] = useState("");
  const [selectedManufacturerCompany, setSelectedManufacturerCompany] =
    useState("");
  const [productStyleNo, setProductStyleNo] = useState("");
  const [orderId, setOrderId] = useState(setorderid());
  const [customerInfo, setCustomerInfo] = useState(initialstate);
  const [brandName, setBrandName] = useState("");
  const [product, setProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [materialInfo, setMaterialInfo] = useState({});
  const [orderValue, setOrderValue] = useState(0);
  const [productCodes, setProductCodes] = useState([]);
  const [productUrl, setproductUrl] = useState("");

  // -------------------------------------------------------------------------
  const [manufacturers, setManufacturers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [productList, setProductList] = useState([]);
  const [materialRequirement, setMaterialRequirement] = useState("");
  // error handling
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // -----------------
  const email = user.email;
  const id = user.uid;
  const userName = user.fname;
  const ShipAddress = user.address;
  // ----------------------UseEffect For Get All brands with its products

  const fetchDocuments = async () => {
    setFetchloading(true);
    const manufacturer = [];
    const q = query(
      collection(db, "users"),
      where("role", "==", "manufacturer")
    );
    const querymanufacturer = await getDocs(q);
    querymanufacturer.forEach((doc) => {
      let data = doc.data();
      manufacturer.push(data);
    });
    setManufacturers(manufacturer);
    // -----------------------------------
    let array = [];
    const q2 = query(
      collection(db, "products"),
      where("customerId", "==", user.employeeId)
    );
    const querySnapshot = await getDocs(q2);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      array.push(data);
    });
    setDocuments(array);
    setFetchloading(false);
  };
  useEffect(() => {
    fetchDocuments();
    return () => {
      fetchDocuments();
    };
  }, []);

  // ----------------------UseEffect For Get All brands with its products

  function inputchange(e) {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    setError(false);
  }
  function handleBrand(e) {
    let value = e.target.value;
    setBrandName(e.target.value);
    let products = documents.filter((item) => item.BrandName === value);
    setProductList(products);
  }
  // Uploade product image
  const ImageSchema = Yup.object().shape({
    producturl: Yup.mixed().test(
      "required",
      "Product Image is required",
      (value) => value !== ""
    ),
  });

  const defaultValues = useMemo(
    () => ({
      producturl: productUrl || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productUrl]
  );
  const methods = useForm({
    resolver: yupResolver(ImageSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setuploading(true);
    if (file) {
      setValue(
        "producturl",
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }
    const randomId = Math.random().toString(36).slice(2);
    // const { Producturl } = values;
    const ext = file.name.split(".").pop();
    const storageRef = ref(storage, `products/${randomId}.${ext}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setuploadprogress(progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setproductUrl(downloadURL);
          setLoading(false);
          setuploading(false);
        });
      }
    );
  };
  // Submit Order to database
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
  async function onSubmit(e) {
    e.preventDefault();

    let productcodes = [];
    for (let index = 1; index <= productQuantity; index++) {
      productcodes.push(orderId + "-" + index);
    }

    setLoading(true);
    const { Phone_Number, Order_Date } = customerInfo;
    const manufacturer = selectedmanufacturer;

    if (productUrl === "" || productUrl === null) {
      Toast.fire({
        icon: "error",
        title: "Please Upload product image",
      });
      setLoading(false);
      return;
    }
    if (
      Phone_Number.length > 0 &&
      productQuantity > 0 &&
      orderValue > 0 &&
      brandName.length > 0 &&
      product.length > 0 &&
      Object.keys(materialRequirement).length > 0
    ) {
      // Add a new document in collection "order"
      await addDoc(collection(db, "orders"), {
        created_at: new Date().toUTCString(),
        manufacturer,
        productUrl,
        productcodes,
        ShipAddress,
        orderId,
        orderValue,
        productQuantity,
        customerInfo,
        product,
        brandName,
        materialRequirement,
        email,
        userName,
        productStyleNo,
      });

      // Resetting all states after successful submission
      setCustomerInfo(initialstate);
      setSelectedmanufacturer("");
      setSelectedManufacturerCompany("");
      setProductStyleNo("");
      setProduct("");
      setBrandName("");
      setProductQuantity(0);
      setMaterialInfo({});
      setOrderValue(0);
      setProductCodes([]);
      setproductUrl("");
      reset(); // Resetting fields managed by react-hook-form

      Toast.fire({
        icon: "success",
        title: "Your Order Is Successfull",
      });

      navigate("/dashboard/orderHistory"); // PUSH, navigate
    } else {
      setError(true);
    }
    setLoading(false);
  }

  // Materila Info Extrcactor
  async function fetchMaterialInfo(e) {
    setProduct(e.target.value);
    let material = e.target.value;

    const q = query(
      collection(db, "materialInfo"),
      where("ProductName", "==", material),
      where("employeeId", "==", user.employeeId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let Materialdata = doc.data();
      // doc.data() is never undefined for query doc snapshot

      setMaterialInfo(Materialdata.MaterialInfo);
    });
  }

  // Hanlde select manufactuere with their Id
  const handleSelectManufacturer = (e) => {
    const { value } = e.target;
    // console.log({Company:value.company,Id:value.employeeId})

    setSelectedManufacturerCompany(value.company);
    setSelectedmanufacturer({
      Company: value.company,
      Id: value.employeeId,
      MadeIn: value.madein,
    });
  };

  return (
    <>
      <Page title="Order Product">
        <Container>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={12} lg={12}>
              <HeaderBreadcrumbs
                heading={"Submit A New Order"}
                links={[
                  { name: "Dashboard", href: PATH_DASHBOARD.root },
                  { name: "New Order", href: PATH_DASHBOARD.general.order },
                ]}
              />
              {error && (
                <Alert variant="standard" severity="error">
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setError(false);
                    }}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                  Please Fill All Field — check it out!
                </Alert>
              )}
            </Grid>
          </Grid>

          <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
              <Grid item xs={12} md={4} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Manufacturers
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={selectedManufacturerCompany}
                    label="manufacturer"
                    onChange={(e) => handleSelectManufacturer(e)}
                  >
                    {fetchloading ? (
                      <MenuItem>Loading...</MenuItem>
                    ) : (
                      manufacturers.map((brand) => (
                        <MenuItem value={brand}>{brand.company}</MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                {/* <TextField
                  sx={{ width: 1 }}
                  name="Address"
                  value={customerInfo.Address}
                  id="Address"
                  label="Ship Address"
                  onChange={inputchange}
                /> */}
                <TextField
                  sx={{ width: 1 }}
                  name="Style no."
                  value={productStyleNo}
                  id="style no."
                  label="Style no."
                  onChange={(e) => setProductStyleNo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Brands</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={brandName}
                    label="Brand"
                    onChange={(e) => handleBrand(e)}
                  >
                    {fetchloading && <MenuItem value={""}>Loading...</MenuItem>}
                    {documents &&
                      documents.map((brand) => (
                        <MenuItem value={brand.BrandName}>
                          {brand.BrandName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
              <Grid item xs={12} md={4} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Products
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={product}
                    label="Products"
                    onChange={(e) => fetchMaterialInfo(e)}
                  >
                    {productList[0]?.products?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <TextField
                  sx={{ width: 1 }}
                  value={orderValue}
                  id="orderValue"
                  type="number"
                  name="Order Value"
                  label="Order Value"
                  onChange={(e) => setOrderValue(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  // startAdornment={<InputAdornment position="start"></InputAdornment>}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <TextField
                  sx={{ width: 1 }}
                  value={productQuantity}
                  id="quantity"
                  type="number"
                  name="Product Quantity"
                  label="Product Quantity"
                  // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  inputProps={{ step: "1" }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val < 1000) {
                      setProductQuantity(e.target.value);
                    } else {
                      setProductQuantity(1000);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                {" "}
                <TextField
                  sx={{ width: 1 }}
                  value={customerInfo.Phone_Number}
                  id="Phone_Number"
                  name="Phone_Number"
                  label="Phone Number"
                  type="number"
                  onChange={inputchange}
                />{" "}
              </Grid>
            </Grid>
            <Grid
              container
              spacing={1}
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ marginBottom: "5px" }}
            >
              <Grid item xs={12} md={12} lg={12}>
                {materialInfo.length && (
                  <Typography variant="h5" color="initial" align={"center"}>
                    Materials & Supplier
                  </Typography>
                )}
              </Grid>
            </Grid>
            {/* Material And  List Their Vendors */}
            <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
              <MaterialInfoInput
                material={materialInfo}
                setMaterialRequirment={setMaterialRequirement}
                materialRequirement={materialRequirement}
              />
            </Grid>
            <FormProvider methods={methods}>
              <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
                <Grid item xs={12} md={12} lg={6}>
                  <Stack spacing={2}>
                    <Typography variant="h6">
                      {"Upload Product Style"}
                    </Typography>
                    <RHFUploadSingleFile
                      name="producturl"
                      accept="image/*"
                      maxSize={3145728}
                      onDrop={handleDrop}
                    />
                    {uploadprogress === 100 ? (
                      <Check m={2} />
                    ) : (
                      <CircularProgress
                        variant="determinate"
                        value={uploadprogress}
                      />
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </FormProvider>
            <Grid container spacing={3}>
              <Grid item>
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  disabled={uploading}
                  type="submit"
                >
                  Order Now
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Page>
    </>
  );
}
