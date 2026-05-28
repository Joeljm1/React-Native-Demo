interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}
const expenseData: Expense[] = [
  {
    id: "1",
    title: "Groceries",
    amount: 50.0,
    date: "2024-06-01",
  },
  {
    id: "2",
    title: "Rent",
    amount: 1200.0,
    date: "2024-06-03",
  },
  {
    id: "3",
    title: "Utilities",
    amount: 150.0,
    date: "2024-06-05",
  },
];

export type { Expense };
export default expenseData;
