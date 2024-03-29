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

const VITE_FIREBASE_APIKEY = import.meta.env.VITE_FIREBASE_APIKEY;
const VITE_FIREBASE_AUTHDOMAIN = import.meta.env.VITE_FIREBASE_AUTHDOMAIN;
const VITE_FIREBASE_PROJECTID = import.meta.env.VITE_FIREBASE_PROJECTID;
const VITE_FIREBASE_STORAGEBUCKET = import.meta.env.VITE_FIREBASE_STORAGEBUCKET;
const VITE_FIREBASE_MESSAGINGSENDERID = import.meta.env
  .VITE_FIREBASE_MESSAGINGSENDERID;
const VITE_FIREBASE_APPID = import.meta.env.VITE_FIREBASE_APPID;
const VITE_FIREBASE_MEASUREMENTID = import.meta.env.VITE_FIREBASE_MEASUREMENTID;

const firebaseConfig = {
  apiKey: VITE_FIREBASE_APIKEY,
  authDomain: VITE_FIREBASE_AUTHDOMAIN,
  projectId: VITE_FIREBASE_PROJECTID,
  storageBucket: VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGINGSENDERID,
  appId: VITE_FIREBASE_APPID,
  measurementId: VITE_FIREBASE_MEASUREMENTID,
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
