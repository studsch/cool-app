"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 character." }),
  description: z
    .string()
    .min(1, {
      message: "Description must be at least 1 character.",
    })
    .max(180, {
      message: "Description must not be longer than 180 characters.",
    })
    .optional(),
});

export interface ProfileProps {
  info: {
    avatarImage: string;
    avatarFallback: string;
    name: string;
    description: string;
  };
}

export function Profile({ info }: ProfileProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Card className="w-[600px]">
      {/* TODO: add image */}
      <div className="bg-black w-full h-36 rounded-t-xl"></div>

      <div className="flex mx-1">
        <div className="bg-white rounded-full w-[108px] h-[108px] -mt-[50px]">
          <div className="p-1">
            <Avatar className="w-[100px] h-[100px]">
              <AvatarImage src={info.avatarImage} />
              <AvatarFallback>{info.avatarFallback}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex w-full justify-between my-2 mx-2">
          <div className="grid gap-1">
            <p className="text-lg font-medium leading-none">{info.name}</p>
            <p className="text-sm font-medium leading-none text-muted-foreground">
              {info.description}
            </p>
          </div>
          <div className="grid gap-1 w-[200px]">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-white">Edit profile</Button>
              </DialogTrigger>
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>Edit your profile</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little bit"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" className="text-white">
                        Submit
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button className="text-white">More action</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
