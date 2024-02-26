This expense tracker web-app is for managing your expenses.

Functions

- Search expense by date(year and month)
  > The list is sorted by year, month and day
- Insert a expense
  > Strict validation check
- Delete a expense
- Show total for each category (Housing, Utilities, Transportation etc)
  > Drow a pie chart by percentage
- Custom Pagenation
  > The list is limited to displaying a specific number of items on each page.
  > To navigate between pages, we have implemented 'prev' and 'next' links.

Frameworks and Database

> React + TypeScript
> Firebase
> bootstrap 5

React hooks

> useContext
> useState
> useEffect
> useRef

Structure

- Total
- AddExpense
- ExpenseList
  - ExpenseList
    - Expense

My study from this project

"I carefully thought about integrating information.
For example, while updating, it need to update total information as well.
Another point, it shows the search conditions to ensure that the data are searched by those condition."

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
