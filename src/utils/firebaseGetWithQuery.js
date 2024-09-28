import { db } from "src/firebase/Config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const firebaseGetWithQuery = async (database, field, value) => {
  let array = [];
  const q = query(collection(db, database), where(field, "==", value));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    // console.log(data)
    array.push(data);
  });
  return array;
};
