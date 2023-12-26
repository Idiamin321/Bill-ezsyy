import { Debt, Transaction } from "@/app/app/type";
import {
  calculateNewBalances,
  calculatePortion,
  checkIfPersonRemovable,
  combinations,
  generateDebtFromTransaction,
  dividePeopleIntoZeroSumSubsets,
  getBalanceOfAPerson,
} from ".";
import { debtsBuilder, personWithBalanceBuilder } from "./builder";
import {
  PERSON_1,
  PERSON_2,
  PERSON_3,
  SPLIT_EQUAL_TRANSACTION,
  SPLIT_EXACT_TRANSACTION,
  SPLIT_PERCENT_TRANSACTION,
} from "./constant";

describe("calculatePortion", () => {
  it.each([
    [
      "return correctly for payer at equal split",
      49,
      SPLIT_EQUAL_TRANSACTION,
      "1",
    ],
    [
      "return correctly for non-payer participant at equal split",
      49,
      SPLIT_EQUAL_TRANSACTION,
      "2",
    ],
    [
      "return correctly for non-participant at equal split",
      0,
      SPLIT_EQUAL_TRANSACTION,
      "3",
    ],
    [
      "return correctly for payer at percent split",
      50,
      SPLIT_PERCENT_TRANSACTION,
      "1",
    ],
    [
      "return correctly for non-payer participant at percent split",
      50,
      SPLIT_PERCENT_TRANSACTION,
      "2",
    ],
    [
      "return correctly for non-participant at percent split",
      0,
      SPLIT_PERCENT_TRANSACTION,
      "3",
    ],
    [
      "return correctly for payer at exact split",
      69,
      SPLIT_EXACT_TRANSACTION,
      "1",
    ],
    [
      "return correctly for non-payer participant at exact split",
      30,
      SPLIT_EXACT_TRANSACTION,
      "2",
    ],
    [
      "return correctly for non-participant at exact split",
      0,
      SPLIT_EXACT_TRANSACTION,
      "3",
    ],
  ])("%s", (_, expected, ...args) => {
    expect(calculatePortion(...args)).toBe(expected);
  });
});

describe("generateDebtFromTransaction", () => {
  it.each([
    [
      "return correctly for equal split",
      [
        {
          lenderId: "1",
          borrowerId: "2",
          amount: 49,
          transactionId: "1",
        },
      ],
      SPLIT_EQUAL_TRANSACTION,
    ],
    [
      "return correctly for percent split",
      [
        {
          lenderId: "1",
          borrowerId: "2",
          amount: 50,
          transactionId: "1",
        },
      ],
      SPLIT_PERCENT_TRANSACTION,
    ],
    [
      "return correctly for exact split",
      [
        {
          lenderId: "1",
          borrowerId: "2",
          amount: 30,
          transactionId: "1",
        },
      ],
      SPLIT_EXACT_TRANSACTION,
    ],
  ])("%s", (_, expected, transaction) => {
    expect(generateDebtFromTransaction(transaction)).toEqual(expected);
  });
});

describe("getBalanceOfAPerson", () => {
  it.each([
    [
      "return correctly for person with no debt",
      {
        ...PERSON_1,
        balance: 0,
        paysTo: {},
      },
      PERSON_1,
      [] as Debt[],
    ],
    [
      "return correctly for lender from single transaction",
      {
        ...PERSON_1,
        balance: 49,
        paysTo: {
          "2": -49,
        },
      },
      PERSON_1,
      debtsBuilder({
        lenderIds: ["1"],
        borrowerIds: ["2"],
        amounts: [49],
        transactionIds: ["1"],
      }),
    ],
    [
      "return correctly for borrower from single transaction",
      {
        ...PERSON_2,
        balance: -49,
        paysTo: {
          "1": 49,
        },
      },
      PERSON_2,
      debtsBuilder({
        lenderIds: ["1"],
        borrowerIds: ["2"],
        amounts: [49],
        transactionIds: ["1"],
      }),
    ],
    [
      "return correctly for lender from two transactions same borrower",
      {
        ...PERSON_1,
        balance: 99,
        paysTo: {
          "2": -99,
        },
      },
      PERSON_1,
      debtsBuilder({
        lenderIds: ["1", "1"],
        borrowerIds: ["2", "2"],
        amounts: [49, 50],
        transactionIds: ["1", "2"],
      }),
    ],
    [
      "return correctly for lender from two transactions different borrower",
      {
        ...PERSON_1,
        balance: 79,
        paysTo: {
          "2": -49,
          "3": -30,
        },
      },
      PERSON_1,
      debtsBuilder({
        lenderIds: ["1", "1"],
        borrowerIds: ["2", "3"],
        amounts: [49, 30],
        transactionIds: ["1", "2"],
      }),
    ],
    [
      "return correctly for borrower from two transactions same lender",
      {
        ...PERSON_2,
        balance: -99,
        paysTo: {
          "1": 99,
        },
      },
      PERSON_2,
      debtsBuilder({
        lenderIds: ["1", "1"],
        borrowerIds: ["2", "2"],
        amounts: [49, 50],
        transactionIds: ["1", "2"],
      }),
    ],
    [
      "return correctly for borrower from two transactions different lender",
      {
        ...PERSON_2,
        balance: -79,
        paysTo: {
          "1": 49,
          "3": 30,
        },
      },
      PERSON_2,
      debtsBuilder({
        lenderIds: ["1", "3"],
        borrowerIds: ["2", "2"],
        amounts: [49, 30],
        transactionIds: ["1", "2"],
      }),
    ],
    [
      "return correctly for lender and borrower from two transactions same lender and borrower",
      {
        ...PERSON_1,
        balance: 0,
        paysTo: {
          "2": 0,
        },
      },
      PERSON_1,
      debtsBuilder({
        lenderIds: ["1", "2"],
        borrowerIds: ["2", "1"],
        amounts: [49, 49],
        transactionIds: ["1", "2"],
      }),
    ],
    [
      "return correctly for lender and borrower from two transactions different lender and borrower",
      {
        ...PERSON_1,
        balance: 49 - 30,
        paysTo: {
          "2": -49,
          "3": 30,
        },
      },
      PERSON_1,
      debtsBuilder({
        lenderIds: ["1", "3"],
        borrowerIds: ["2", "1"],
        amounts: [49, 30],
        transactionIds: ["1", "2"],
      }),
    ],
    [
      "return correctly for lender and borrower from multiple transactions",
      {
        ...PERSON_1,
        balance: 10 - 15 + 20 - 5 - 10 + 5,
        paysTo: {
          "2": -10 + 15 + 10 - 5,
          "3": -20 + 5,
        },
      },
      PERSON_1,
      debtsBuilder({
        lenderIds: ["1", "2", "1", "3", "2", "1"],
        borrowerIds: ["2", "1", "3", "1", "1", "2"],
        amounts: [10, 15, 20, 5, 10, 5],
        transactionIds: ["1", "2", "3", "4", "5", "6"],
      }),
    ],
    [
      "return correctly for non-participant",
      {
        ...PERSON_3,
        balance: 0,
        paysTo: {},
      },
      PERSON_3,
      debtsBuilder({
        lenderIds: ["1", "2"],
        borrowerIds: ["2", "1"],
        amounts: [10, 15],
        transactionIds: ["1", "2"],
      }),
    ],
  ])("%s", (_, expected, person, debts) => {
    expect(getBalanceOfAPerson(person, debts)).toEqual(expected);
  });
});

