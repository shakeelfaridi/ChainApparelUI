import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDoc, setDoc, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase/Config";
// React-Router-Dom
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthContextProvider(props) {
  const [user, setUser] = useState({});
  const [userRole, setUserRole] = useState({});

  let navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        //  get doc from firestore
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef).then((doc) => {
          let data = doc.data();
          setUserRole(data);
          // Local storage
          localStorage.setItem("userData", JSON.stringify(data));
        });
        // get doc from firestore
      } else {
        // User is not signed in
        console.log("eroorrrrrrrrrrrrrrrrrrr");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  // SignOut User
  const SignOut = async () => {
    await signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("User SignOut");
        localStorage.removeItem("userData");
        localStorage.removeItem("user");
        navigate("auth/login");
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };
  return (
    <div>
      <AuthContext.Provider value={{ user, SignOut, userRole }}>
        {props.children}
      </AuthContext.Provider>
    </div>
  );
}
