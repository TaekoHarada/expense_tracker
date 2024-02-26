import { createContext, Dispatch, SetStateAction } from "react";
import { ExpenseType, SearchType } from "./scripts";

// state of useSate: expenseList in App
export const ExpenseListContext = createContext<ExpenseType[]>([]);
// set function of useState: setExpenseList in App
export const SetExpenseContext = createContext<Dispatch<
  SetStateAction<ExpenseType[]>
> | null>(null);

// [Year: string, Month: string]
export const SearchDateContext = createContext<SearchType>({
  year: "",
  month: ""
});
export const SetSearchDateContext = createContext<Dispatch<
  SetStateAction<SearchType>
> | null>(null);
