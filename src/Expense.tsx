import { useContext, useState } from "react";
import { SetExpenseContext, SearchDateContext } from "./ExpenseContext";

import {
  ExpenseType,
  deleteExpense,
  updateExpense,
  getExpenseListByTerm,
  MonthList,
  CategoryList,
} from "./scripts";

interface ExpenseProps {
  expense: ExpenseType;
}

const Expense: React.FC<ExpenseProps> = ({ expense }) => {
  const setExpenseList = useContext(SetExpenseContext);
  const searchDate = useContext(SearchDateContext);

  // Changing the page for editing
  const [isEditing, setIsEditing] = useState(false);

  // use for editing page
  const [formData, setFormData] = useState({
    year: expense.date.year.toString(),
    month: MonthList[expense.date.month],
    day: expense.date.day.toString(),
    name: expense.name,
    category: CategoryList[expense.category as keyof typeof CategoryList],
    amount: expense.amount.toLocaleString(),
    quantity: expense.quantity.toLocaleString(),
  });

  const handleDelete = async () => {
    await deleteExpense(expense);
    //search again
    getExpenseListByTerm(searchDate.year, searchDate.month).then(
      (fetchedExpenseList) => {
        console.log("fetchedExpenseList", fetchedExpenseList);
        setExpenseList!(fetchedExpenseList);
      }
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // For changing input form
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // For changing dropdown form
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Update
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Change data to DB data types (= ExpenseType)
    const updateData: ExpenseType = {
      id: expense.id,
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

    //update with new data
    await updateExpense(updateData);

    // To Reading Page
    setIsEditing(false);

    // Search again
    getExpenseListByTerm(searchDate.year, searchDate.month).then(
      (fetchedExpenseList) => {
        console.log("fetchedExpenseList", fetchedExpenseList);
        setExpenseList!(fetchedExpenseList);
      }
    );
  };

  const handleCancelEdit = () => {
    // Reset form data to initial data
    setFormData((prevFormData) => ({
      ...prevFormData,
      year: expense.date.year.toString(),
      month: MonthList[expense.date.month],
      day: expense.date.day.toString(),
      name: expense.name,
      category: CategoryList[expense.category as keyof typeof CategoryList],
      amount: expense.amount.toLocaleString(),
      quantity: expense.quantity.toLocaleString(),
    }));

    setIsEditing(false);
  };

  // Page For Reading
  const renderExpenseDetails = () => (
    <div id="expense_page" className="row p-1">
      <label className="ex_year col-1 text-end">{formData.year} </label>
      <label className="month col-1">{formData.month}</label>
      <label className="day col-1 text-end">{formData.day}</label>
      <label className="ex_name col-3">{formData.name}</label>
      <label className="ex_category col-2">{formData.category}</label>
      <label className="ex_amount col-1 text-end">{formData.amount}</label>
      <label className="ex_quantity col-1 text-end">{formData.quantity}</label>
      <div className="col-1 position-relative">
        <button
          className="btn btn-secondary btn-sm position-absolute end-0"
          type="button"
          onClick={handleEdit}
        >
          Edit
        </button>
      </div>
      <div className="col-1">
        <button
          className="btn btn-warning  btn-sm"
          type="button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );

  // Page For Updating
  const renderEditForm = () => (
    <div id="expense_form_page">
      <form onSubmit={handleSaveEdit}>
        <div className="row p-1">
          <div className="col-1">
            <input
              className="form-control form-control-sm text-end"
              type="text"
              name="year"
              value={formData.year}
              onChange={onInputChange}
            />
          </div>
          <div className="col-1">
            <select
              className="form-select form-select-sm"
              name="month"
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
          <div className="col-1">
            <input
              className="form-control form-control-sm text-end"
              type="text"
              name="day"
              value={formData.day}
              onChange={onInputChange}
            />
          </div>
          <div className="col-3">
            <input
              className="form-control form-control-sm"
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
            />
          </div>
          <div className="col-2">
            <select
              className="form-select form-select-sm"
              id="category"
              name="category"
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
          <div className="col-1">
            <input
              className="form-control form-control-sm text-end"
              type="text"
              name="amount"
              value={formData.amount}
              onChange={onInputChange}
            />
          </div>
          <div className="col-1">
            <input
              className="form-control form-control-sm text-end"
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={onInputChange}
            />
          </div>
          <div className="col-1  position-relative">
            <button
              className="btn btn-primary btn-sm position-absolute end-0"
              type="submit"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </div>
          <div className="col-1">
            <button
              className="btn btn-warning  btn-sm"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return isEditing ? renderEditForm() : renderExpenseDetails();
};

export default Expense;
