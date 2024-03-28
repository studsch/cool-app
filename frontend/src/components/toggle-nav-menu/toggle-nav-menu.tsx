"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../nav-bar/nav-bar";
import { useState } from "react";

type Props = {
  className?: string;
};

const ToggleNavBar: React.FC<Props | any> = props => {
  const [open, setOpen] = useState(false);
  return (
    <div className={props.className}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <FontAwesomeIcon icon={faBars} className="text-text-primary-color" />
        </DialogTrigger>
        <DialogContent className="h-full max-w-none fixed left-[-50%] md:pl-10 md:left-[-34%] z-50 w-1/2 md:w-1/3 translate-x-full data-[state=closed]:slide-out-to-left-full data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="py-[2vh]">
              <Link href="/" className="text-2xl text-button-primary-color">
                Memories
              </Link>
            </DialogTitle>
            <DialogDescription asChild>
              <Navbar open={open} setOpen={setOpen}></Navbar>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ToggleNavBar;
