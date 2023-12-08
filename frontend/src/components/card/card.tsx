"use client";

import React from "react";
import { DatePickerWithRange } from "@/components/daterangecalendar/daterangecalendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarBlock from "@/components/avatarblock/avatarblock";
import { ComboboxDemo } from "@/components/combobox/combobox";
import { MoreHorizontal } from "lucide-react";
import { Image } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Share2 } from "lucide-react";
import { Bookmark } from "lucide-react";
import { AutoComplete } from "@/components/autocomplete/autocomplete";

export default function PostCard() {
  return (
    <div className="grid place-content-center">
      <span className="align-middle">
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div className="grid place-content-center">
                <AvatarBlock />
              </div>
              <div className="grid place-content-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Repost</DropdownMenuItem>
                    <DropdownMenuItem>Don't show this content</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid place-content-center">
              <Image
                width={510}
                alt="NextUI hero Image"
                src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between">
              <Button variant="ghost">
                <div className="flex">
                  <div className="grid place-content-left">
                    <Heart />
                  </div>
                  <div className="pl-2 grid place-content-left">
                    <div className="text-black">Like</div>
                  </div>
                </div>
              </Button>
              <Button variant="ghost">
                <div className="flex">
                  <div className="grid place-content-left">
                    <MessageCircle />
                  </div>
                  <div className="pl-2 grid place-content-left">
                    <div className="text-black">Comment</div>
                  </div>
                </div>
              </Button>
              <Button variant="ghost">
                <div className="flex">
                  <div className="grid place-content-left">
                    <Share2 />
                  </div>
                  <div className="pl-2 grid place-content-left">
                    <div className="text-black">Share</div>
                  </div>
                </div>
              </Button>
              <Button variant="ghost">
                <div className="flex">
                  <div className="grid place-content-left">
                    <Bookmark />
                  </div>
                  <div className="pl-2 grid place-content-left">
                    <div className="text-black">Save</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </span>
    </div>
  );
}
