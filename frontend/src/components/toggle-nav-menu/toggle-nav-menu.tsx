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

type Props = {
  className?: string;
};

const ToggleNavBar: React.FC<Props | any> = props => {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <FontAwesomeIcon icon={faBars} className="text-text-primary-color" />
        </DialogTrigger>
        <DialogContent className="h-full fixed left-[-50%] z-50 w-1/2 translate-x-[100%] data-[state=closed]:slide-out-to-left-full data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="py-[2vh]">
              <Link href="/" className="text-2xl text-button-primary-color">
                Memories
              </Link>
            </DialogTitle>
            <DialogDescription>
              <Navbar></Navbar>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ToggleNavBar;
