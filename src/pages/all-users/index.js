import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { db } from "src/firebase/Config";
import Label from "src/components/Label";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState(""); // State to store the selected role for filtering

  useEffect(() => {
    const fetchData = async () => {
      let usersCollection = collection(db, "users");

      // If a role filter is selected, add it to the query
      if (filterRole) {
        const roleQuery = query(
          usersCollection,
          where("role", "==", filterRole)
        );
        usersCollection = roleQuery;
      }

      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
    };

    fetchData();
  }, [filterRole]);

  return (
    <Box p={3}>
      <FormControl fullWidth>
        <InputLabel>Filter by Role</InputLabel>
        <Select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">
            <em>All Roles</em>
          </MenuItem>
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="vendor">Vendor</MenuItem>
          <MenuItem value="manufacturer">Manufacturer</MenuItem>
          <MenuItem value="worker">Worker</MenuItem>
          {/* <MenuItem value="super-admin">Super Admin</MenuItem> */}
          {/* Add more roles as needed */}
        </Select>
      </FormControl>
      <TableContainer component={Paper} style={{ marginTop: "16px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Working Field</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="h6" style={{ marginBottom: "4px" }}>
                      {user?.displayname}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user?.company}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>
                  <Label>{user.role}</Label>
                </TableCell>
                <TableCell>{user?.UserRole || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UserTable;
