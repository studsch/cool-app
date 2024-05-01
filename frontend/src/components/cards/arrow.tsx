import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

export default function Arrow({
  side,
  classNames,
  size,
}: {
  side: "left" | "right";
  size?: SizeProp;
  classNames?: { base?: string; icon?: string };
}) {
  return (
    <div className={cn("", classNames?.base)}>
      <FontAwesomeIcon
        icon={faAngleLeft}
        size={size ? size : "lg"}
        className={cn(side == "right" && "rotate-180", classNames?.icon)}
      />
    </div>
  );
}
