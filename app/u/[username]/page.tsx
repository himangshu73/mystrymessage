"use client";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { messageSchema } from "@/schemas/messageSchema";

const SendMessagePage = () => {
  const [submit, setSubmit] = useState(false);
  const { username } = useParams();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    setSubmit(true);
    try {
      const response = await axios.post("/api/send-message", {
        username: username,
        content: values.content,
      });
      toast(response.data.message);
      form.reset({content:""});
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Send Message To{" "}
                    <span className="font-bold">{username}</span> Anonymously
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="write your message here" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">{submit ? "Submitting" : "Submit"}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SendMessagePage;
