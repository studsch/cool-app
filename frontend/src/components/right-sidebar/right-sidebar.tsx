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
import AvatarBlock from "../avatarblock/avatarblock";

export interface ProfileInfo {
  avatarImage: string;
  avatarFallback: string;
  name: string;
  link: string;
}

interface SidebarProps {
  items: ProfileInfo[];
  className?: string;
}

export function RightSidebar({ items, className }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const itemsForDisplay = expanded ? items : items.slice(0, 3);
  return (
    <Card className={`border-none shadow-none ${className}`}>
      <CardHeader className="p-0">
        <CardTitle className="text-text-primary-color text-base">
          Who to Follow
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 p-0">
        <div className="shrink-0 bg-[#F9F9F9] w-full  h-[1px]" />
        {itemsForDisplay.map((item: ProfileInfo, index) => (
          <div key={index}>
            <div className="flex items-center justify-between space-x-4 pb-3">
              <AvatarBlock
                key={index}
                src={item.avatarImage}
                fallback={item.avatarFallback}
                title={item.name}
                subtitle={item.link}
                avatarPosition="other"
              />
            </div>
            <div className="shrink-0 bg-[#F9F9F9] w-full  h-[1px]" />
          </div>
        ))}
      </CardContent>
      <CardFooter className="p-0">
        <Button
          variant="link"
          onClick={() => setExpanded(!expanded)}
          className="p-0 h-3"
        >
          {expanded ? "Show Less" : "Show More"}
        </Button>
      </CardFooter>
    </Card>
  );
}
