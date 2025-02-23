"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [submit, setSubmit] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setSubmit(true);
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });
    console.log(result);
    if (result?.error) {
      console.log("Incorrect Username/passowrd Error", result?.error);
      toast("Incorrect username or password");
      setSubmit(false);
    }
    if (result?.url) {
      console.log("Signed In Successfully.");
      toast("Signed In Successfully");
      router.push("/");
      setSubmit(false);
    }
  }

  return (
    <div className="m-auto">
      <div className="m-auto mt-16 w-1/2 border bg-green-500 shadow-md p-4 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input placeholder="username/email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{submit ? "Logging" : "Login"}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
