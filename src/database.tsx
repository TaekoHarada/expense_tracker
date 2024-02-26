import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { ExpenseType } from "./scripts";

const REACT_APP_FIREBASE_APIKEY = process.env.REACT_APP_FIREBASE_APIKEY;
const REACT_APP_FIREBASE_AUTHDOMAIN = process.env.REACT_APP_FIREBASE_AUTHDOMAIN;
const REACT_APP_FIREBASE_PROJECTID = process.env.REACT_APP_FIREBASE_PROJECTID;
const REACT_APP_FIREBASE_STORAGEBUCKET =
  process.env.REACT_APP_FIREBASE_STORAGEBUCKET;
const REACT_APP_FIREBASE_MESSAGINGSENDERID =
  process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID;
const REACT_APP_FIREBASE_APPID = process.env.REACT_APP_FIREBASE_APPID;
const REACT_APP_FIREBASE_MEASUREMENTID =
  process.env.REACT_APP_FIREBASE_MEASUREMENTID;

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_APIKEY,
  authDomain: REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECTID,
  storageBucket: REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: REACT_APP_FIREBASE_APPID,
  measurementId: REACT_APP_FIREBASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const expenseCollection = collection(db, "expenseList");

// Insert data
export async function insertToDB(expenseData: any): Promise<void> {
  try {
    const docRef = await addDoc(expenseCollection, expenseData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  const querySnapshot = await getDocs(expenseCollection);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

// Get data
export async function fetchFromDB(): Promise<{
  data: any[] | null;
  error: string | null;
}> {
  try {
    const querySnapshot = await getDocs(expenseCollection);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { data, error: null };
  } catch (e) {
    console.error("Error fetching document: ", e);
    return { data: null, error: "Error fetching data from the database." };
  }
}

// Delete Data
export async function deleteFromDB(expenseId: string): Promise<void> {
  try {
    await deleteDoc(doc(expenseCollection, expenseId));
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

// Update Data
export async function updateAtDB(expense: ExpenseType): Promise<void> {
  try {
    await updateDoc(doc(expenseCollection, expense.id), {
      name: expense.name,
      date: {
        year: expense.date.year,
        month: expense.date.month,
        day: expense.date.day,
      },
      category: expense.category,
      amount: expense.amount,
      quantity: expense.quantity,
    });
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}
