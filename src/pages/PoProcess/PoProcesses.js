import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
// ------------------------
import { useEffect, useState } from "react";
import Page from "src/components/Page";
import PoProcessing from "src/components/poProcessing/PoProcessing";
//  ----------------------  Firebase
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "src/firebase/Config";
import LoadingButton from "src/theme/overrides/LoadingButton";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD } from "src/routes/paths";
import { fCurrentDate, fDate } from "src/utils/formatTime";
import { useSelector } from "react-redux";
import { firebaseGetWithQuery } from "src/utils/firebaseGetWithQuery";
import axios from "axios";
import { useSnackbar } from "notistack";
import useLoggedUser from "src/utils/loggedUser";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PoProcesses() {
  const [processing, setProcessing] = useState({
    Cutting: "pending",
    Stiching: "",
    Quality: "",
    Packing: "",
    delivered: false,
  });
  const [assigning, setAssigning] = useState({
    Cutting: "",
    Stiching: "",
    Quality: "",
    Packing: "",
  });
  const [inAnalysis, setInAnalysis] = useState([]);
  const [newStage, setNewStage] = useState();
  const [employee, setEmployee] = useState([]);
  const [isloading, setIsloading] = useState(true);
  // Filtering employee by their Worker Role
  const [cutting, setCutting] = useState([]);
  const [stiching, setStiching] = useState([]);
  const [quality, setQuality] = useState([]);
  const [packing, setPacking] = useState([]);
  // For Modal Opening & closing
  const [open, setOpen] = useState(false);
  const [poId, setPoId] = useState({});
  const [iserror, setIserror] = useState(false);
  // -----------------------
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingprocessing, setPendingprocessing] = useState([]);
  // -------------------------------
  const handleOpen = (item) => {
    setNewStage(item);
    setPoId(item.orderId);

    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  // ------------------------------------------------------

  const user = useSelector((state) => state.AuthUser.userRole);
  const fetchpendingProcessOrders = async () => {
    setIsloading(true);
    const company = user.company;
    await firebaseGetWithQuery("orders", "manufacturer", company).then(
      (res) => {
        setPendingprocessing(res);
        setIsloading(false);
      }
    );
  };

  useEffect(() => {
    fetchpendingProcessOrders();
  }, []);


  const logged = useSelector((state) => state.AuthUser.userRole);
  const fetechAnalysedOrder = async () => {
    const company = logged.employeeId;
    await firebaseGetWithQuery("orders", "manufacturer.Id", company).then(
      (res) => {
        setInAnalysis(res);
        setIsloading(false);
      }
    );

    setIsloading(false);
  };
  // --------------------------------------------------------------

  const fetchEmployee = async () => {
    let employee = [];
    const workerRef = collection(db, "users");

    const q = query(
      workerRef,
      where("role", "==", "worker"),
      where("companyId", "==", logged.employeeId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();
      employee.push(data);
    });
    console.log("employees", employee);
    setEmployee(employee);
    filteringEmployeeRole(employee);
  };

  const filteringEmployeeRole = (employee) => {
    const cutRole = employee.filter(
      (employee) => employee.UserRole === "Cutting"
    );
    setCutting(cutRole);

    const stichingRole = employee.filter(
      (employee) => employee.UserRole === "Stiching"
    );

    setStiching(stichingRole);
    const qualityRole = employee.filter(
      (employee) => employee.UserRole === "Quality"
    );
    setQuality(qualityRole);

    const packRole = employee.filter(
      (employee) => employee.UserRole === "Packing"
    );

    setPacking(packRole);
  };
  // ------------------Sending Data to firebase-----------------------------------------------
  const { enqueueSnackbar } = useSnackbar();
  const handleProcessing = async (e) => {
    const inProductionDate =  new Date().toUTCString();
    e.preventDefault();
    setDisabled(true);
    setLoading(true);
    const { id, orderId, startProductionDate } = newStage;
    const { Cutting, Stiching, Quality, Packing } = assigning;

    if (
      Cutting.length > 0 &&
      Stiching.length > 0 &&
      Quality.length > 0 &&
      Packing.length > 0
    ) {
      try {
        setIserror(false);
        const options = {
          url: `https://api.chainapparel.net/api/order-process/${orderId}`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          data: {
            Cutting: Cutting,
            Stiching: Stiching,
            Quality: Quality,
            Packing: Packing,
            inProductionDate: inProductionDate,
          },
        };
        axios(options)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        await setDoc(
          doc(db, "orders", id),
          {
            inProductionDate,
            processing,
            Cutting,
            Stiching,
            Quality,
            Packing,
          },
          { merge: true }
        );
        enqueueSnackbar("Updated!");
        setAssigning({});
        setInAnalysis([]);
        setOpen(false);
        setDisabled(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setIserror(true);
      enqueueSnackbar("Please Fill All Fields To Continue");
      // alert("");
    }
  };
  // -----------------------------------------------------------------

  useEffect(() => {
    fetechAnalysedOrder();
    fetchEmployee();
  }, [assigning]);

  // ----------------------------------------------------------
  const handleChange = (e) => {
    setAssigning({ ...assigning, [e.target.name]: e.target.value });
  };

  return (
    <Page title="Analysis Process">
      <Container fluid>
        <HeaderBreadcrumbs
          heading={"Start Po Processing"}
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },

            {
              name: "Processing",
              href: PATH_DASHBOARD.general.processing,
            },
          ]}
        />
        <PoProcessing
          Paper={Paper}
          isloading={isloading}
          inAnalysis={inAnalysis}
          handleOpen={handleOpen}
        />
        {/* /-------------------Open Modal Box----------------------/ */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} component="form" onSubmit={handleProcessing}>
            {" "}
            {iserror && (
              <Alert variant="outlined" severity="error">
                Please Fill All Fields — check it out!
              </Alert>
            )}
            <Typography id="modal-modal-title" variant="h6" component="h3">
              #{poId}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Assign Tasks
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{ mt: "5px" }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={6} md={6} lg={6}>
                {" "}
                <Typography variant="h6" color="initial">
                  Cutting
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Employee
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={assigning?.Cutting}
                    label="Cutting"
                    name="Cutting"
                    onChange={handleChange}
                  >
                    {cutting.length > 0 &&
                      cutting.map((item) => (
                        <MenuItem value={item.employeeId}>
                          {item.displayname}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ mt: "5px" }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={6} md={6} lg={6}>
                {" "}
                <Typography variant="h6" color="initial">
                  Stiching
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} lg={6}>
                {" "}
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Employee
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={assigning?.Stiching}
                    name="Stiching"
                    label="Stiching"
                    onChange={handleChange}
                  >
                    {stiching.length >= 0 &&
                      stiching.map((item) => (
                        <MenuItem value={item.employeeId}>
                          {item.displayname}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ mt: "5px" }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={6} md={6} lg={6}>
                <Typography variant="h6" color="initial">
                  Quality
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Employee
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={assigning?.Quality}
                    name="Quality"
                    label="Quality"
                    onChange={handleChange}
                  >
                    {quality.length > 0 &&
                      quality.map((item) => (
                        <MenuItem value={item.employeeId}>
                          {item.displayname}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ mt: "5px" }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={6} md={6} lg={6}>
                {" "}
                <Typography variant="h6" color="initial">
                  Packing
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} lg={6}>
                {" "}
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Employee
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="Packing"
                    value={assigning?.Packing}
                    label="Packing"
                    onChange={handleChange}
                  >
                    {packing.length > 0 &&
                      packing.map((item) => (
                        <MenuItem value={item.employeeId}>
                          {item.displayname}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  // disabled={disabled}
                  // loading={loading}
                >
                  Process Now
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
        {/* /-------------------close Modal Box----------------------/ */}
      </Container>
    </Page>
  );
}
