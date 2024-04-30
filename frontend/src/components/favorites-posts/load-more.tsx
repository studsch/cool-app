"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@nextui-org/react";
import { useFavorites } from "@/store";
import { useSession } from "next-auth/react";

export function LoadMore() {
  const nextPosts = useFavorites(state => state.nextPosts);
  const totalPages = useFavorites(state => state.totalPages);
  const posts = useFavorites(state => state.posts);
  const updatePage = useFavorites(state => state.updatePage);
  const isLoading = useFavorites(state => state.isLoading);
  const page = useFavorites(state => state.page);
  const { data: session, status, update } = useSession();
  useEffect(() => {
    if (session) {
      nextPosts(
        session.user.tokens.access,
        session.user.tokens.refresh,
        session.user.id,
        update,
      );
    }
  }, [status]);
  console.log(posts);
  let error = 0;
  const { ref, inView } = useInView();
  const loadMoreUsers = async () => {
    if (page < totalPages && !error && session?.user?.tokens?.access) {
      updatePage(page + 1);
      error = await nextPosts(
        session.user.tokens.access,
        session.user.tokens.refresh,
        session.user.id,
        update,
      );
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
      <p>test</p>
      <div ref={ref}>
        {isLoading && page != 1 && <Spinner className="flex mt-4" />}
      </div>
    </>
  );
}
