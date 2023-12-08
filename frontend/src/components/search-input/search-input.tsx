"use client";
import React, { useState } from "react";
import useTimeout from "./useTimeout";

const names = [
  "Andrey, Stepan",
  "Valerii, Nazar",
  "Masha, Dasha",
  "Katya, Petya",
  "Spider, Man",
];

export default function SearchInput() {
  const [filteredList, setFilteredList] = useState<string[]>(names);
  const timeout = useTimeout();

  function handleFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    timeout(() => {
      const newList = names.filter(name =>
        name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredList(newList);
    });
  }

  return (
    <div>
      <input onChange={handleFilter} />

      <ul>
        {filteredList.map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
