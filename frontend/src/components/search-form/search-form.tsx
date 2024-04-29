"use client";
import "./style.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitErrorHandler } from "react-hook-form";
import * as z from "zod";
import Aside from "../a-side/a-side";
import { RadioGroup, Radio } from "@nextui-org/react";
import { useSearch } from "@/store";
import { toYyyyMmDdDateTime } from "@/lib/utils";
import SubForm from "./sub-form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useResize } from "@/hooks/screens";
import { useSession } from "next-auth/react";
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

import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/router";
import { json } from "stream/consumers";

function SearchForm({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const updateError = useSearch(state => state.updateError);
  const updateSeachs = useSearch(state => state.updateSearchs);
  const updateArgs = useSearch(state => state.updateArgs);
  const updateType = useSearch(state => state.updateType);
  const type = useSearch(state => state.type);
  const nextSearch = useSearch(state => state.nextSearch);
  const { data: session, status } = useSession();
  const updatePage = useSearch(state => state.updatePage);
  const [cities, setCities] = useState<string[]>([]);
  const width = useResize();
  const formSchema = z
    .object({
      search: z.string(),
      filter: z.string(),
      startAge: z
        .string()
        .min(0, { message: "min 0" })
        .max(100, { message: "max 100" }),
      endAge: z
        .string()
        .min(0, { message: "min 0" })
        .max(100, { message: "max 100" }),
      gender: z.enum(["any", "female", "male"]),
      type: z.string(),
      country: z.string(),
      city: z.string(),
      useHashtegs: z.boolean(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .refine(obj => Number(obj.startAge) <= Number(obj.endAge), {
      message: "Start is bigger",
      path: ["startAge"],
    })
    .refine(
      obj =>
        (obj.startDate && obj.endDate && obj.startDate <= obj.endDate) ||
        !obj.endDate ||
        !obj.startDate,
      { message: "Start is bigger", path: ["endDate"] },
    );

  const defaultValues: {
    search: string;
    filter: string;
    startAge: string;
    endAge: string;
    gender: "male" | "female" | "any";
    type: string;
    country: string;
    city: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    useHashtegs: boolean;
  } = {
    search: "",
    filter: "0",
    startAge: "20",
    endAge: "100",
    gender: "male",
    type: type,
    country: "",
    city: "",
    startDate: undefined,
    endDate: undefined,
    useHashtegs: false,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (session?.user?.tokens?.access) {
      updatePage(1);
      const params = {
        q: values.search,
        gender: values.gender,
        city: values.city,
        country: values.country,
        ageStart: values.startAge,
        ageEnd: values.endAge,
        createdAt: values.startDate ? toYyyyMmDdDateTime(values.startDate) : "",
      };
      const u = new URLSearchParams(params).toString();
      updateType(values.type);
      updateError(onError);
      updateArgs(u);
      nextSearch(
        session.user.tokens.access,
        session.user.tokens.refresh,
        session.user.id,
      );
    }
  }

  function onError() {
    toast({
      title: "Search error",
      description: "bad settings arguments",
      duration: 2000,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex gap-4 mx-auto"
      >
        <div className="flex flex-col">
          <div className="bg-white min-h-[281px] w-[90%] my-5 md:w-[512px] rounded-md flex flex-col gap-0 xl:w-[768px] mx-auto">
            <div className="rounded-md px-7 pt-7 relative z-10 bg-white h-[184px] overflow-hidden">
              <h2 className="text-lg font-medium text-text-primary-color mb-4">
                Global search
              </h2>
              <div className="flex gap-2 flex-wrap xl:flex-nowrap">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="space-y-1 my-1 w-full">
                      <FormControl>
                        <Input
                          placeholder="Search seomthing here..."
                          className="input input-primary"
                          type="search"
                          field={field}
                          required
                        ></Input>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="btn btn-primary w-[80px] space-y-1 my-1"
                  text="Search"
                />

                <Button
                  name="reset"
                  onClick={() => {
                    form.reset({
                      ...defaultValues,
                      type: form.getValues("type"),
                    });
                  }}
                  type="reset"
                  className="btn btn-secondary w-[80px] space-y-1 my-1 md:block hidden"
                  text="Reset"
                />
                <div className="block md:hidden">
                  <Drawer>
                    <DrawerTrigger className="btn btn-secondary w-[80px] space-y-1 my-1 ">
                      More
                    </DrawerTrigger>
                    {width < 768 && (
                      <DrawerContent>
                        <div className="overflow-y-auto h-fit max-h-[80vh] transition-all py-auto sm:px-[100px] px-[5%]">
                          <SubForm
                            minWidth={1}
                            form={form}
                            setCities={setCities}
                            cities={cities}
                          ></SubForm>
                          <DrawerFooter>
                            <Button
                              name="reset"
                              onClick={() => {
                                form.reset({
                                  ...defaultValues,
                                  type: form.getValues("type"),
                                });
                              }}
                              type="reset"
                              className="btn btn-secondary space-y-1 my-1 "
                              text="Reset"
                            />
                            <DrawerClose asChild>
                              <Button
                                className="btn btn-secondary mb-6"
                                type="button"
                                text="Close"
                              ></Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    )}
                  </Drawer>
                </div>
              </div>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1 mt-4 ">
                    <FormControl>
                      <RadioGroup
                        className="mb-4"
                        classNames={{
                          label: "mb-3",
                        }}
                        orientation="horizontal"
                        color="primary"
                        {...field}
                        onChange={value => {
                          if (session?.user?.tokens?.access) {
                            value.currentTarget.onchange = field.onChange;
                            form.setValue("type", value.currentTarget.value);
                            updateSeachs([]);
                            updatePage(1);
                            const values = form.getValues();
                            const params = {
                              q: values.search,
                              gender: values.gender,
                              city: values.city,
                              country: values.country,
                              ageStart: values.startAge,
                              ageEnd: values.endAge,
                              createdAt: values.startDate
                                ? toYyyyMmDdDateTime(values.startDate)
                                : "",
                            };
                            const u = new URLSearchParams(params).toString();
                            updateType(values.type);
                            updateError(onError);
                            updateArgs(u);
                            nextSearch(
                              session.user.tokens.access,
                              session.user.tokens.refresh,
                              session.user.id,
                            );
                          }
                        }}
                      >
                        <Radio
                          value="posts"
                          size="sm"
                          classNames={{
                            label:
                              "text-text-primary-color text-base under__line",
                            wrapper: "hidden",
                          }}
                        >
                          Posts
                        </Radio>
                        <Radio
                          value="users"
                          size="sm"
                          classNames={{
                            label:
                              " text-base hover:text-button-primary-color under__line",
                            wrapper: "hidden",
                          }}
                        >
                          Accounts
                        </Radio>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {children}
          </div>
        </div>

        <SubForm
          minWidth={768}
          classNames={{
            datepickerStart: "hidden md:block",
            datepickerEnd: "hidden md:block",
          }}
          className="my-5 w-[240px] hidden flex-col gap-4 md:flex"
          form={form}
          setCities={setCities}
          cities={cities}
        ></SubForm>
      </form>
    </Form>
  );
}

export default SearchForm;
