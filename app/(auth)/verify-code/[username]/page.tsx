"use client";

import { verifySchema } from "@/schemas/verifySchema";
import { useParams, useRouter } from "next/navigation";
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

const VerifyCodePage = () => {
  const [verify, setVerify] = useState(false);
  const router = useRouter();
  const { username } = useParams();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  async function onSubmit(values: z.infer<typeof verifySchema>) {
    setVerify(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username: username,
        code: values.code,
      });
      toast(response.data.message);
      router.push("/sign-in");
    } catch (error: any) {
      const response = error.response?.data?.message || error.message;
      toast(response);
    } finally {
      setVerify(false);
    }
  }
  return (
    <div className="m-auto">
      <div className="m-auto mt-16 w-1/2 border bg-green-500 shadow-md p-4 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="verification code" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">{verify ? "Verifing" : "Verify"}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyCodePage;
