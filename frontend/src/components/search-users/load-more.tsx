"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@nextui-org/react";
import SearchUsers from "./serch-users";

export function LoadMore() {
  const [users, setUsers] = useState<any[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const { ref, inView } = useInView();
  const loadMoreUsers = async () => {
    const nextPage = pagesLoaded + 1;
    // const newUsers = await fetchUsers() ?? [];
    const newUsers = [{ id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }];
    setUsers((prevUsers: any[]) => [...prevUsers, ...newUsers]);
    setPagesLoaded(nextPage);
  };
  useEffect(() => {
    if (inView) {
      console.log("scrolled to the end");
      loadMoreUsers();
    }
  }, [inView]);
  return (
    <>
      <SearchUsers users={users}></SearchUsers>
      <div ref={ref}>
        <Spinner className="flex mt-4" />
      </div>
    </>
  );
}
