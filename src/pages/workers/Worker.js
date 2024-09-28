import {
  Box,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
// components
import Page from "src/components/Page";

// firebase
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "src/firebase/Config";
// redux
import { useSelector } from "react-redux";
// redux
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import WorkerTask from "src/components/workerTask/WorkerTask";

export default function Worker() {
  const [task, setTask] = useState([]);
  const worker = useSelector((state) => state.AuthUser.userRole);

  const getTask = async () => {
    const q = query(
      collection(db, "orders"),
      where(worker.UserRole, "==", worker.employeeId)
    );
    const querySnapshot = await getDocs(q);
    let array = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      array.push(data);
    });

    setTask(array);
  };

  useEffect(() => {
    getTask();
  }, []);

  return (
    <>
      <Page title="Home">
        <Container>
          <Grid container spacing={2}>
            <Grid item>
              <HeaderBreadcrumbs
                heading={"Home"}
                links={[
                  { name: "Dashboard", href: "/dashboard" },

                  {
                    name: "Work",
                    href: "/dashboard/task",
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <Box>
                {/* component */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#OrderId</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Your Task</TableCell>
                        <TableCell> Actions </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {task?.map((order) => {
                        if (
                          order.processing.Cutting === "pending" &&
                          worker?.UserRole === "Cutting"
                        )
                          return (
                            <WorkerTask
                              order={order}
                              workerData={worker}
                              getTask={getTask}
                            />
                          );

                        if (
                          order.processing.Stiching === "pending" &&
                          worker?.UserRole === "Stiching"
                        )
                          return (
                            <WorkerTask
                              order={order}
                              workerData={worker}
                              getTask={getTask}
                            />
                          );

                        if (
                          order.processing.Quality === "pending" &&
                          worker?.UserRole === "Quality"
                        )
                          return (
                            <WorkerTask
                              order={order}
                              workerData={worker}
                              getTask={getTask}
                            />
                          );

                        if (
                          order.processing.Packing === "pending" &&
                          worker?.UserRole === "Packing"
                        )
                          return (
                            <WorkerTask
                              order={order}
                              workerData={worker}
                              getTask={getTask}
                            />
                          );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Page>
    </>
  );
}
