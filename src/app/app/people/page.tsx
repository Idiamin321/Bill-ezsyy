"use client";

import useFormState from "@/hooks/useFormState";
import { required, validate } from "@/utils/forms";
import { useAppContext } from "../context";
import { TrashIcon } from "@heroicons/react/24/outline";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

export default function Page() {
  const { data, updateData, isValid, resetData } = useFormState(
    {
      name: "",
    },
    {
      name: validate([required]),
    }
  );
  const { people, addPerson, removePerson } = useAppContext();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPerson(data.name);
    resetData();
  };

  return (
    <div className="py-4 flex flex-col gap-4">
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Add New Person</h2>
          <form className="join" onSubmit={onSubmit}>
            <input
              className="input w-full input-bordered join-item"
              placeholder="Enter name"
              value={data.name}
              onChange={(e) => updateData("name", e.target.value)}
            />
            <button
              className="btn btn-primary join-item"
              disabled={!isValid}
              type="submit"
            >
              ADD
            </button>
          </form>
        </div>
      </div>
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="card-title">People</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {people.map((person) => (
              <div key={person.id} className="card card-compact bg-base-100">
                <div className="card-body flex flex-row gap-4 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={createAvatar(funEmoji, {
                      seed: person.name,
                    }).toDataUriSync()}
                    alt={person.name}
                    className="mask mask-squircle w-12 h-12"
                  />
                  <div className="w-full">{person.name}</div>
                  <div className="join shrink-0">
                    <button
                      className="btn btn-ghost join-item"
                      type="button"
                      onClick={() => removePerson(person.id)}
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {people.length === 0 && (
            <div className="text-center text-sm text-gray-500">
              No people added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
