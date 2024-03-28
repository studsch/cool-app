"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type } from "os";

type Props = {
  className?: string;
  classNames?: { content?: string };
  name: string;
  control: any;
  placeholder?: string;
  msg?: boolean;
};

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function DatePickerField(props: Props) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1 my-1 w-full", props.className)}>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left text-text-primary-color",
                    !field && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "dd.LL.y")
                  ) : (
                    <span>{props.placeholder}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={cn("w-auto p-0", props.classNames?.content)}
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {props.msg && <FormMessage></FormMessage>}
        </FormItem>
      )}
    />
  );
}
