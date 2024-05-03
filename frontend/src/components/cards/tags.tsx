import React from "react";
import { cn } from "@/lib/utils";

export default function Tags({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1", className)}>
      {tags.map((val: any, index: number) => (
        <p key={index} className="link ">
          #{val}
        </p>
      ))}
    </div>
  );
}
