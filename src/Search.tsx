import { useState, useContext } from "react";
import { SetExpenseContext, SetSearchDateContext } from "./ExpenseContext";
import { checkYear } from "./scripts";

import { MonthList, getExpenseListByTerm } from "./scripts";

const Search: React.FC = () => {
  const setExpenseList = useContext(SetExpenseContext);
  const setSearchDate = useContext(SetSearchDateContext);

  const [selectedMonth, setSelectedMonth] = useState("-1");
  const [selectedYear, setSelectedYear] = useState("");
  const [yearError, setYearError] = useState(false);

  const handleSelectChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSelectedYear(e.target.value);
  };

  const handleSelectChangeMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setSelectedMonth(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Selected year:", selectedYear);
    console.log("Selected month:", selectedMonth);

    // validation check for selectedYear
    if (!checkYear(selectedYear) && selectedYear != "") {
      console.log("year error");
      setYearError(true);
      return;
    } else {
      setYearError(false);
    }

    // Search Result
    getExpenseListByTerm(selectedYear, selectedMonth).then(
      (fetchedExpenseList) => {
        // console.log("fetchedExpenseList", fetchedExpenseList);
        // setExpenseList((prevList) => [...prevList, ...fetchedExpenseList]);
        setExpenseList?.(fetchedExpenseList);
      }
    );

    // Set Search year and month
    setSearchDate?.({ year: selectedYear, month: selectedMonth });
  };

  return (
    <div id="search_page" className="container-md mt-3 mt-md-5 mb-2 p-0">
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column flex-md-row gap-2">
          <div className="col-md-3">
            <label className="form-label m-0">Year</label>
            <input
              className="form-control text-end"
              type="text"
              id="searchYear"
              value={selectedYear}
              onChange={handleSelectChangeYear}
            />
            {yearError && (
              <span style={{ color: "red" }}>
                Input valid year: 1901 - 2099
              </span>
            )}
          </div>
          <div className="col-md-3">
            <label className="form-label m-0">Month</label>
            <select
              className="form-select"
              id="searchMonth"
              value={selectedMonth}
              onChange={handleSelectChangeMonth}
            >
              <option key="-1" value="-1">
                - All Months -
              </option>
              {Object.values(MonthList).map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <button
              type="submit"
              className="btn btn-primary px-3 fw-bolder mt-md-4"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Search;
