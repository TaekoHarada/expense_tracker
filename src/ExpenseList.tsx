import { useContext, useState, useEffect } from "react";
import Expense from "./Expense";
import { ExpenseListContext, SearchDateContext } from "./ExpenseContext";
import { ExpenseType } from "./scripts";

const ExpenseList: React.FC = () => {
  const expenseList: ExpenseType[] = useContext(ExpenseListContext);
  const searchDate = useContext(SearchDateContext);

  // Sort function
  const compareByDate = (a: ExpenseType, b: ExpenseType): number => {
    const dateA = new Date(a.date.year, a.date.month, a.date.day).getTime();
    const dateB = new Date(b.date.year, b.date.month, b.date.day).getTime();

    return dateA - dateB;
  };

  // Sort by date
  expenseList.sort(compareByDate);
  console.log("Sorted list", expenseList);

  // For pagenation
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(expenseList.length / itemsPerPage);

  let startIndex = currentPage * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let expenseListSubset = expenseList.slice(startIndex, endIndex);

  useEffect(() => {
    startIndex = currentPage * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    expenseListSubset = expenseList.slice(startIndex, endIndex);
  }, [currentPage]);

  // initializer
  useEffect(() => {
    setCurrentPage(0);
    startIndex = currentPage * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    expenseListSubset = expenseList.slice(startIndex, endIndex);
    console.log("selectedPage: useEffect initializer", currentPage);
  }, [expenseList]);

  const handlePagePrev = () => {
    console.log("handlePagePrev", currentPage, totalPages);
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const handlePageNext = () => {
    console.log("handlePageNext", currentPage, totalPages);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div
      id="expense_list_page"
      className="rounded container-md bg-white py-3 px-0 shadow-sm mb-5"
    >
      <div
        className="badge 
      rounded-pill text-bg-light border border-primary fs-6 fst-italic ms-2 mb-2 px-3"
      >
        {searchDate.year !== "" ? searchDate.year : "All years"}
        {", "}
        {searchDate.month !== "-1" ? searchDate.month : "All months"}
      </div>

      {expenseListSubset.map((expense, index) => (
        <div
          key={expense.id}
          className={index % 2 === 0 ? "bg-info bg-opacity-10" : ""}
        >
          <Expense expense={expense} />
        </div>
      ))}

      <div className="row pt-3">
        <div className="col-5 position-relative">
          {0 < currentPage ? (
            <button
              type="button"
              onClick={handlePagePrev}
              className="position-absolute end-0 btn btn-dark"
            >
              ≪ prev
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="col-2 text-center pt-1">
          {currentPage + 1}/{totalPages} pages
        </div>
        <div className="col-5">
          {currentPage < totalPages - 1 ? (
            <button
              type="button"
              onClick={handlePageNext}
              className="btn btn-dark"
            >
              next ≫
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
