import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AvatarBlock from "../avatarblock/avatarblock";
import { PostMore } from "./more";
import { PostImage } from "./post-image";

export function DialogPostPrewie() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <AvatarBlock
              title="Albert Enstein"
              subtitle="22 September, 2024"
              classNames={{ img: "h-12 w-12" }}
              avatarPosition="other"
            />
            <PostMore></PostMore>
          </div>
          <PostImage></PostImage>
        </div>
      </DialogContent>
    </Dialog>
  );
}
