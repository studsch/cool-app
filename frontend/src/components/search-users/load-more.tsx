"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@nextui-org/react";
import Searchs from "./serch-users";
import { useSearch } from "@/store";

export function LoadMore() {
  const nextSearch = useSearch(state => state.nextSearch);
  const totalPages = useSearch(state => state.totalPages);
  const searchs = useSearch(state => state.searchs);
  const updatePage = useSearch(state => state.updatePage);
  const isLoading = useSearch(state => state.isLoading);
  const type = useSearch(state => state.type);
  const page = useSearch(state => state.page);
  let error = 0;
  const { ref, inView } = useInView();
  const loadMoreUsers = async () => {
    if (page < totalPages && !error) {
      updatePage(page + 1);
      error = await nextSearch();
    }
  };
  useEffect(() => {
    console.log(isLoading);
    if (inView) {
      console.log("scrolled to the end");
      loadMoreUsers();
    }
  }, [inView]);
  return (
    <>
      <Searchs searchs={searchs} type={type}></Searchs>
      <div ref={ref}>
        {isLoading && page != 1 && <Spinner className="flex mt-4" />}
      </div>
    </>
  );
}
