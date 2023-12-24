import { FC } from "react";
import { Person, Transaction } from "../type";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAppContext } from "../context";
import { PersonLabel } from "../person";
import { formatMoney } from "@/utils/common";
import { usePeopleStore } from "@hooks/usePeopleStore";

interface TrxCardProps {
  trx: Transaction;
  person: Person;
}

export const TrxCard: FC<TrxCardProps> = ({ trx, person }) => {
  const { removeTransaction, debts } = useAppContext();
  const { peopleMap } = usePeopleStore();

  return (
    <div className="card card-compact bg-base-200">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <div className="card-title">{trx.name}</div>
          <div>
            {new Date(trx.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <PersonLabel person={person} prefix="Paid by" size="sm" />
          <div>{formatMoney(trx.amount)}</div>
        </div>

        <div className="card card-compact bg-base-100 mt-1">
          <div className="card-body">
            {debts
              .filter((debt) => debt.transactionId === trx.id)
              .map((debt) => (
                <div
                  key={`${debt.transactionId}-${debt.borrowerId}-${debt.lenderId}`}
                  className="flex justify-between"
                >
                  <PersonLabel
                    person={peopleMap[debt.borrowerId]}
                    suffix="owes"
                    size="sm"
                  />

                  <div>{formatMoney(debt.amount)}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="card-actions justify-end join">
          <button
            className="btn btn-ghost btn-sm join-item text-error"
            type="button"
            onClick={() => removeTransaction(trx.id)}
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
