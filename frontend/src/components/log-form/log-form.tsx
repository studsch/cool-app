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

function LogForm({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { toast } = useToast();

  const formSchema = z.object({
    login: z
      .string()
      .min(5, { message: "Логин должен быть длинее 5 символов" }),
    password: z
      .string()
      .min(8, { message: "Пароль должен быть длинее 8 символов" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn("credentials", {
      login: form.getValues("login"),
      password: form.getValues("password"),
      redirect: false,
    });
    // console.log(res);
    if (res && res.error == null) {
      // console.log(await getSession());
      router.refresh();
      router.push(callbackUrl);
    } else {
      toast({
        title: "Sign in Error",
        description: res?.error,
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
          name="login"
          render={({ field }) => (
            <FormItem className="space-y-1 my-1">
              <FormControl>
                <Input
                  className="input input-primary"
                  type="text"
                  placeholder="Login"
                  field={field}
                  required
                ></Input>
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

export default LogForm;