describe("checkIfPersonRemovable", () => {
  it.each([
    [
      "return correctly for person with no transaction",
      {
        removable: true,
        reason: "No transaction involving this person",
        transactions: [],
      },
      [] as Transaction[],
      "1",
    ],
    [
      "return correctly for payer",
      {
        removable: false,
        reason: "This person is involved in some transactions",
        transactions: [SPLIT_EQUAL_TRANSACTION],
      },
      [SPLIT_EQUAL_TRANSACTION],
      "1",
    ],
    [
      "return correctly for non-payer participant",
      {
        removable: false,
        reason: "This person is involved in some transactions",
        transactions: [SPLIT_EQUAL_TRANSACTION],
      },
      [SPLIT_EQUAL_TRANSACTION],
      "2",
    ],
    [
      "return correctly for non-participant",
      {
        removable: true,
        reason: "No transaction involving this person",
        transactions: [],
      },
      [SPLIT_EQUAL_TRANSACTION],
      "3",
    ],
  ])("%s", (_, expected, transactions, id) => {
    expect(checkIfPersonRemovable(transactions, id)).toEqual(expected);
  });
});

describe("calculateNewBalances", () => {
  const DEBTS = debtsBuilder({
    lenderIds: ["2", "3"],
    borrowerIds: ["1", "2"],
    amounts: [10, 10],
    transactionIds: ["1", "2"],
  });

  it("return correctly", () => {
    expect(calculateNewBalances([PERSON_1, PERSON_2, PERSON_3], DEBTS)).toEqual(
      [
        {
          ...getBalanceOfAPerson(
            {
              ...PERSON_1,
              simplifiedPaysTo: {
                "3": -10,
              },
            },
            DEBTS
          ),
        },
        {
          ...getBalanceOfAPerson({ ...PERSON_2, simplifiedPaysTo: {} }, DEBTS),
        },
        {
          ...getBalanceOfAPerson(
            {
              ...PERSON_3,
              simplifiedPaysTo: {
                "1": 10,
              },
            },
            DEBTS
          ),
        },
      ]
    );
  });
});

describe("combinations", () => {
  it.each([
    ["k0 l3", [[]], ["1", "2", "3"], 0],
    ["k1 l3", [["1"], ["2"], ["3"]], ["1", "2", "3"], 1],
    [
      "k2 l3",
      [
        ["1", "2"],
        ["1", "3"],
        ["2", "3"],
      ],
      ["1", "2", "3"],
      2,
    ],
    [
      "k2 l4",
      [
        ["1", "2"],
        ["1", "3"],
        ["1", "4"],
        ["2", "3"],
        ["2", "4"],
        ["3", "4"],
      ],
      ["1", "2", "3", "4"],
      2,
    ],
    ["k3 l3", [["1", "2", "3"]], ["1", "2", "3"], 3],
  ])("%s", (_, expected, arr, k) => {
    expect(combinations(arr, k)).toEqual(expected);
  });
});

describe("dividePeopleIntoZeroSumSubsets", () => {
  it.each([
    ["return correctly for empty array", [] as number[][], [] as number[]],
    ["return correctly for 0", [[0]], [0]],
    ["return correctly for 0 0", [[0], [0]], [0, 0]],
    ["return correctly for 1 -1", [[1, -1]], [1, -1]],
    ["return correctly for 1 2 -3", [[1, 2, -3]], [1, 2, -3]],
    ["return correctly for 1 0 -1", [[1, -1], [0]], [1, 0, -1]],
    [
      "return correctly for 1 -1 2 -2",
      [
        [1, -1],
        [2, -1],
      ],
      [1, -1, 2, -2],
    ],
  ])("%s", (_, expected, arr) => {
    const people = arr.map((balance) => personWithBalanceBuilder(balance));
    expect(dividePeopleIntoZeroSumSubsets(people)).toHaveLength(
      expected.length
    );
  });
});
