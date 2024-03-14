"use client";
import React from "react";
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
type Props = {
  form: z.infer<any>;
  openCountries: any;
  setOpenCountries: any;
  setCities: any;
  setOpenCities: any;
  openCities: any;
  cities: any[];
};

export default function SubForm(props: Props) {
  return (
    <>
      <div className=" bg-white rounded-md w-full p-7 ">
        <FormField
          control={props.form.control}
          name="filter"
          render={({ field }) => (
            <FormItem className="space-y-1 mt-1">
              <FormControl>
                <RadioGroup
                  classNames={{
                    label: "mb-3 text-text-primary-color text-base font-medium",
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
              <h3 className="mb-5">Age</h3>
              <div className="flex">
                {" "}
                <FormField
                  control={props.form.control}
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
                  control={props.form.control}
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
                control={props.form.control}
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
                            label: " text-text-primary-color md:mr-7",
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
                control={props.form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover
                      open={props.openCountries}
                      onOpenChange={props.setOpenCountries}
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
                                  props.form.setValue("country", country);
                                  props.form.setValue("city", "");
                                  props.setOpenCountries(false);
                                  props.setCities(
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
                control={props.form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2 mb-5">
                    <Popover
                      onOpenChange={props.setOpenCities}
                      open={props.openCities}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <ShadButton.Button
                            disabled={props.form.getValues("country") == ""}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[180px] justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? props.cities.find(city => city === field.value)
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
                            {props.cities.map(city => (
                              <CommandItem
                                value={city}
                                key={city}
                                onSelect={() => {
                                  props.form.setValue("city", city);
                                  props.setOpenCities(false);
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
                control={props.form.control}
                name="useHashtegs"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Checkbox
                        isSelected={props.form.getValues("useHashtegs")}
                        onValueChange={() => {
                          props.form.setValue(
                            "useHashtegs",
                            !props.form.getValues("useHashtegs"),
                          );
                          console.log(!props.form.getValues("useHashtegs"));
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
    </>
  );
}
