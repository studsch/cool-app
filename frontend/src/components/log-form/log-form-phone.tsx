"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getSession, signIn, useSession } from "next-auth/react";

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
import PhoneNumberInput from "../phone-number/phone-number";
import { isValidPhoneNumber } from "react-phone-number-input";
import { ReactNode } from "react";
import { useToast } from "../ui/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { authConfig } from "@/config/auth";

function LogFormPhone({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { toast } = useToast();

  const formSchema = z.object({
    phoneNumber: z
      .string()
      // .optional()
      .refine(val => typeof val != "undefined" && isValidPhoneNumber(val), {
        message: "Введен некорректный номер, попробуйте исправить",
      }),
    password: z
      .string()
      .min(8, { message: "Пароль должен содержать больше 7 символов" })
      .max(250, { message: "Пароль не должен превышать 250 символов" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn("phone-enter", {
      phoneNumber: values.phoneNumber,
      password: values.password,
      redirect: false,
    });
    if (res && res.error == null) {
      // console.log(await getSession());
      router.refresh();
      router.push(callbackUrl);
    } else {
      toast({
        title: "Sign in Error",
        description: res?.error,
        duration: 2000,
      });
      // console.log(res);
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(isValidPhoneNumber(values.number));
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="space-y-1 my-1">
              <FormControl>
                <PhoneNumberInput
                  className={"phone phone-secondary"}
                  field={field}
                />
                {/* <PhoneNumberInput field={field} /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
        <Button type="submit" text="Sign in" className="btn btn-primary" />
      </form>
    </Form>
  );
}

export default LogFormPhone;
