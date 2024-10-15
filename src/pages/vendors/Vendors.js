import {
  Button,
  CircularProgress,
  Grid,
  Table,
  Link,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Container } from "@mui/system";
import { paramCase } from "change-case";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as routerLink, Navigate, useNavigate } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { db } from "src/firebase/Config";
import { EditManufacturer } from "src/redux/action/Action";

export default function Vendors() {
  const [vendors, setvendors] = useState([]);
  const [Isloading, setIsloading] = useState(true);
  const [open, setOpen] = useState(false);
  // ----
  const user = useSelector((state) => state.AuthUser.user.email);
  // ---
  // ------------------------dialoge
  // const handleClickOpen = (item) => {
  //   setSingleManufacturer(item.company);
  //   setOpen(true);
  //   handleCorrespondingOrder(item);
  // };

  const handleClose = () => {
    setOpen(false);
  };
  // --------------------
  // const handleCorrespondingOrder = async (item) => {
  //   setLoadingSpecificOrder(true);
  //   const que = item.company;
  //   let orders = [];
  //   const q = query(
  //     collection(db, "orders"),
  //     where("manufacturer", "==", que),
  //     where("email", "==", user)
  //   );
  //   const querymanufacturerOrders = await getDocs(q);
  //   querymanufacturerOrders.forEach((doc) => {
  //     const data = doc.data();
  //     orders.push(data);
  //   });
  //   setSpecificOrder(orders);
  //   setLoadingSpecificOrder(false);
  // };

  // ------------------

  const fetchvendors = async () => {
    const vendor = [];
    const q = query(collection(db, "users"), where("role", "==", "vendor"));
    const querymanufacturer = await getDocs(q);
    querymanufacturer.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;

      vendor.push(data);
    });
    setvendors(vendor);
    setIsloading(false);
  };

  useEffect(() => {
    fetchvendors();
  }, []);

  // ------------------Handle Edit Or Update Manufacturer
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleEdit = (item) => {
    dispatch(EditManufacturer(item));
    navigate(`/dashboard/edit/${paramCase(item.company)}`);
  };
  return (
    <Page title="Suppliers">
      <Container>
        <HeaderBreadcrumbs
          heading={"Suppliers"}
          links={[
            { name: "Dashboard", href: "/dashbaord" },
            {
              name: "Suppliers",
              href: "/dashboard/Suppliers",
            },
          ]}
          action={
            <Button
              variant="contained"
              component={routerLink}
              to="/dashboard/create-new-supplier"
            >
              New Supplier
            </Button>
          }
        />
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <TableContainer>
              <Table sx={{ width: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Companies </TableCell>
                    <TableCell>Company Address </TableCell>
                    <TableCell>Material </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Isloading ? (
                    <TableRow>
                      <TableCell align="center" colSpan={7}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendors.map((item) => (
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
                          {item.provider.map((i) => (
                            <span style={{ padding: "0px 5px" }}>{i},</span>
                          ))}
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
    </Page>
  );
}
