import { useContext, useState, useEffect } from "react";
import { ExpenseListContext, SearchDateContext } from "./ExpenseContext";
import { ExpenseType, CategoryList, CategoryIcons } from "./scripts";
import { Chart } from "react-google-charts";

// Type is Array, because of setting for google pie chart
type CategoryTotalList = [category: string, value: number][];

const Total: React.FC = () => {
  const expenseList: ExpenseType[] = useContext(ExpenseListContext);
  const searchDate = useContext(SearchDateContext);

  // Total results
  const [categoryTotalList, setCategoryTotallist] = useState<CategoryTotalList>(
    []
  );

  // For Google Pie Chart
  // initial pie data use every rendering
  const initialPieData = [
    ["Category", "Total amount"],
    ["Housing", 0],
    ["Utilities", 0],
    ["Transportation", 0],
    ["Groceries", 0],
    ["Health", 0],
    ["Insurance", 0],
    ["Debt", 0],
    ["Savings", 0],
    ["Education", 0],
    ["Clothing", 0],
    ["Taxes", 0],
    ["Others", 0],
  ];
  const [pieData, setPieData] = useState(initialPieData);

  const pieOptions = {
    title: "Total percentage by category",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    color: "black",
    fontName: "Verdana",
  };

  // After setting expenseList, calculate total
  useEffect(() => {
    console.log("Total useEffect 1");
    setCategoryTotallist(calculateTotal());
  }, [expenseList]);

  useEffect(() => {
    console.log("Total useEffect 2");
    // Create a data for pie chart
    setPieData(initialPieData);
    setPieData((prevData) => [...prevData, ...categoryTotalList]);

    console.log("pieData", pieData);
    console.log("categoryTotalList", categoryTotalList);
  }, [categoryTotalList]);

  // Create a container to set totals
  const initializeCategoryTotal = (): CategoryTotalList => {
    let initialCategoryTotal: CategoryTotalList = [];

    Object.keys(CategoryList).forEach((category) => {
      initialCategoryTotal.push([category, 0]);
    });

    return initialCategoryTotal;
  };

  // Calculate totals for each category
  const calculateTotal = (): CategoryTotalList => {
    const categoryTotalList = initializeCategoryTotal();

    expenseList.forEach((expense) => {
      categoryTotalList.forEach((categoryTotal) => {
        if (expense.category == categoryTotal[0]) {
          categoryTotal[1] += expense.amount * expense.quantity;
        }
      });
    });

    return categoryTotalList;
  };

  return (
    <div
      id="total_page"
      className="rounded container-md py-3 py-md-5 bg-white mb-2 shadow-sm"
    >
      <span className="badge rounded-pill text-bg-light border border-primary fs-6 fst-italic px-2">
        Summary of {searchDate.year !== "" ? searchDate.year : "All years"}
        {", "}
        {searchDate.month !== "-1" ? searchDate.month : "All months"}
      </span>
      <div className="d-flex flex-column flex-md-row">
        <div className="col-md-6">
          {categoryTotalList.map((value, index) => (
            <div key={index} className="row my-1 bg-light">
              <div className="totalCategory col">
                <i className={CategoryIcons[value[0]]}></i>
                {value[0]}
              </div>
              <div className="totalValue col text-end">
                {value[1].toLocaleString()}
              </div>
            </div>
          ))}
          <div className="fs-4 text-end my-1 p-3 bg-black text-white font-weight-bold">
            Total:{" "}
            {categoryTotalList
              .reduce((acc, total) => acc + total[1], 0)
              .toLocaleString()}
          </div>
        </div>

        <div className="col-md-6 p-0">
          <Chart
            chartType="PieChart"
            data={pieData}
            options={pieOptions}
            width={"100%"}
            height={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default Total;
