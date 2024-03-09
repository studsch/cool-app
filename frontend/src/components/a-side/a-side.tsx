"use client";
import { useResize } from "@/hooks/screens";

type Props = {
  className?: string;
  children: React.ReactNode;
};
const Aside: React.FC<Props | any> = props => {
  const width = useResize();
  console.log(width);
  return (
    <>
      {width >= 768 ? (
        <div className={`bg-white ${props.className}`}>{props.children}</div>
      ) : null}
    </>
  );
};

export default Aside;
