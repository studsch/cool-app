"use client";
import { useSession } from "next-auth/react";
import AvatarBlock from "../avatarblock/avatarblock";
import { useMyContacts } from "@/store";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  className?: string;
};

const MyContacts: React.FC<Props | any> = ({
  props,
  children,
}: {
  props: React.FC<Props | any>;
  children: React.ReactNode;
}) => {
  const GetContacts = useMyContacts(state => state.GetContacts);
  const contacts = useMyContacts(state => state.contacts);
  const isLoading = useMyContacts(state => state.isLoading);
  const { data: session, status } = useSession();
  // GetContacts(session?.user?.tokens?.access as string);
  useEffect(() => {
    if (status == "authenticated") {
      GetContacts(session.user.tokens.access, session.user.tokens.refresh);
      console.log(contacts);
    }
  }, [status]);
  const skeleton_ids = [1, 2, 3, 4];
  return (
    <>
      {children}
      {/* Нужно будет мапу добавить потом */}
      <div className="gap-5 flex flex-col">
        {typeof contacts === "undefined" || isLoading ? (
          skeleton_ids.map(val => (
            <div key={val} className="flex items-center ">
              <Skeleton className="w-12 h-12 rounded-full bg-[#f5f5f5] flex-shrink-0"></Skeleton>
              <div className="ml-4 mr-4 flex flex-col w-full gap-1">
                <Skeleton className=" w-full h-4 bg-[#f5f5f5]"></Skeleton>
                <Skeleton className=" w-full h-4 bg-[#f5f5f5]"></Skeleton>
              </div>
            </div>
          ))
        ) : contacts == null ? (
          <p
            className={`pl-4 text-sm font-light text-text-secondary-color h-14`}
          >
            Make more friends who subscribe to you too
          </p>
        ) : (
          contacts.map(
            (user, index) => (
              console.log(user),
              (
                <AvatarBlock
                  key={index}
                  title={user.firstName + " " + user.lastName}
                  subtitle={"@" + user.login}
                  classNames={{ img: "h-12 w-12" }}
                  avatarPosition="other"
                />
              )
            ),
          )
        )}
      </div>
    </>
  );
};

export default MyContacts;
