import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";
import { firebaseGetWithQuery } from "src/utils/firebaseGetWithQuery";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "src/firebase/Config";

export default function MaterialInfoInput(props) {
  const { material, setMaterialRequirment, materialRequirement } = props;
  const [vendorOfMaterials, setVendorOfMaterials] = useState([]);

  const fetchReleventVendor = async () => {
    const VendorForThisProduct = material;
    let array = [];
    const q = query(collection(db, "users"), where("role", "==", "vendor"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
     
      array.push(data);
    });
    setVendorOfMaterials(array);
  };
  useEffect(() => {
    fetchReleventVendor();
  }, []);
  const changeChandler = (e) => {
    const { name, value } = e.target;
   
    setMaterialRequirment((materialRequirment) => ({
      ...materialRequirment,
      [name]: { Vendor: value.company, VendorId: value.employeeId },
    }));
  };
  return (
    <>
      {material.length > 0 &&
        material.map((item, index) => (
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth sx={{ paddingBottom: 1 }}>
              <InputLabel id="demo-simple-select-label">{item}</InputLabel>
              {/* Select */}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={materialRequirement[index].Vendor || ''}
                label={item}
                name={item}
                onChange={(e) => changeChandler(e)}
              >
                {vendorOfMaterials
                  .filter((vendor) => vendor.provider.includes(item))
                  .map((singleVendor) => (
                    <MenuItem value={singleVendor}>
                      {singleVendor.company}
                    </MenuItem>
                  ))}

                <MenuItem value={""}>None</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        ))}
    </>
  );
}
