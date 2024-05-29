"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@nextui-org/react";
import { useFavorites } from "@/store";
import { useSession } from "next-auth/react";
import { DialogPostPrewie } from "../cards/dialog-post-prewie";
import { cn } from "@/lib/utils";

export function LoadMore() {
  const nextPosts = useFavorites(state => state.nextPosts);
  const totalPages = useFavorites(state => state.totalPages);
  const posts = useFavorites(state => state.posts);
  const updatePage = useFavorites(state => state.updatePage);
  const isLoading = useFavorites(state => state.isLoading);
  const updatePosts = useFavorites(state => state.updatePosts);
  const [reloadPage, setReloadPage] = useState(false);
  const page = useFavorites(state => state.page);
  const { data: session, status, update } = useSession();
  useEffect(() => {
    setReloadPage(true);
  }, []);
  useEffect(() => {
    if (session) {
      updatePage(1);
      updatePosts([]);
      nextPosts(
        session.user.tokens.access,
        session.user.tokens.refresh,
        session.user.id,
        update,
      );
      updatePage(2);
    }
    setReloadPage(false);
  }, [status, reloadPage]);
  console.log(posts);
  let error = 0;
  const { ref, inView } = useInView();
  const loadMorePosts = async () => {
    if (
      !isLoading &&
      page > 1 &&
      page < totalPages + 1 &&
      !error &&
      session?.user?.tokens?.access
    ) {
      error = await nextPosts(
        session.user.tokens.access,
        session.user.tokens.refresh,
        session.user.id,
        update,
      );
      updatePage(page + 1);
    }
    return error;
  };
  useEffect(() => {
    if (inView) {
      console.log("scrolled to the end");
      console.log(page, totalPages, isLoading);
      loadMorePosts();
    }
  }, [inView]);
  return (
    <>
      <div
        className={cn(
          "bg-white rounded-md p-7 mb-5 h-[80vh] overflow-y-hidden",
          posts.length != 0 && "h-fit overflow-y-auto",
        )}
      >
        <DialogPostPrewie
          posts={posts}
          loadMore={loadMorePosts}
        ></DialogPostPrewie>
        <div ref={ref}>
          {isLoading && page != 1 && posts.length > 0 && (
            <Spinner className="flex mt-4 " />
          )}
        </div>
      </div>
    </>
  );
}
