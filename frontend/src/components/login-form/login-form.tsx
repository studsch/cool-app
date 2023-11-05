"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
// import { isValidPhoneNumber } from "react-phone-number-input";

function LoginForm() {
  // const formSchema = z.object({
  //   number: z
  //     .string()
  //     .optional()
  //     .refine(val => typeof val != "undefined" && isValidPhoneNumber(val), {
  //       message: "Введен некорректный номер",
  //     }),
  // });

  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    login: z.string().min(6, {
      message: "Login must be at least 6 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      login: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(isValidPhoneNumber(values.number));
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="input input-secondary"
                  type="email"
                  placeholder="email"
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
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="input input-secondary"
                  type="text"
                  placeholder="login"
                  field={field}
                  required
                ></Input>
                {/* <PhoneNumberInput field={field} /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default LoginForm;
