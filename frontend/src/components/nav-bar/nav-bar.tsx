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
type Props = {
  className?: string;
  open?: boolean;
  setOpen?: () => {};
};
const Navbar: React.FC<Props | any> = props => {
  const path = usePathname();
  const [lastUrl, setLastUrl] = useState("");
  useEffect(() => {
    const url = path.toLocaleLowerCase();
    if (url.split("/")[1]) {
      const el = document.querySelector('a[href="/' + url.split("/")[1] + '"]');
      const prevEl = document.querySelector('a[href="/' + lastUrl + '"]');
      prevEl?.toggleAttribute("current");
      el?.setAttribute("current", "on");
      if (el?.getAttribute("href")?.slice(1) != lastUrl && lastUrl != "")
        props.setOpen(false);
      setLastUrl(el?.getAttribute("href")?.slice(1) as string);
    }
  }, [path]);

  return (
    <>
      <ServerList />
    </>
  );
};

export default Navbar;
