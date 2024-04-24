"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import "./style.scss";
import ExploreSvg from "../../../public/explore.svg";
import Image from "next/image";
import Link from "next/link";
import ServerList from "./server-list";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useResize } from "@/hooks/screens";
type Props = {
  className?: string;
  open?: boolean;
  setOpen?: () => {};
  children: React.ReactNode;
};
const Navbar: React.FC<Props | any> = props => {
  const path = usePathname();
  const [lastUrl, setLastUrl] = useState("");
  const width = useResize();
  useEffect(() => {
    if (typeof props.setOpen !== "undefined" && width >= 1281) {
      props.setOpen(false);
    }
  }, [width]);
  useEffect(() => {
    const url = path.toLocaleLowerCase();
    if (url.split("/")[1]) {
      const el = document.querySelectorAll(
        'a[href="/' + url.split("/")[1] + '"]',
      );
      const prevEl = document.querySelector('a[href="/' + lastUrl + '"]');
      prevEl?.toggleAttribute("current");
      el.forEach(element => {
        element?.setAttribute("current", "on");
        if (
          element?.getAttribute("href")?.slice(1) != lastUrl &&
          lastUrl != "" &&
          typeof props.setOpen !== "undefined"
        )
          props.setOpen(false);
        setLastUrl(element?.getAttribute("href")?.slice(1) as string);
      });
    }
  }, [path]);

  return (
    <>
      <ServerList />
    </>
  );
};

export default Navbar;
