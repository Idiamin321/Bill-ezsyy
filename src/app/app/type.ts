export interface Person {
  id: string;
  name: string;
}

export enum SplitType {
  EQUAL = "EQUAL",
  EXACT = "EXACT",
  PERCENT = "PERCENT",
}

export enum SplitTypeLabel {
  EQUAL = "Equally",
  EXACT = "Exact Amount",
  PERCENT = "Percentage",
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: Date;
  paidBy: string;
  splitType: SplitType;
  split: {
    [key: string]: number;
  };
}

export interface Debt {
  lenderId: string;
  borrowerId: string;
  amount: number;
  transactionId: string;
}

export interface AppContextValue {
  people: Person[];
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  debts: Debt[];
  simplifyDebts: boolean;
  setSimplifyDebts: (simplifyDebts: boolean) => void;
  reset: () => void;
}

export interface AppContextProviderProps {
  children: React.ReactNode | React.ReactNode[];
}
