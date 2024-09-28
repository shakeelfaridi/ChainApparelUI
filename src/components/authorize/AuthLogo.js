import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import clsx from "clsx";
import loader from "./Ghost.gif";

/* Our default styles */
const useStyles = makeStyles({
  logo: {
    textAlign: "center",
    "& img": {
      height: "100%",
      margin: "0 auto",
      // marginRight: "15px",
      cursor: "pointer",
      width: "100%",
    },
  },
  flex: {
    display: "flex",
  },
});

/* Return to homepage */
const goHome = (event) => {
  event.preventDefault();
  window.location.href = "/";
};

/* Our logo */
const AuthLogo = (props) => {
  const classes = useStyles();
  const { style, flex } = props;
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={clsx(classes.logo, { [classes.flex]: flex })}
      onClick={goHome}
    >
      <img
        // src="https://cdn.dribbble.com/users/73104/screenshots/2832940/media/73878d06f44b5d35324687fc41c62689.gif"
        src={loader}
        alt="logo"
        className="logo"
        id="logo"
        style={style}
      />
    </div>
  );
};

/* Our logo props */
AuthLogo.propTypes = {
  style: PropTypes.object,
  flex: PropTypes.bool,
};

AuthLogo.defaultProps = {
  flex: false,
};

export default AuthLogo;
