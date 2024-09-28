import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  TextField,
  Divider,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  List,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// routes
// components
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../../components/hook-form";
import { AddCircle, Image, PhotoCamera, Summarize } from "@mui/icons-material";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useTheme } from "@emotion/react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "src/firebase/Config";
import useLoggedUser from "src/utils/loggedUser";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [names, setNames] = useState([]);
  const [MaterialInfo, setMaterialInfo] = useState([]);
  const [brands, setBrands] = useState([]);
  const [addNewBrandName, setAddNewBrandName] = useState("");
  const [newMaterialName, setNewMaterialName] = useState("");
  const [modaltobeopen, setModaltobeopen] = useState();

  const handleClickOpen = (event) => {
    setOpen(true);
    setModaltobeopen(event);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // -------------------------------------
  const user = useLoggedUser();
  const handleAddBrand = async (section) => {
    if (section === "brandname") {
      const docRef = await addDoc(collection(db, "products"), {
        BrandName: addNewBrandName,
        products: [],
        customerId: user.employeeId,
      });
      fetchBrands();
      setOpen(false);
      setAddNewBrandName("");
      console.log("Document written with ID: ", docRef.id);
    } else if (section === "material") {
      const productRef = doc(db, "materials", "uBli1imhaW1wVs2Fpjt3");
      await updateDoc(productRef, {
        materials: arrayUnion(newMaterialName),
      });
      fetchBrands();
      setOpen(false);
      setNewMaterialName("");
    }
  };
  // -------------------------------------
  const fetchBrands = async () => {
    let array = [];
    const q = query(
      collection(db, "products"),
      where("customerId", "==", user.employeeId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      array.push(data);
    });
    setBrands(array);
    let materials = [];
    const querySnap = await getDocs(collection(db, "materials"));
    querySnap.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      materials.push(data);
    });
    console.log(materials[0].materials);
    setNames(materials[0].materials);
  };
  useEffect(() => {
    fetchBrands();
  }, []);
  // -------------------------------
  // multi select
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMaterialInfo(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    ProductName: Yup.string().required("Product Name is required"),
    BrandName: Yup.string().required("Brand Name Name is required"),
  });

  const defaultValues = useMemo(
    () => ({
      ProductName: currentProduct?.ProductName || "",
      BrandName: currentProduct?.BrandName || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // useEffect(() => {
  //   if (isEdit && currentProduct) {
  //     reset(defaultValues);
  //   }
  //   if (!isEdit) {
  //     reset(defaultValues);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isEdit, currentProduct]);

  const onSubmit = async (e) => {
    const { ProductName, BrandName } = values;

    try {
      const productRef = doc(db, "products", BrandName);

      await updateDoc(productRef, {
        products: arrayUnion(ProductName),
      });
      await addDoc(collection(db, "materialInfo"), {
        MaterialInfo: MaterialInfo,
        ProductName: ProductName,
        employeeId: user.employeeId,
      });

      // MaterialInfo
      reset();
      // setBrandName("");
      // materialinfor is the all selected material that used in product
      setMaterialInfo([]);
      enqueueSnackbar(!isEdit ? "Create success!" : "Update success!");
    } catch (error) {
      console.error(error);
    }
  };
  //

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField
                  name="ProductName"
                  size="smal"
                  label="Product Name"
                />

                <Stack direction="row" spacing={2}>
                  <Grid item xs={11}>
                    <RHFSelect
                      name="BrandName"
                      size="smal"
                      label="Brand Name"
                      // onChange={(e) => setBrandName(e.target.value)}
                    >
                      <option value={""}></option>
                      {brands?.map((size) => (
                        <option value={size.id}>{size.BrandName}</option>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpen("brandname")}
                    >
                      <AddCircle />
                    </IconButton>
                  </Grid>
                </Stack>

                <Divider />
                <Stack direction="row" spacing={2}>
                  <Grid item xs={11}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-chip-label">
                        Materials
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={MaterialInfo}
                        onChange={handleChange}
                        input={
                          <OutlinedInput
                            id="select-multiple-chip"
                            label="Chip"
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {names.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, MaterialInfo, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpen("material")}
                    >
                      <AddCircle />
                    </IconButton>
                  </Grid>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
              >
                {!isEdit ? "Create Product" : "Save Changes"}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
      <Dialog
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {modaltobeopen === "brandname" ? (
          <>
            <DialogTitle id="alert-dialog-title">Add New Brand</DialogTitle>
            <TextField
              sx={{ width: 1 }}
              value={addNewBrandName}
              id="newBrandName"
              name="newBrandName"
              label="Add New Brand Name"
              onChange={(e) => setAddNewBrandName(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={() => handleAddBrand("brandname")}
                  >
                    <AddCircle />
                  </IconButton>
                ),
              }}
            />
          </>
        ) : (
          <>
            <DialogTitle id="alert-dialog-title">Add New Material</DialogTitle>
            <TextField
              sx={{ width: 1 }}
              value={newMaterialName}
              id="newBrandName"
              name="newMaterialName"
              label="Add New Material"
              onChange={(e) => setNewMaterialName(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={() => handleAddBrand("material")}
                  >
                    <AddCircle />
                  </IconButton>
                ),
              }}
            />
          </>
        )}
      </Dialog>
    </Container>
  );
}
