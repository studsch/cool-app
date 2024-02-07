"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, Radio } from "@nextui-org/react";

import Button from "../ui/button/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Input from "../ui/input/Input";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCallback } from "react";
import { SelectDatepicker } from "react-select-datepicker";
import { type } from "os";

function RecPassForm({ children }: { children?: React.ReactNode }) {
  // для даты
  const [dateVal, setDateVal] = useState<Date | null>();

  const onDateChange = useCallback((date: Date | null) => {
    setDateVal(date);
  }, []);

  const router = useRouter();
  const formSchema = z.object({
    password: z
      .string()
      .min(5, { message: "Логин должен быть длинее 5 символов" }),
    rePassword: z.string(),
    // .optional()
    name: z.string(),
    surname: z.string(),
    birthDay: z.date(),
    gender: z.enum(["any", "female", "male"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      rePassword: "",
      name: "",
      surname: "",
      birthDay: undefined,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("dasdas");
    console.log(values.birthDay);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1 my-1">
              <FormControl>
                <Input
                  className="input input-primary"
                  type="password"
                  placeholder="Password"
                  field={field}
                  required
                ></Input>
                {/* <PhoneNumberInput field={field} /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rePassword"
          render={({ field }) => (
            <FormItem className="space-y-1 my-1">
              <FormControl>
                <Input
                  className="input input-primary"
                  type="password"
                  placeholder="Repeat Password"
                  field={field}
                  required
                ></Input>
                {/* <PhoneNumberInput field={field} /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}

export default RecPassForm;
