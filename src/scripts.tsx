import { fetchFromDB, insertToDB, deleteFromDB, updateAtDB } from "./database";

// Data Type = DB data type (except category: string at DB)
export interface ExpenseType {
  id: string;
  date: DateType;
  name: string;
  category: CategoryList;
  amount: number;
  quantity: number;
}

type DateType = {
  year: number;
  month: number;
  day: number;
};

export type SearchType = {
  year: string;
  month: string;
};

// Initial Data
export enum CategoryList {
  Housing = "Housing",
  Utilities = "Utilities",
  Transportation = "Transportation",
  Groceries = "Groceries",
  Health = "Health",
  Insurance = "Insurance",
  Debt = "Debt",
  Savings = "Savings",
  Education = "Education",
  Clothing = "Clothing",
  Taxes = "Taxes",
  Others = "Others",
}

export const CategoryIcons: Record<string, string> = {
  Housing: "bi bi-house-door-fill",
  Utilities: "bi bi-lightning-charge",
  Transportation: "bi bi-car-front-fill",
  Groceries: "bi bi-cart-fill",
  Health: "bi bi-h-circle-fill",
  Insurance: "i bi-heart-fill",
  Debt: "bi bi-coin",
  Savings: "bi bi-piggy-bank-fill",
  Education: "bi bi-vector-pen",
  Clothing: "bi bi-person-standing-dress",
  Taxes: "bi bi-bank2",
  Others: "bi bi-three-dots",
};

// The reason for array is that index is useful (sorting, Date object)
export const MonthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//
// CRUD( create, read, update, delete) functions
//

// Get All Expenses
export const getExpenseList = async (): Promise<ExpenseType[]> => {
  try {
    const fetchData = await fetchFromDB();
    return fetchData.data || [];
  } catch (e) {
    console.error("error:", e);
    return [];
  }
};

// Get Expenses by year and month
export const getExpenseListByTerm = async (
  selectedYear: string,
  selectedMonth: string
): Promise<ExpenseType[]> => {
  console.log("month index", MonthList.indexOf(selectedMonth));
  console.log("selectedYear", selectedYear);
  try {
    const fetchData = await fetchFromDB();

    // Push only matched data
    let searchResult: ExpenseType[] = [];
    // patern 1: Only Month
    if (!selectedYear && selectedMonth != "-1") {
      console.log("Patern 1: Only Month");
      fetchData.data!.forEach((data) => {
        if (data.date.month == MonthList.indexOf(selectedMonth)) {
          searchResult.push(data);
        }
      });
      console.log("searchResult", searchResult);
      return searchResult;
    }
    // patern 2: Only Year
    else if (selectedYear && selectedMonth == "-1") {
      console.log("Patern 2: Only Year");
      fetchData.data!.forEach((data) => {
        if (data.date.year == selectedYear) {
          searchResult.push(data);
        }
      });
      console.log("searchResult", searchResult);
      return searchResult;
    }
    // patern 3: Both Year and Month
    else if (selectedYear && selectedMonth != "-1") {
      console.log("Patern 3: Both Year and Month");
      fetchData.data!.forEach((data) => {
        if (
          data.date.month == MonthList.indexOf(selectedMonth) &&
          data.date.year == selectedYear
        ) {
          searchResult.push(data);
        }
      });
      console.log("searchResult", searchResult);
      return searchResult;
    }
    // patern 4: No Year and No Month, therefore return ALL List
    else {
      console.log("Patern 4: ALL List");
      return fetchData.data || [];
    }
  } catch (e) {
    console.error("error searching data:", e);
    return [];
  }
};

// Insert Expense
export const insertExpense = async (expenseData: any) => {
  try {
    console.log("insert expense", expenseData);
    await insertToDB(expenseData);
  } catch (e) {
    console.error("error inserting data:", e);
  }
};

// Delete Expense
export const deleteExpense = async (expenseData: any) => {
  try {
    console.log("delete expense", expenseData.id);
    await deleteFromDB(expenseData.id);
  } catch (e) {
    console.error("error deleting data:", e, expenseData);
  }
};

// Update Expense
export const updateExpense = async (expenseData: any) => {
  try {
    console.log("update expense", expenseData);
    await updateAtDB(expenseData);
  } catch (e) {
    console.error("error updating data:", e, expenseData);
  }
};

// // useReducer
// function expenseReducer(expense: ExpenseType, action: any) {
//   switch (action.type) {
//     case "insert": {
//       return insertExpense(expense);
//     }
//     case "delete": {
//       return deleteExpense(expense);
//     }
//     case "update": {
//       return updateExpense(expense);
//     }
//     default: {
//       throw Error("Unknown action: " + action.type);
//     }
//   }
// }

//
// Validation functions
//

// Check Year 1901 ~ 2099
export const checkYear = (year: string) => {
  if (!parseInt(year)) {
    return 0; // not Integer
  }
  if (parseInt(year) > 1900 && parseInt(year) < 2100) {
    return true;
  } else {
    return 0; // Invalid range of year
  }
};

// Check Day by year and month
export const checkDay = (year: string, month: string, day: string) => {
  console.log("getDays: ");
  if (!parseInt(year) || !parseInt(day)) {
    return 0; // not Integer
  }
  const date = new Date(
    parseInt(year),
    MonthList.indexOf(month),
    parseInt(day)
  );
  return date;
};
