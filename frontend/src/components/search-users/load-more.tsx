"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@nextui-org/react";
import SearchUsers from "./serch-users";
import { useSearch } from "@/store";

export function LoadMore() {
  const nextSearch = useSearch(state => state.nextSearch);
  const hasMore = useSearch(state => state.hasMore);

  const { ref, inView } = useInView();
  const loadMoreUsers = async () => {};
  useEffect(() => {
    if (inView) {
      console.log("scrolled to the end");
      nextSearch();
    }
  }, [inView]);
  return (
    <>
      <div ref={ref}>{hasMore && <Spinner className="flex mt-4" />}</div>
    </>
  );
}
