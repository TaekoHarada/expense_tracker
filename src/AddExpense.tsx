import {
  CategoryList,
  MonthList,
  checkYear,
  checkDay,
  insertExpense,
  getExpenseListByTerm,
} from "./scripts";
import { useContext, useState } from "react";
import { SetExpenseContext, SearchDateContext } from "./ExpenseContext";

const AddExpense: React.FC = () => {
  const setExpenseList = useContext(SetExpenseContext);
  const searchDate = useContext(SearchDateContext);

  // Input Form Data
  const currentDate = new Date();
  // initial data set as strings
  const [formData, setFormData] = useState({
    year: currentDate.getFullYear().toString(),
    month: MonthList[currentDate.getMonth()],
    day: currentDate.getDate().toString(),
    name: "",
    category: CategoryList.Groceries,
    amount: "0",
    quantity: "0",
  });

  // These states are for showing inpur error messages
  // const [yearError, setYearError] = useState(false);
  // const [dayError, setDayError] = useState(false);

  const [errMessages, setErrMessages] = useState({
    year: false,
    day: false,
    amount: false,
    quantity: false,
  });

  // For input form
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log("formData", formData);
  };

  // For dropdown form
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //　↓ Validation Check ↓

    // input year check
    if (!checkYear(formData.year)) {
      console.log("year error");
      setErrMessages((prevErrMessages) => ({
        ...prevErrMessages,
        year: true,
      }));
      return;
    } else {
      setErrMessages((prevErrMessages) => ({
        ...prevErrMessages,
        year: false,
      }));
      // set formdata to the parsed value
      setFormData((prevData) => ({
        ...prevData,
        year: parseInt(formData.year).toString(),
      }));
    }

    // input day check
    if (!checkDay(formData.year, formData.month, formData.day)) {
      console.log("day error");
      setErrMessages((prevErrMessages) => ({
        ...prevErrMessages,
        day: true,
      }));
      return;
    } else {
      setErrMessages((prevErrMessages) => ({
        ...prevErrMessages,
        day: false,
      }));
      // set formdata to the parsed value
      setFormData((prevData) => ({
        ...prevData,
        day: parseInt(formData.day).toString(),
      }));
    }

    // input amount check
    // it allows "0"
    console.log("parseInt(formData.amount)", parseInt(formData.amount));
    if (parseInt(formData.amount) || parseInt(formData.amount) === 0) {
      // parseInt automatically change the value to integer (ex: 011 > 11, 00a > 0)
      setErrMessages((prevErrMessages) => ({
        ...prevErrMessages,
        amount: false,
      }));
      // set formdata to the parsed value
      setFormData((prevData) => ({
        ...prevData,
        amount: parseInt(formData.amount).toString(),
      }));
    } else {
      console.log("amount error with: ", formData.amount);
      setErrMessages((prevErrMessages) => ({
        ...prevErrMessages,
        amount: true,
      }));
      return;
    }

    // input quantity check
    // it allows "0"
    if (parseInt(formData.quantity) || parseInt(formData.quantity) === 0) {
      // parseInt automatically change the value to integer (ex: 011 > 11, 00a > 0)
      setErrMessages((prevErrMessages) => ({
        ...prevErrMessages,
        quantity: false,
      }));
      // set formdata to the parsed value
      setFormData((prevData) => ({
        ...prevData,
        quantity: parseInt(formData.quantity).toString(),
      }));
    } else {
      console.log("quantity error with: ", formData.quantity);
      setErrMessages((prevErrMessages) => ({
        ...prevErrMessages,
        quantity: true,
      }));
      return;
    }

    //　↑ Validation Check ↑

    // Create data
    const newExpense = {
      date: {
        year: parseInt(formData.year),
        month: MonthList.indexOf(formData.month),
        day: parseInt(formData.day),
      },
      name: formData.name,
      category: CategoryList[formData.category as keyof typeof CategoryList],
      amount: parseInt(formData.amount),
      quantity: parseInt(formData.quantity),
    };

    console.log("newExpense", newExpense);

    // Insert to DB
    insertExpense(newExpense);

    // Search again
    getExpenseListByTerm(searchDate.year, searchDate.month).then(
      (fetchedExpenseList) => {
        console.log("fetchedExpenseList", fetchedExpenseList);
        setExpenseList!(fetchedExpenseList);
      }
    );
  };

  return (
    <div
      id="add_expense_page"
      className="container-md border py-2 mb-2 bg-white rounded"
    >
      <form onSubmit={onSubmit}>
        <div className="d-flex flex-column flex-md-row gap-2 flex-wrap">
          <div className="col-md-3 row">
            <div className="col-4">
              <label className="form-label m-0">Year</label>
              <input
                className="form-control form-control-sm text-end"
                type="text"
                name="year"
                id="year"
                value={formData.year}
                onChange={onInputChange}
              />
              {errMessages.year && (
                <div style={{ color: "red" }}>
                  Input valid year: 1901 - 2099
                </div>
              )}
            </div>

            <div className="col-4">
              <label className="form-label m-0">Month</label>
              <select
                name="month"
                id="month"
                className="form-select form-select-sm"
                value={formData.month}
                onChange={onSelectChange}
              >
                {Object.values(MonthList).map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-3">
              <label className="form-label m-0">Day</label>
              <input
                className="form-control form-control-sm text-end"
                type="text"
                name="day"
                id="day"
                value={formData.day}
                onChange={onInputChange}
              />
              {errMessages.day && (
                <div style={{ color: "red" }}>Input valid day</div>
              )}
            </div>
          </div>

          <div className="col-md-3">
            <label className="ex_name form-label m-0" htmlFor="name">
              name
            </label>
            <input
              className="form-control form-control-sm"
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={onInputChange}
            />
          </div>

          <div className="col-md-2">
            <label className="ex_category form-label m-0" htmlFor="category">
              category
            </label>
            <select
              id="category"
              name="category"
              className="form-select form-select-sm"
              value={formData.category}
              onChange={onSelectChange}
            >
              {Object.values(CategoryList).map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-1">
            <label className="ex_amount form-label m-0" htmlFor="amount">
              amount ($)
            </label>
            <input
              className="form-control form-control-sm text-end"
              type="text"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={onInputChange}
            />
            {errMessages.amount && (
              <div style={{ color: "red" }}>
                Input valid amount: Input a Number
              </div>
            )}
          </div>

          <div className="col-md-1">
            <label className="ex_quantity form-label m-0" htmlFor="quantity">
              quantity
            </label>
            <input
              className="form-control form-control-sm text-end"
              type="text"
              name="quantity"
              id="quantity"
              value={formData.quantity}
              onChange={onInputChange}
            />
            {errMessages.quantity && (
              <div style={{ color: "red" }}>
                Input valid quantity: Input a Number
              </div>
            )}
          </div>

          <div className="col-md-1 mt-md-4">
            <button type="submit" className="btn btn-primary  btn-sm fw-bolder">
              Add New
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
