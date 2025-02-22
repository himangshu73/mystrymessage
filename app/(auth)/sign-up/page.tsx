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
import { signUpSchema } from "@/schemas/signUpSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [submit, setSubmit] = useState(false);
  const router = useRouter()
  const debounced = useDebounceCallback(setUsername, 500);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      setUserMessage("");
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        setUserMessage(response.data.message);
        
      } catch (error) {
        console.log("Error Checking username:", error);
      }
    };
    checkUsernameUnique();
  }, [username]);

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      setSubmit(true);
      const response = await axios.post("/api/sign-up", values);
      toast(response.data.message);
      router.push(`/verify-code/${username}`)
      form.reset();
    } catch (error: any) {
      const response = error.response?.data?.message || error.message;

      toast(response);
    } finally {
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        debounced(event.target.value);
                      }}
                    />
                  </FormControl>
                  <div className="h-5 text-sm">
                    {userMessage && <p>{userMessage}</p>}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" type="email" {...field} />
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
            <Button type="submit">{submit ? "Submitting" : "Submit"}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
