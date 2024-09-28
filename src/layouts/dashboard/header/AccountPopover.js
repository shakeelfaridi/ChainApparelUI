import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
// ------------------Redux
import { useDispatch } from "react-redux";
import { logoutUser } from "src/redux/action/Action";
import { useSelector } from "react-redux";
import { AuthUser } from "src/redux/reducers/AuthReducer";
//    ----------------Firebase
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/Config";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
} from "@mui/material";
// components
import MenuPopover from "../../../components/MenuPopover";
import { IconButtonAnimate } from "../../../components/animate";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Home",
    linkTo: "/",
  },
  // {
  //   label: "Profile",
  //   linkTo: "/dashboard/profile",
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // get state from redux
  const user = useSelector((state) => state.AuthUser.user);
  const img = useSelector((state) => state.AuthUser.userRole?.url);
  function handleOpen(event) {
    setOpen(event.currentTarget);
  }

  function handleClose() {
    setOpen(null);
  }

  // SignOut User

  const SignOut = async () => {
    await signOut(auth)
      .then((res) => {
        // Sign-out successful.
        console.log("User SignOut");
        localStorage.removeItem("user");
        dispatch(logoutUser());
        navigate("/auth/login");
      })
      .catch((error) => {
        // An error happened.
        console.error("error", error);
      });
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={img} alt={user?.name} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user.email}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user.uid}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              onClick={handleClose}
              component={Link}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem sx={{ m: 1 }} onClick={SignOut}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
