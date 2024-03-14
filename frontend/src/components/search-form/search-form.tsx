"use client";
import "./style.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Aside from "../a-side/a-side";
import { RadioGroup, Radio } from "@nextui-org/react";
import countries from "../../data/eng-countries-and-cities/countries.json";
import * as ShadButton from "../ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Checkbox } from "@nextui-org/react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

function SearchForm({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<string[]>([]);
  const [openCountries, setOpenCountries] = useState<boolean>();
  const [openCities, setOpenCities] = useState<boolean>();
  const width = useResize();
  const formSchema = z
    .object({
      search: z.string(),
      filter: z.string(),
      startAge: z
        .string()
        .min(0, { message: "min 0" })
        .max(130, { message: "max 130" }),
      endAge: z
        .string()
        .min(0, { message: "min 0" })
        .max(130, { message: "max 130" }),
      password: z
        .string()
        .min(8, { message: "Пароль должен быть длинее 8 символов" }),
      gender: z.string(),
      type: z.string(),
      country: z.string(),
      city: z.string(),
      useHashtegs: z.boolean(),
    })
    .refine(obj => Number(obj.startAge) <= Number(obj.endAge), {
      message: "Start is bigger",
      path: ["startAge"],
    });

  const defaultValues = {
    search: "",
    filter: "0",
    password: "",
    startAge: "0",
    endAge: "130",
    gender: "0",
    type: "1",
    country: "",
    city: "",
    useHashtegs: false,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(isValidPhoneNumber(values.number));
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-4 mx-auto"
      >
        <div className="flex flex-col">
          <div className="bg-white w-[90%] rounded-md p-7 my-5 md:w-[512px] flex flex-col gap-0 xl:w-[768px] mx-auto">
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
              {width >= 1280 ? (
                <Button
                  name="reset"
                  onClick={() => {
                    form.reset({
                      ...defaultValues,
                      type: form.getValues("type"),
                    });
                  }}
                  type="reset"
                  className="btn btn-secondary w-[80px] space-y-1 my-1 "
                  text="Reset"
                />
              ) : (
                <Drawer>
                  <DrawerTrigger>Open</DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                      <DrawerDescription>
                        This action cannot be undone.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button
                        type="button"
                        text="More"
                        className="btn btn-secondary"
                      ></Button>
                      <DrawerClose>
                        <Button text="Cancel" type="button"></Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
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
                    >
                      <Radio
                        value="0"
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
                        value="1"
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
            {children}
          </div>
        </div>
        <SubForm
          openCities={openCities}
          openCountries={openCountries}
          setOpenCities={setOpenCities}
          setOpenCountries={setOpenCountries}
          form={form}
          setCities={setCities}
          cities={cities}
        ></SubForm>
      </form>
    </Form>
  );
}

export default SearchForm;
