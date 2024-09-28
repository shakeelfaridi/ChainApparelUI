import React, { useEffect, useState } from "react";
import { TableSkeleton } from "../table";
import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// ----------------
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Search } from "@mui/icons-material";
import { PageNotFoundIllustration } from "src/assets";
import { fDate, fDateTime ,fDateToNew} from "src/utils/formatTime";

export default function AdminTracking({
  tracking,
  loading,
  search,
  setSearch,
  fetechTracking,
  orderId,
  isError,
  setIsError,
}) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (orderId) {
      fetechTracking();
    }
  }, []);
  // console.log(tracking.length);

  return (
    <>
      {!orderId && (
        <Card sx={{ padding: "10px" }}>
          <TextField
            fullWidth
            id="search"
            label="Track Order Deveolpment process"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton onClick={() => fetechTracking()}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Card>
      )}

      {isError && (
        <Alert
          sx={{ marginTop: "10px" }}
          severity="error"
          onClose={() => {
            setIsError(false);
          }}
        >
          Invalid Order Id.
        </Alert>
      )}

      {tracking.length !== 0 &&
        tracking.map((item) => (
          <TableContainer sx={{ mt: "20px" }}>
            <Table sx={{ tableLayout: "auto", whiteSpace: "nowrap" }}>
              <TableHead>
                <TableRow>
                  <TableCell>OrderId</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Ship Address</TableCell>
                  <TableCell>Check Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{item.orderId}</TableCell>
                  <TableCell>{fDate(item.customerInfo.Order_Date)}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.ShipAddress}</TableCell>
                  <TableCell>
                    <Button varient="contained" onClick={handleClickOpen}>
                      Track
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          // Dialoge
        ))}

      {/* {tracking.length === 0 && !orderId ? (
        <PageNotFoundIllustration
          sx={{ width: "200px", margin: "auto", marginTop: "50px" }}
        />
      ) : 
      } */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Production Status"}</DialogTitle>
        <DialogContent>
          <Timeline position="right">
            {tracking?.map((status) => {
              debugger
              return(<>
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    <Box>Cutting -</Box> {status?.Cutting}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        status?.processing?.Cutting === "completed"
                          ? "success"
                          : "grey"
                      }
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    {status?.processing?.Cutting || "-"}
                    <Typography variant="overline" display="block">
                    {status?.processing?.CuttingTrack
                            ? fDate(
                                status?.processing?.CuttingTrack[0]
                                  .DateTime
                              )
                            : "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                {/* ------------------------- */}
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    <Box>Stiching -</Box> {status?.Stiching}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        status?.processing?.Stiching === "completed"
                          ? "success"
                          : "grey"
                      }
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    {status?.processing?.Stiching || "-"}
                    <Typography variant="overline" display="block">
                    {status?.processing?.StichingTrack
                            ? fDate(
                                status?.processing?.StichingTrack[0]
                                  .DateTime
                              )
                            : "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                {/* ------------------------- */}
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    <Box>Quality -</Box> {status.Quality}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        status?.processing?.Quality === "completed"
                          ? "success"
                          : "grey"
                      }
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    {status?.processing?.Quality || "-"}
                    <Typography variant="overline" display="block">
                    {status?.processing?.QualityTrack
                            ? fDate(
                                status?.processing?.QualityTrack[0]
                                  .DateTime
                              )
                            : "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                {/* ------------------------- */}
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    <Box>Packing -</Box> {status?.Packing}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        status?.processing?.Packing === "completed"
                          ? "success"
                          : "grey"
                      }
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    {status?.processing?.Packing || "-"}
                    <Typography variant="overline" display="block">
                    {status?.processing?.PackingTrack
                            ? fDate(
                                status?.processing?.PackingTrack[0]
                                  .DateTime
                              )
                            : "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                {/* ------------------------- */}
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    <Box>Delivered -</Box>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        status?.processing?.delivered === true
                          ? "success"
                          : "grey"
                      }
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    {status?.processing?.delivered === true ? "✔️" : "-"}
                    <Typography variant="overline" display="block">
                      {fDate(status?.processing?.deliveredDate , ) || "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              </>)
              
})}
          </Timeline>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
