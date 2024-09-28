import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
// sweet alert
import Swal from "sweetalert2";
// React-Router-Dom
import { useNavigate } from "react-router-dom";
// Firebase Login
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/Config";

// Redux
import { useDispatch } from "react-redux";
import { setUser, setUserRole } from "../../redux/action/Action";
import Page from "src/components/Page";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit">Chain Apparel</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();
function SignIn() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ...................................................................
  const [loading, setloading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setDisabled(true);
    const emailformat =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailformat.test(email)) {
      alert("Please provide a valid email address");
      setloading(false);
      setDisabled(false);
      return;
    }
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        debugger;
        const docRef = doc(db, "users", user.uid);

        getDoc(docRef).then((doc) => {
          let data = doc.data();
          dispatch(setUser(user));
          dispatch(setUserRole(data));
          setloading(false);
          setDisabled(false);
          navigate("/");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, "...", errorCode);
        Swal.fire(errorCode, "You Enter Wrong Email Or Password!", "error");
        setloading(false);
        setDisabled(false);
      });
  };

  return (
    <Page title="Chain Apparel">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <LoadingButton
                loading={loading}
                disabled={disabled}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </LoadingButton>
              {/* <Grid container>
              <Grid item>
                <Link href="/auth/signup" variant="body2" underline="always">
                  Creat New Account
                </Link>
              </Grid>
            </Grid> */}
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </Page>
  );
}
export default SignIn;
