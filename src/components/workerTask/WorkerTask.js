import Check from "@mui/icons-material/Check";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { TableCell, TableRow } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "src/firebase/Config";
import { fCurrentDate, fDate, fDateTime, fDateTimeSuffix } from "src/utils/formatTime";
// Swal
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
// -----------------------------------------------------
export default function WorkerTask({ order, workerData, getTask }) {
  // const [done, setDone] = useState(false);
  const [loading, setloading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState({
    Cutting: "",
    Stiching: "",
    Quality: "",
    Packing: "",
    delivered: false,
  });
  const { enqueueSnackbar } = useSnackbar();
  // update task status
  const taskupdater = () => {
    // const cuttingDate = fDate();
    // const stichingDate = fDate();
    // const qualityDate = fDate();
    // const packingDate = fDate();
    // const deliveredDate = fDate();
    if (workerData?.UserRole === "Cutting") {
      const newItems = [];
      for (let i = 0; i < order.productQuantity; i++) {
        newItems.push({
          GarmentId: order.orderId + "-" + parseInt(i + 1),
          DateTime: new Date().toUTCString(),
          WorkerId: workerData.employeeId,
          ProcessName: workerData.UserRole,
        });
      }
      setProcessing({
        ...processing,
        Cutting: "completed",
        CuttingTrack: newItems,
        Stiching: "pending",
        Quality: "",
        Packing: "",
        delivered: false,
      });
    } else if (workerData?.UserRole === "Stiching") {
      const newItems = [];
      for (let i = 0; i < order.productQuantity; i++) {
        newItems.push({
          GarmentId: order.orderId + "-" + parseInt(i + 1),
          DateTime: new Date().toUTCString(),
          WorkerId: workerData.employeeId,
          ProcessName: workerData.UserRole,
        });
      }
      setProcessing({
        ...processing,
        Cutting: "completed",
        Stiching: "completed",
        StichingTrack: newItems,
        Quality: "pending",
        Packing: "",
        delivered: false,
      });
    } else if (workerData?.UserRole === "Quality") {
      const newItems = [];
      for (let i = 0; i < order.productQuantity; i++) {
        newItems.push({
          GarmentId: order.orderId + "-" + parseInt(i + 1),
          DateTime: new Date().toUTCString(),
          WorkerId: workerData.employeeId,
          ProcessName: workerData.UserRole,
        });
      }
      setProcessing({
        ...processing,
        Cutting: "completed",
        Stiching: "completed",
        Quality: "completed",
        QualityTrack: newItems,
        Packing: "pending",
        delivered: false,
      });
    } else if (workerData?.UserRole === "Packing") {
      const newItems = [];
      for (let i = 0; i < order.productQuantity; i++) {
        newItems.push({
          GarmentId: order.orderId + "-" + parseInt(i + 1),
          DateTime: new Date().toUTCString(),
          WorkerId: workerData.employeeId,
          ProcessName: workerData.UserRole,
        });
      }
      setProcessing({
        ...processing,
        Cutting: "completed",
        Stiching: "completed",
        Quality: "completed",
        Packing: "completed",
        PackingTrack: newItems,
        delivered: true,
        deliveredDate: new Date().toUTCString(),
      });
    }
  };
  const doneHandler = async (order) => {
    let role = workerData?.UserRole;
    setloading(true);
    setDisabled(true);

    const options = {
      url: ` http://localhost:9910/api/order-${role.toLowerCase()}/${
        order.orderId
      }`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        [workerData?.UserRole + "Track"]:
          processing[workerData?.UserRole + "Track"],
      },
    };

    try {
      // Blockchain API Call
      const response = await axios(options);
    

      // Firestore Document Update
      await setDoc(
        doc(db, "orders", order.id),
        { processing },
        { merge: true }
      );
      // console.table(processing);
      enqueueSnackbar("Task Completed!");
    } catch (err) {
      // Log and display error
      console.error("Error occurred: ", err);
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      });

      // Set loading and disabled states back
      setloading(false);
      setDisabled(false);

      // Exit the function early since an error occurred
      return;
    }

    // If everything goes well
    getTask();
    setloading(false);
    setDisabled(false);
  };

  useEffect(() => {
    taskupdater();
  }, []);

  return (
    <>
      <TableRow>
        <TableCell>{order.orderId}</TableCell>
        <TableCell>{order.product}</TableCell>
        <TableCell>{order.productQuantity}</TableCell>
        <TableCell> {workerData?.UserRole}</TableCell>
        <TableCell>
          <LoadingButton
            endIcon={<Check />}
            loading={loading}
            disabled={disabled}
            variant="contained"
            size="small"
            onClick={() => doneHandler(order)}
          >
            Mark as Task completed
          </LoadingButton>
        </TableCell>
      </TableRow>
    </>
  );
}
