"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, Radio } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import Button from "../ui/button/Button";
import RegError from "../errors/reg-error";
import { ServerAction } from "./server";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { auth } from "@/config/firebase.config";
import Input from "../ui/input/Input";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useConfirmCodeRecovery } from "@/store";

function RecPassForm({
  children,
  titles,
}: {
  children?: React.ReactNode;
  titles?: React.ReactNode;
}) {
  // для даты
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const number = useConfirmCodeRecovery(state => state.number);
  const startTime = useConfirmCodeRecovery(state => state.startTime);
  const [isError, setIsError] = useState(false);
  const timeLimit = 60;
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthState = async () => {
      await auth.authStateReady();
      // Do whatever you want here ...

      // E.g. checking whether the user is logged in or not:
      setIsAuthReady(true);
      // End of E.g.
    };
    setIsLoaded(useConfirmCodeRecovery.persist.hasHydrated());

    checkAuthState();
  }, []);

  const router = useRouter();
  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: "Пароль должен содержать больше 7 символов" })
        .max(250, { message: "Пароль не должен превышать 250 символов" }),
      rePassword: z.string(),
      // .optional()
    })
    .refine(obj => obj.password === obj.rePassword, {
      message: "Пароли не совпадают",
      path: ["rePassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      rePassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await ServerAction(number, values.password);
    if (res == 204) {
      router.push("/enter");
    } else {
      toast({
        title: "Something went wrong",
        description: "Repass error, please try one more later",
        duration: 2000,
      });
    }
  }

  return isAuthReady && isLoaded ? (
    auth.currentUser &&
    number &&
    !isError &&
    (new Date().getTime() - Number(startTime)) / 1000 <= timeLimit * 5 &&
    number == auth.currentUser.phoneNumber ? (
      <>
        {titles}
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
      </>
    ) : (
      <RegError></RegError>
    )
  ) : (
    <Spinner className="flex mt-4" />
  );
}

export default RecPassForm;
