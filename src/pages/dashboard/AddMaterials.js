import React from "react";
import Page from "src/components/Page";
// Material Ui Components
import { Grid, Box, TextField, Card, Typography } from "@mui/material";

export default function AddMaterials() {
  return (
    <div>
      <Page title="Add Product's Materials">
        <Box component="form">
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={12} lg={12}>
              <Card sx={{ padding: "15px" }}>
                <Typography variant="h5" color="initial">
                  Add New Product's Information
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={4}>
              <TextField
                sx={{ width: 1 }}
                id="product"
                label="Enter Product Name"
                name="productName"
                //   value={}
                //   onChange={}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <TextField
                sx={{ width: 1 }}
                id="product"
                label="Enter Product Name"
                name="productName"
                //   value={}
                //   onChange={}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <TextField
                sx={{ width: 1 }}
                id="product"
                label="Enter Product Name"
                name="productName"
                //   value={}
                //   onChange={}
              />
            </Grid>
          </Grid>
        </Box>
      </Page>
    </div>
  );
}
