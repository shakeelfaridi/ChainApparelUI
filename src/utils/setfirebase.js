import { db } from "src/firebase/Config";
import { doc, setDoc } from "firebase/firestore";

export const setfirebase = async ([data]) => {
  await setDoc(doc(db, "orderToVendors"), {
    data,
  });
};
