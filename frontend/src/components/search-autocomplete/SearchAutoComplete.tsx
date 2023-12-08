"use client";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { Item } from "./data";
import useQuery from "./hooks/use-query";

export function GroupBy<T, K extends keyof T>(array: T[], key: K) {
  let map = new Map<T[K], T[]>();
  array.forEach(item => {
    let itemKey = item[key];
    if (!map.has(itemKey)) {
      map.set(
        itemKey,
        array.filter(i => i[key] === item[key]),
      );
    }
  });
  return map;
}

type SearchItemProps = {
  item: Item;
};

function SearchItem({ item }: SearchItemProps) {
  const classes = useStyles();
  return (
    <div className={classes.searchResultItem}>
      {"imgUrl" in item && (
        <img height={"30px"} width={"30px"} src={item.imgUrl} alt={item.name} />
      )}
      <span style={{ marginLeft: "0.5rem" }}>{item.name}</span>
    </div>
  );
}

function SearchAutoComplete() {
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const { data, loading } = useQuery({ query: query });
  const groupedResults = data && data.length > 0 && GroupBy(data, "category");

  return (
    <main className={classes.main}>
      <input
        type="search"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
        value={query}
        placeholder="search...."
        className={classes.input}
      />
      {loading ? (
        <p>Loading....</p>
      ) : (
        query && (
          <div className={classes.searchResults}>
            {groupedResults &&
              Array.from(groupedResults.entries()).map((item, ix) => {
                const [category, data] = item;
                return (
                  <div
                    key={ix}
                    style={{
                      borderTop: `${
                        groupedResults.size > 1 ? "0" : "solid 0.1rem #d8dae5"
                      }`,
                    }}
                  >
                    <h1 className={classes.searchResultHeading}>
                      {category.toUpperCase()}
                    </h1>
                    {data.map((item: Item, ix: number) => (
                      <SearchItem item={item} key={ix} />
                    ))}
                  </div>
                );
              })}
          </div>
        )
      )}
    </main>
  );
}

const useStyles = createUseStyles({
  main: {
    padding: "1rem 0 0 1rem",
    flexBasis: 0,
    flexGrow: 999,
    minInlineSize: "50%",
  },
  input: {
    width: "30rem",
    padding: "0.5rem",
  },
  searchResults: {
    width: "30rem",
  },
  searchResultHeading: {
    fontSize: "0.8rem",
    border: "solid 0.1rem #d8dae5",
    borderTop: 0,
    padding: "1rem 0 0.5rem 1rem",
    marginBottom: 0,
    marginTop: 0,
  },
  searchResultItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 0 0.5rem 1rem",
    border: "0.1rem solid #d8dae5",
    borderTop: 0,
  },
});

export default SearchAutoComplete;
