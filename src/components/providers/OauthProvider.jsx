import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// firebase
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase/Config";
// Redux
import { useDispatch } from "react-redux";
import { setUser, setUserRole } from "src/redux/action/Action";

/* eslint-disable react-hooks/exhaustive-deps */
const OauthProvider = ({ children, LoaderComponent }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // UseDispatch Hook
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // dispatch(setUser(user));
        //  get doc from firestore
        // const docRef = doc(db, "users", user.uid);
        // getDoc(docRef).then((doc) => {
        //   let data = doc.data();
        //   // dispatch(setUserRole(data));
        // });
        setIsAuthenticated(true);
      } else {
        // User is not signed in
        console.log("eroorrrrrrrrrrrrrrrrrrr");
        setIsAuthenticated(true);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  /**
   * We halt the rendering stack
   * until we have valid credentials
   */

  return (
    <>
      {!isAuthenticated && <LoaderComponent isLoading msg="LOADING" />}
      {isAuthenticated && children}
    </>
  );
};

OauthProvider.propTypes = {
  children: PropTypes.object.isRequired,
  LoaderComponent: PropTypes.any,
};

export default OauthProvider;
