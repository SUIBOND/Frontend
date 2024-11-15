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
import { useRouter } from 'next/router';
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { SUIBOND_PACKAGE_ID } from "@/config/constants";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

export default function FoundationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      website: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const MODULE = "suibond";
  const gasBudgetInMist = 100000000;

  const client = useSuiClient();
  const router = useRouter();

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
		execute: async ({ bytes, signature }: {bytes: any, signature: any}) =>
			await client.executeTransactionBlock({
				transactionBlock: bytes,
				signature,
				options: {
					// Raw effects are required so the effects can be reported back to the wallet
					showRawEffects: true,
					// Select additional data to return
					showObjectChanges: true,
				},
			}),
	});

  const currentAccount = useCurrentAccount();

  const txCont = async () => {
    const txb = new Transaction();

    try {
      txb.moveCall({
        target: `${SUIBOND_PACKAGE_ID}::${MODULE}::mint_foundation_cap`,
        arguments: [
          txb.pure.string( form.getValues("title") ),
          txb.pure.string( form.getValues("website") ),
        ],
      });
      txb.setGasBudget(gasBudgetInMist);

      const response = await signAndExecuteTransaction(
        {
          transaction: txb,
        },
        {
          onSuccess: async (result) => {
            console.log("Transaction onSuccess result:", result);
            if (result) {
              console.log("Transaction result received:", result);

              try {
                const walletAddress = currentAccount?.address;
                const res = await fetch(`https://backend-c2ut.onrender.com/identification/${walletAddress}`, {
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
  
                if (res.status === 200) {
                  // Redirect to /profile if the backend returns 200
                  router.push("/profile");
                } else {
                  console.error("Backend API call did not return 200 status");
                }
              } catch (error){
                console.error("Error fetching data from backend API", error);
              }
            } else {
              console.warn("Result is undefined or null");
            }
          },
          onError: (error) => {
            console.error("Transaction onError:", error);
          },
        }
      );
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
            Please create a profile for your organisation
          </h2>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-shadowBlue">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your organisation title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-shadowBlue">
                  Website
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
