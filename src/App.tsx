import { useState, useEffect, useRef } from "react";

import { getExpenseList, CategoryList } from "./scripts";

import {
  ExpenseListContext,
  SetExpenseContext,
  SearchDateContext,
  SetSearchDateContext,
} from "./ExpenseContext";

import ExpenseList from "./ExpenseList";
import AddExpense from "./AddExpense";
import Search from "./Search";
import Total from "./Total";

function App() {
  // At the first loading, fetch data from database and set initialValue to state
  const [expenseList, setExpenseList] = useState([
    {
      id: "",
      date: { year: 2024, month: 0, day: 12 },
      name: "",
      category: CategoryList.Groceries,
      amount: 0,
      quantity: 0,
    },
  ]);
  // Use to avoid re-render in environment mode
  const initialized = useRef(false);

  // Forsettin loading action
  // const [loading, setLoading] = useState(true);

  const [searchDate, setSearchDate] = useState({ year: "", month: "-1" });

  useEffect(() => {
    // To avoid re-render in environment mode
    if (!initialized.current) {
      initialized.current = true;
      console.log("useEffect");
      // get data from DB, and set to useState
      getExpenseList().then((fetchedExpenseList) => {
        console.log(fetchedExpenseList);
        // setExpenseList((prevList) => [...prevList, ...fetchedExpenseList]);
        setExpenseList(fetchedExpenseList);
      });
    }
  }, []);

  return (
    <ExpenseListContext.Provider value={expenseList}>
      <SetExpenseContext.Provider value={setExpenseList}>
        <SearchDateContext.Provider value={searchDate}>
          <SetSearchDateContext.Provider value={setSearchDate}>
            <div className="bg-black m-0">
              <h1 className="h3 text-center py-3 m-0 text-white">
                <i className="bi bi-coin"></i> Expense Trucker
              </h1>
            </div>
            <Search />
            <Total />
            <AddExpense />
            <ExpenseList />
          </SetSearchDateContext.Provider>
        </SearchDateContext.Provider>
      </SetExpenseContext.Provider>
    </ExpenseListContext.Provider>
  );
}

export default App;
