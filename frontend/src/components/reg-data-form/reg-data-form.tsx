"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, Radio } from "@nextui-org/react";
import "./style.scss";
import Button from "../ui/button/Button";
import { auth } from "@/config/firebase.config";
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
import { signOut } from "firebase/auth";
import { useCallback } from "react";
import { SelectDatepicker } from "react-select-datepicker";
import { Spinner } from "@nextui-org/react";
import { useConfirmCode } from "@/store";
import RegError from "../errors/reg-error";

function RegDataForm({
  children,
  titles,
}: {
  children?: React.ReactNode;
  titles?: React.ReactNode;
}) {
  // для даты
  const [dateVal, setDateVal] = useState<Date | null>();
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const number = useConfirmCode(state => state.number);
  const login = useConfirmCode(state => state.login);
  const startTime = useConfirmCode(state => state.startTime);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const timeLimit = 60;
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
    if (
      process.env.NEXT_PUBLIC_DOMEN_URL &&
      process.env.NEXT_PUBLIC_URL_REGISTER
    ) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_DOMEN_URL +
          process.env.NEXT_PUBLIC_URL_REGISTER,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: values.name,
            lastName: values.surname,
            login: login,
            password: values.password,
            phoneNumber: number,
            role: "user",
            gender: values.gender,
            birthday: values.birthDay.toISOString(),
          }),
        },
      );
      const responeJson = await response.json();
      if (!responeJson.error) {
        router.push("/");
      } else {
        setIsError(true);
      }
    }
  }

  useEffect(() => {
    const checkAuthState = async () => {
      await auth.authStateReady();
      // Do whatever you want here ...

      // E.g. checking whether the user is logged in or not:
      setIsAuthReady(true);
      // End of E.g.
    };
    setIsLoaded(useConfirmCode.persist.hasHydrated());

    checkAuthState();
  }, []);
  console.log(login);
  return isAuthReady && isLoaded ? (
    (console.log(number),
    auth.currentUser &&
    number &&
    !isError &&
    login &&
    (new Date().getTime() - Number(startTime)) / 1000 <= timeLimit * 5 &&
    number == auth.currentUser.phoneNumber ? (
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1 my-1">
                <FormControl>
                  <Input
                    className="input input-primary"
                    type="text"
                    placeholder="Name"
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
            name="surname"
            render={({ field }) => (
              <FormItem className="space-y-1 my-1">
                <FormControl>
                  <Input
                    className="input input-primary"
                    type="text"
                    placeholder="Surname"
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
            name="birthDay"
            render={({ field }) => (
              <FormItem className="space-y-1 my-1">
                <FormControl>
                  <SelectDatepicker
                    order="day/month/year"
                    className={"gap-4"}
                    selectedDate={field.value}
                    onDateChange={field.onChange}
                  />
                </FormControl>
                <FormDescription className="pt-3 pb-1">
                  Date of birth <br />
                  Example: 24 January 2002
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-1 mt-1 mb-4">
                <FormControl>
                  <RadioGroup
                    classNames={{ label: "mb-3", wrapper: "gap-6" }}
                    label="Select your gender"
                    orientation="horizontal"
                    color="primary"
                    {...field}
                  >
                    <Radio value="male" size="sm">
                      Male
                    </Radio>
                    <Radio value="female" size="sm">
                      Female
                    </Radio>
                    <Radio value="any" size="sm">
                      Any
                    </Radio>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {children}
        </form>
      </Form>
    ) : (
      <RegError></RegError>
    ))
  ) : (
    <Spinner className="flex mt-4" />
  );
}

export default RegDataForm;
