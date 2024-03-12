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
  const formSchema = z
    .object({
      search: z.string(),
      filter: z.string(),
      name: z.string(),
      surname: z.string(),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      filter: "0",
      password: "",
      name: "",
      surname: "",
      startAge: "0",
      endAge: "130",
      gender: "0",
      type: "0",
      country: "",
      city: "",
      useHashtegs: false,
    },
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
            <div className="flex gap-2">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="btn btn-primary w-[80px] space-y-1 my-1"
                text="Search"
              />
              <Button
                type="reset"
                className="btn btn-secondary w-[80px] space-y-1 my-1 "
                text="Reset"
              />
            </div>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1 mt-1">
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
        <Aside minWidth={1280} className="my-5 w-[240px] flex flex-col gap-4">
          <div className=" bg-white rounded-md w-full p-7 ">
            <FormField
              control={form.control}
              name="filter"
              render={({ field }) => (
                <FormItem className="space-y-1 mt-1">
                  <FormControl>
                    <RadioGroup
                      classNames={{
                        label:
                          "mb-3 text-text-primary-color text-base font-medium",
                        wrapper: "gap-3 ml-1 text-white",
                      }}
                      label="Filters"
                      orientation="horizontal"
                      color="primary"
                      {...field}
                    >
                      <Radio
                        value="0"
                        size="sm"
                        classNames={{
                          label: " text-text-primary-color",
                        }}
                      >
                        Relevance
                      </Radio>
                      <Radio
                        value="1"
                        size="sm"
                        classNames={{
                          label: " text-text-primary-color",
                        }}
                      >
                        By rating
                      </Radio>
                      <Radio
                        value="2"
                        size="sm"
                        classNames={{
                          label: " text-text-primary-color",
                        }}
                      >
                        By popular
                      </Radio>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" bg-white rounded-md w-full px-7 pt-3 pb-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-text-primary-color text-base font-medium">
                  Other settings
                </AccordionTrigger>
                <AccordionContent className="ml-1">
                  <h3 className="mb-5">Additional info</h3>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-0 mb-2">
                        <FormControl>
                          <Input
                            className="input input-primary md:min-h-[34px]"
                            type="text"
                            placeholder="Name"
                            field={field}
                          ></Input>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem className="space-y-0 mb-5">
                        <FormControl>
                          <Input
                            className="input input-primary md:min-h-[34px]"
                            type="text"
                            placeholder="Surname"
                            field={field}
                          ></Input>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <h3 className="mb-5">Age</h3>
                  <div className="flex">
                    {" "}
                    <FormField
                      control={form.control}
                      name="startAge"
                      render={({ field }) => (
                        <FormItem className="space-y-0 max-w-[74px]">
                          <FormControl>
                            <Input
                              className="input input-primary md:min-h-[34px] min-w-full mb-1"
                              type="number"
                              placeholder="From"
                              field={field}
                            ></Input>
                          </FormControl>
                          <FormMessage className="w-[100px] " />
                        </FormItem>
                      )}
                    />
                    <hr className="text-text-primary-color w-8 mt-4 mx-2 border-t-2" />
                    <FormField
                      control={form.control}
                      name="endAge"
                      render={({ field }) => (
                        <FormItem className="space-y-0 max-w-[74px]">
                          <FormControl>
                            <Input
                              className="input input-primary md:min-h-[34px] min-w-full"
                              type="number"
                              placeholder="To"
                              field={field}
                            ></Input>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-1 mt-1 ">
                        <FormControl>
                          <RadioGroup
                            classNames={{
                              label: "mb-3 text-text-primary-color ",
                              wrapper: "gap-3 ml-1 text-white",
                            }}
                            label="Filters"
                            orientation="horizontal"
                            color="primary"
                            {...field}
                          >
                            <Radio
                              value="0"
                              size="sm"
                              classNames={{
                                label: " text-text-primary-color mr-7",
                              }}
                            >
                              Male
                            </Radio>
                            <Radio
                              value="1"
                              size="sm"
                              classNames={{
                                label: " text-text-primary-color",
                              }}
                            >
                              Female
                            </Radio>
                            <Radio
                              value="2"
                              size="sm"
                              classNames={{
                                label: " text-text-primary-color",
                              }}
                            >
                              Any
                            </Radio>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <h3 className="mt-4 mb-5">Place</h3>
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover
                          open={openCountries}
                          onOpenChange={setOpenCountries}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <ShadButton.Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[180px] justify-between",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? Object.keys(countries).find(
                                      country => country === field.value,
                                    )
                                  : "Select country"}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </ShadButton.Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[180px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search country..."
                                className="h-9"
                              />
                              <CommandEmpty>No country found.</CommandEmpty>
                              <CommandGroup className="overflow-y-auto max-h-[160px]">
                                {Object.keys(countries).map(country => (
                                  <CommandItem
                                    value={country}
                                    key={country}
                                    onSelect={() => {
                                      form.setValue("country", country);
                                      form.setValue("city", "");
                                      setOpenCountries(false);
                                      setCities(
                                        countries[
                                          country as string as keyof typeof countries
                                        ],
                                      );
                                    }}
                                  >
                                    {country}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        country === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mt-2">
                        <Popover onOpenChange={setOpenCities} open={openCities}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <ShadButton.Button
                                disabled={form.getValues("country") == ""}
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[180px] justify-between",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? cities.find(city => city === field.value)
                                  : "Select city"}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </ShadButton.Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[180px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search city..."
                                className="h-9"
                              />
                              <CommandEmpty>No city found.</CommandEmpty>
                              <CommandGroup className="overflow-y-auto max-h-[160px]">
                                {cities.map(city => (
                                  <CommandItem
                                    value={city}
                                    key={city}
                                    onSelect={() => {
                                      form.setValue("city", city);
                                      setOpenCities(false);
                                    }}
                                  >
                                    {city}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        city === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <h3 className="mt-4 mb-5">Different</h3>
                  <FormField
                    control={form.control}
                    name="useHashtegs"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormControl>
                          <Checkbox
                            isSelected={form.getValues("useHashtegs")}
                            onValueChange={() => {
                              form.setValue(
                                "useHashtegs",
                                !form.getValues("useHashtegs"),
                              );
                              console.log(!form.getValues("useHashtegs"));
                            }}
                            classNames={{
                              wrapper: "checkbox-wrapper-primary ml-1",
                              label: "m-auto text-text-primary-color",
                            }}
                            radius="sm"
                            color="secondary"
                            size="sm"
                          >
                            Use hashtegs
                          </Checkbox>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Aside>
      </form>
    </Form>
  );
}

export default SearchForm;
