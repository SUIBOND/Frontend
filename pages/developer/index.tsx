import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.object({
  nickname: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  link: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

export default function FoundationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      link: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex items-center justify-center flex-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 max-w-64"
        >
          <h2 className="mb-8 text-2xl font-bold text-center">
            Please create your profile
          </h2>
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-shadowBlue">
                  Nickname
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your preferred name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-shadowBlue">
                  Website / Github LInk
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Share a link to your website"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full bg-sui" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
