import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { Link as routerLink } from "react-router-dom";
// ----------------
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "src/firebase/Config";
import { AddCircle } from "@mui/icons-material";
import useLoggedUser from "src/utils/loggedUser";

export default function ProductInformation() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [material, setMaterial] = useState({});
  const [loading, setLoading] = useState(false);
  //   --------------------
  const user = useLoggedUser();

  const getProductInfo = async () => {
    setLoading(true);
    const refernec = collection(db, "materialInfo");

    const q1 = query(refernec, where("employeeId", "==", user.employeeId));

    const querySnapshot = await getDocs(q1);
    const array = [];

    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    setLoading(false);
    setProducts(array);
  };
  useEffect(() => {
    getProductInfo();
  }, []);

  // filtering products
  const handleSelect = (e) => {
    let value = e.target.value;
    setSelectedProduct(e.target.value);
    let product = products.filter((item) => item.ProductName === value);
    setMaterial(product);
  };

  return (
    <div>
      <Container>
        <HeaderBreadcrumbs
          heading={"Product Information"}
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Products", href: "dashboard/Products" },
          ]}
          action={
            <Button
              variant="contained"
              component={routerLink}
              to="/dashboard/add-new-products"
              endIcon={<AddCircle />}
            >
              Add New Product
            </Button>
          }
        />

        {/* ---------------------------------- */}
        <Grid container spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Products</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedProduct}
              label="Products"
              onChange={(e) => handleSelect(e)}
            >
              {loading && <MenuItem value={null}>loading...</MenuItem>}
              {products.map((item) => (
                <MenuItem value={item.ProductName}>{item.ProductName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid item>{selectedProduct && <h4>Materials</h4>}</Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginTop: "5px" }}>
          {/* ------------------------ */}
          <ul style={{ marginLeft: "5px" }}>
            {material.length >= 0 &&
              material?.map((item) =>
                item.MaterialInfo.map((m) => <li>{m}</li>)
              )}
          </ul>
          {/* <List>
            <ListItem disablePadding>
              {material.length >= 0 &&
                material?.map((item) =>
                  item.MaterialInfo.map((m) => (
                    <ListItemButton>
                      <ListItemText primary={Object.keys(m)} />
                    </ListItemButton>
                  ))
                )}
            </ListItem>
          </List> */}
        </Grid>
      </Container>
    </div>
  );
}
