import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useContext,
} from "react";
import { api } from "../services/api";

interface Transaction {
  id: number;
  title: string;
  amout: number;
  type: string;
  category: string;
  createdAt: string;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

/* interface TransactionInput{
  title: string;
  amount: number;
  type: string;
  category: string;
} */

// Vai herdar todos os tipos da interface Transaction e omitir os campo id e createdAT
//! Omit pega todos os campos e retirna alguns!
type TransactionInput = Omit<Transaction, "id" | "createdAt">;

//! O Pick seleciona os campos que eu quero
//! Pega todos os campos que quero
//? type TransactionInput = Pick<Transaction, 'title' | 'amout' | 'type' | 'category'>;

const TransactionsContext = createContext({} as TransactionsContextData);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api
      .get("trasactions")
      .then((response) => setTransactions(response.data.transactions));
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post("/transactions", {
      ...transactionInput,
      createdAt: new Date(),
    });
    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  async function deleteTransaction(id: number) {
    const newTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    setTransactions(newTransactions);
  }

  return (
    <TransactionsContext.Provider
      value={{ transactions, createTransaction, deleteTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}
