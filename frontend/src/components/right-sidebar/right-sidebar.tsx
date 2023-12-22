"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Link from "next/link";

export interface ProfileInfo {
  avatarImage: string;
  avatarFallback: string;
  name: string;
  link: string;
}

interface SidebarProps {
  items: ProfileInfo[];
}

export function RightSidebar({ items }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const itemsForDisplay = expanded ? items : items.slice(0, 3);
  return (
    <Card className="w-[350px]">
      <CardHeader className="p-3">
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <div className="shrink-0 bg-border h-[1px] w-full"></div>
      <CardContent className="grid gap-3 p-3">
        {itemsForDisplay.map((item: ProfileInfo, index) => (
          <div
            key={index}
            className="flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={item.avatarImage} />
                <AvatarFallback>{item.avatarFallback}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <Link
                  href={`/profile/${item.link}`}
                  className="hover:underline cursor-pointer text-sm text-muted-foreground"
                >
                  {item.link}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="shrink-0 bg-border h-[1px] w-full"></div>
      <CardFooter className="p-0">
        <Button variant="link" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show Less" : "Show More"}
        </Button>
      </CardFooter>
    </Card>
  );
}
