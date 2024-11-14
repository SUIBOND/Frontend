import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount, useSignTransaction } from "@mysten/dapp-kit";
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

export default function DeveloperForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      link: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit", values);
  }

  const SUIBOND_PACKAGE_ID =
    "0xd41317eeb1dbb1be8d818f8505fa674cb99debe112f0e221e2e9194227bd2cbf";
  // const PLATFORM_OBJ_ID =
  //   "0xcd7a780e7848ae205218cf58dc089b395efe3650a150905525eec620ca661a45";
  const MODULE = "suibond";
  const gasBudgetInMist = 100000000;

  const { mutate: signAndExecuteTransactionBlock } = useSignTransaction();
  const txb = new Transaction();

  const txCont = async () => {
    try {
      txb.moveCall({
        target: `${SUIBOND_PACKAGE_ID}::${MODULE}::mint_developer_cap`,
        arguments: [
          txb.pure.string("Testing"),
          txb.pure.string("https:google.com"),
        ],
      });
      txb.setGasBudget(gasBudgetInMist);

      const response = await signAndExecuteTransactionBlock(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            console.log("Transaction onSuccess result:", result);
            if (result) {
              console.log("Transaction result received:", result);
            } else {
              console.warn("Result is undefined or null");
            }
          },
          onError: (error) => {
            console.error("Transaction onError:", error);
          },
        }
      );

      console.log("'enter' transaction result:", response);
      return response;
    } catch (e) {
      console.error("'enter' transaction failed", e);
    }
  };

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
                  Website / Github Link
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
          <Button onClick={txCont} className="w-full bg-sui" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
