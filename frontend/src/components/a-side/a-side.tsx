"use client";
import { useResize } from "@/hooks/screens";
import { number } from "zod";

type Props = {
  className?: string;
  children: React.ReactNode;
  minWidth: number;
};
const Aside: React.FC<Props | any> = props => {
  const width = useResize();
  return (
    <>
      {width >= props.minWidth ? (
        <div className={`${props.className}`}>{props.children}</div>
      ) : null}
    </>
  );
};

export default Aside;
