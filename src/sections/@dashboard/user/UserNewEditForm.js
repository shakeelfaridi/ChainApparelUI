import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useCallback, useMemo } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
// utils
import { fData } from "../../../utils/formatNumber";
// routes
// _mock
import { genders } from "../../../_mock";
// components
import Label from "../../../components/Label";
import {
  FormProvider,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../components/hook-form";
// ----------------------------------------------------------------------
import { storage, db } from "src/firebase/Config";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { async } from "@firebase/util";
import countries from "src/utils/countries";
import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";
import { logoutUser } from "src/redux/action/Action";
import useLoggedUser from "src/utils/loggedUser";
// ----------------------------------------------------------------------
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

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};
export default function UserNewEditForm({ iscustomer, currentUser, isEdit }) {
  // USESTATE -       SETSTATE
  const [url, setUrl] = useState("");
  const [loading, setloading] = useState(false);
  const [materialsNames, setMaterialsNames] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  // const NewUserSchema = Yup.object().shape({
  //   gender: Yup.string().required("Gender is required"),
  //   first_name: Yup.string().required("First name is required"),

  //   // UserRole: Yup.string().required("WorkerRole are required"),
  //   company: Yup.string().required("Company is required"),
  //   email: Yup.string().email().required("Email Address is required"),
  //   // Address: Yup.string().required("Address is required"),
  //   password: Yup.string().min(6).required("password is required"),
  //   avatarUrl: Yup.mixed().test(
  //     "required",
  //     "Avatar is required",
  //     (value) => value !== ""
  //   ),
  // });
  const defaultValues = useMemo(
    () => ({
      displayname: currentUser?.displayname || "",
      UserRole: currentUser?.UserRole || "",
      role: currentUser?.role || "",
      fname: currentUser?.fname || "",
      last_name: currentUser?.last_name || "",
      password: currentUser?.password || "",
      birthdate: currentUser?.birthdate || "",
      gender: currentUser?.gender || "",
      email: currentUser?.email || "",
      avatarUrl: currentUser?.avatarUrl || "",
      company: currentUser?.company || "",
      address: currentUser?.address || "",
      website: currentUser?.website || "",
      provider: currentUser?.provider || "",
      madein: currentUser?.madein || "",
      madein: currentUser?.madein || "",
      id: currentUser?.id || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
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

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    fetchMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);
  // ----------------------------------- Create Or Update User
  const dispatch = useDispatch();
  const companyId = useLoggedUser();
  const onSubmit = async () => {
    debugger;
    const {
      email,
      password,
      UserRole,
      displayname,
      last_name,
      gender,
      birthdate,
      company,
      address,
      website,
      fname,
      materialProvider,
      madein,
      id,
    } = values;
    // let workingField = materialProvider.split(",");

    if (isEdit) {
      const userRef = doc(db, "users", id);
      await setDoc(
        userRef,
        {
          email,
          password,
          UserRole,
          displayname,
          last_name,
          gender,
          birthdate,
          company,
          address,
          website,
          fname,
          provider: selectedMaterial,
          madein,
          id,
        },
        { merge: true }
      );
      enqueueSnackbar("Updated");
      navigate(-1);
      // dispatch(logoutUser());
    } else {
      setloading(true);
      // destructring object to get values
      const randomId = Math.random().toString(36).slice(2);
      const employeeId = `emp - ${randomId}`;
      let uuid;
      let role = "";
      if (iscustomer === "/dashboard/create-new-manufacturer") {
        role = "manufacturer";
      } else if (iscustomer === "/dashboard/create-new-vendor") {
        role = "vendor";
      } else {
        role = "worker";
        // ---------------------
      }
      const options = {
        url: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAf7M0cqhwNfyKd1ErSZibeTzzbG7IWwy8",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
          email: email,
          password: password,
          returnSecureToken: true,
        },
      };
      axios(options)
        .then(async (response) => {
          uuid = response.data.localId;

          try {
            await setDoc(doc(db, "users", uuid), {
              company,
              website,
              url,
              employeeId,
              companyId: companyId.employeeId,
              role,
              email,
              password,
              UserRole,
              displayname,
              fname,
              last_name,
              address,
              gender,
              birthdate,
              provider: selectedMaterial,
              madein,
            });
            setloading(false);
            enqueueSnackbar("Create success!");
            reset();
          } catch (error) {
            setloading(false);
            console.log(
              "🚀 ~ file: New User / manufacturer ~ line 218 ~ onSubmit ~ error",
              error.message
            );
          }
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            position: "center",
            icon: "error",
            title: error.response.data.error.message,
          });
          setloading(false);
        });
    }
  };
  // ---------------------------- Handle Drop Image... Avatar ----------------------------------
  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setloading(true);
    const randomId = Math.random().toString(36).slice(2);
    if (file) {
      setValue(
        "avatarUrl",
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }

    const ext = file.name.split(".").pop();
    const storageRef = ref(storage, `images/${randomId}.${ext}`);
    try {
      await uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(storageRef).then((url) => {
          console.log(url);
          setUrl(url);
        });
        setloading(false);
      });
    } catch (error) {
      console.log(error.message);
      setloading(false);
    }
  };

  // --------------------FETCH ALL MATERIALS
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedMaterial(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const fetchMaterials = async () => {
    let materials = [];
    const querySnap = await getDocs(collection(db, "materials"));
    querySnap.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      materials.push(data);
    });
    console.log(materials[0].materials);
    setMaterialsNames(materials[0].materials);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {/* {isEdit && (
              <Label
                color={values.status !== "active" ? "error" : "success"}
                sx={{
                  textTransform: "uppercase",
                  position: "absolute",
                  top: 24,
                  right: 24,
                }}
              >
                {values.status}
              </Label>
            )} */}
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
            {/* <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email verification
                  </Typography>
                  {iscustomer ? (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Disabling this will automatically resend the user a
                      verification email.
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Enabling will automatically send the user a verification
                      email.
                    </Typography>
                  )}
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: "space-between" }}
            /> */}
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h4" marginBottom={4}>
              {iscustomer === "/dashboard/create-new-vendor"
                ? "Vendor information"
                : iscustomer === "/dashboard/create-new-manufacturer"
                ? "Company information"
                : ""}
              {/* ------ */}
              {currentUser?.role === "vendor" && "Vendor information"}
            </Typography>
            <Box
              sx={{
                display: "grid",
                columnGap: 2,
                rowGap: 3,
              }}
            >
              {iscustomer === "/dashboard/create-new-vendor" ? (
                <RHFTextField
                  name="company"
                  label="Vendor Name"
                  // disabled={iscustomer ? 1 : 0}
                />
              ) : (
                <RHFTextField
                  name="company"
                  label="Company Name"
                  // disabled={iscustomer ? 1 : 0}
                />
              )}

              {iscustomer === "/dashboard/create-new-manufacturer" && (
                <RHFTextField
                  name="website"
                  label="Company Website (optional)"
                  // disabled={iscustomer ? 1 : 0}
                />
              )}
              {isEdit && currentUser?.role !== "vendor" && (
                <RHFTextField
                  name="website"
                  label="Company Website (optional)"
                  // disabled={iscustomer ? 1 : 0}
                />
              )}
              {
                iscustomer === "/dashboard/create-new-vendor" ? (
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-chip-label">
                      Materials
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={selectedMaterial}
                      onChange={handleChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
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
                      {materialsNames.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, selectedMaterial, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : currentUser?.role === "vendor" ? (
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-chip-label">
                      Materials
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={selectedMaterial}
                      onChange={handleChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
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
                      {materialsNames.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, selectedMaterial, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  ""
                )

                // <RHFTextField
                //   helperText={
                //     <Typography
                //       variant="caption"
                //       sx={{
                //         mt: 1,
                //         mx: "auto",
                //         display: "block",

                //         color: "text.secondary",
                //       }}
                //     >
                //       Enter Vendor's materials info, seprated by comma ,
                //     </Typography>
                //   }
                //   name="materialProvider"
                //   label="Supplier brief"
                //   // disabled={iscustomer ? 1 : 0}
                // />
              }
            </Box>

            <Typography variant="h4" marginBottom={4} marginTop={4}>
              Personal information
            </Typography>
            <Box
              sx={{
                display: "grid",
                columnGap: 2,
                rowGap: 3,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                }}
              >
                {iscustomer === "/dashboard/add-user" && (
                  <RHFSelect
                    name="gender"
                    label="Gender"
                    placeholder="Gender"
                    // disabled={isEdit ? 1 : 0}
                  >
                    <option />
                    {genders.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {iscustomer === "/dashboard/add-user" ? (
                  <RHFSelect
                    name="UserRole"
                    label="Worker Role"
                    // disabled={isEdit ? 1 : 0}
                    placeholder="Worker Duty"
                  >
                    <option />
                    <option value="Cutting">Cutting</option>
                    <option value="Stiching">Stiching</option>
                    <option value="Quality">Quality</option>
                    <option value="Packing">Packing</option>
                  </RHFSelect>
                ) : (
                  ""
                )}

                <RHFTextField
                  name="fname"
                  label="Name"
                  // disabled={isEdit ? 1 : 0}
                />
                <RHFTextField
                  name="address"
                  label="Point Of Contact"
                  // disabled={isEdit ? 1 : 0}
                />
                {/* {!iscustomer ? (
                  <RHFTextField
                    name="last_name"
                    label="Last Name"
                    // disabled={isEdit ? 1 : 0}
                  />
                ) : (
                  <RHFTextField
                    name="address"
                    label="Address"
                    // disabled={isEdit ? 1 : 0}
                  />
                )} */}

                <RHFTextField name="displayname" label="Display Name" />
                {iscustomer === "/dashboard/add-user" && (
                  <RHFTextField name="birthdate" label="Birthdate" />
                )}
                {isEdit && currentUser?.role !== "vendor" && (
                  <RHFSelect name="madein" label="Made In ...">
                    {countries?.map((item) => (
                      <option value={item.name}>{item.name}</option>
                    ))}
                  </RHFSelect>
                )}
                {iscustomer === "/dashboard/create-new-manufacturer" && (
                  <RHFSelect name="madein" label="Made In ...">
                    {countries?.map((item) => (
                      <option value={item.name}>{item.name}</option>
                    ))}
                  </RHFSelect>
                )}
              </Box>
              {/* ------------------------------------------------------------- */}
              <Typography variant="h4">Account information</Typography>
              <RHFTextField
                name="email"
                label="Email Address"
                disabled={isEdit ? 1 : 0}
              />
              <RHFTextField
                type="password"
                name="password"
                label="Password"
                disabled={isEdit ? 1 : 0}
              />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
              >
                {isEdit ? "Update" : "Create"}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
