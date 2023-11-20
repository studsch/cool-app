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
import AvatarBlock from "@/components/avatarblock/avatarblock";
import { ComboboxDemo } from "@/components/combobox/combobox";
import { MoreHorizontal } from "lucide-react";
import { Image } from "@nextui-org/react";

export default function page() {
  return (
    <div className="grid place-content-center">
      <span className="align-middle">
        <Card>
          <CardHeader>
            <div className="flex">
              <div className="pr-80 grid place-content-center">
                <AvatarBlock />
              </div>
              <div className="grid place-content-center">
                <MoreHorizontal />
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
            <p>Card Footer</p>
          </CardFooter>
        </Card>
        <DatePickerWithRange />
      </span>
    </div>
  );
}
