"use client";

import { useState } from "react";
import Button from "../ui/button/Button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { FollowTo, UnFollowFrom } from "@/fetch/user";
import {
  RenewToken,
  RenewWrapper,
  tokenUpdateStateGlobal,
} from "@/fetch/token";
type Props = {
  className?: string;
  classNames?: {};
  isSubscribed: boolean;
  userId: string;
  onClick?: () => {};
};
const SubscribeButton: React.FC<Props | any> = props => {
  const [isSubscribed, setIsSubscribed] = useState(props.isSubscribed);
  const { data: session, status, update } = useSession();
  const { classNames, restProps, userId } = props;
  const onClick = async () => {
    if (session?.user?.tokens?.access) {
      if (!isSubscribed) {
        const res = await RenewWrapper(
          FollowTo,
          [session.user.tokens.access, userId],
          RenewToken,
          [session.user.id, session.user.tokens.refresh],
          update,
          tokenUpdateStateGlobal,
        );
        if (res == 201) {
          setIsSubscribed(true);
        }
      } else {
        const res = await RenewWrapper(
          UnFollowFrom,
          [session.user.tokens.access, userId],
          RenewToken,
          [session.user.id, session.user.tokens.refresh],
          update,
          tokenUpdateStateGlobal,
        );
        if (res == 200) {
          setIsSubscribed(false);
        }
      }
    }

    return true;
  };
  return (
    <div className="">
      <Button
        type="button"
        text={!isSubscribed ? "Subscribe" : "Unsubscribe"}
        onClick={onClick}
        className={cn(
          !isSubscribed && "btn btn-primary",
          isSubscribed && "btn btn-secondary",
        )}
      ></Button>
    </div>
  );
};

export default SubscribeButton;
