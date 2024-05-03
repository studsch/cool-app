import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

export default function Geolocation({
  className,
  location,
}: {
  location: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <FontAwesomeIcon
        icon={faLocationDot}
        className="text-button-primary-color"
      />
      <p className="text-button-primary-color">{location}</p>
    </div>
  );
}
