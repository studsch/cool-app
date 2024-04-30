"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import Link from "next/link";
import AvatarBlock from "../avatarblock/avatarblock";
import { useWhoToFollow } from "@/store";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

interface SidebarProps {
  className?: string;
}

export function RightSidebar({ className }: SidebarProps) {
  const { data: session, status } = useSession();
  const GetContacts = useWhoToFollow(state => state.GetContacts);
  const contacts = useWhoToFollow(state => state.contacts);
  const isLoading = useWhoToFollow(state => state.isLoading);
  useEffect(() => {
    if (status == "authenticated") {
      GetContacts(session.user.tokens.access);
    }
  }, [status]);
  const skeleton_ids = [1, 2, 3];
  const [expanded, setExpanded] = useState(false);
  const itemsForDisplay = expanded ? contacts : contacts?.slice(0, 3);
  return (
    (status == "loading" || status == "authenticated") && (
      <Card className={`border-none shadow-none ${className}`}>
        <CardHeader className="p-0">
          <CardTitle className="text-text-primary-color text-base">
            Who to Follow
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-0">
          <div className="shrink-0 bg-[#F9F9F9] w-full  h-[1px]" />
          {status == "loading" || isLoading ? (
            skeleton_ids.map(val => (
              <div key={val} className="">
                <div className="flex items-center pb-3">
                  <Skeleton className="w-10 h-10 rounded-full bg-[#f5f5f5] flex-shrink-0"></Skeleton>
                  <div className="ml-4 mr-4 flex flex-col w-full gap-1">
                    <Skeleton className=" w-full h-4 bg-[#f5f5f5]"></Skeleton>
                    <Skeleton className=" w-full h-4 bg-[#f5f5f5]"></Skeleton>
                  </div>
                </div>
                <div className="shrink-0 bg-[#F9F9F9] w-full  h-[1px]" />
              </div>
            ))
          ) : contacts == null ? (
            <p
              className={`pl-1 text-sm font-light text-text-secondary-color h-14`}
            >
              Find more subscriptors for this.
            </p>
          ) : (
            itemsForDisplay?.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between space-x-4 pb-3">
                  <Link href={item.recUser.login}>
                    <AvatarBlock
                      src={item.avatarImage}
                      fallback={item.avatarFallback}
                      title={
                        item.recUser.firstName + " " + item.recUser.lastName
                      }
                      subtitle={"@" + item.recUser.login}
                      avatarPosition="other"
                    />
                  </Link>
                </div>
                <div className="shrink-0 bg-[#F9F9F9] w-full  h-[1px]" />
              </div>
            ))
          )}
        </CardContent>
        {contacts?.length && contacts.length < 4 ? null : (
          <CardFooter className="p-0">
            <Button
              variant="link"
              onClick={() => setExpanded(!expanded)}
              className="p-0 h-3"
            >
              {expanded ? "Show Less" : "Show More"}
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  );
}
