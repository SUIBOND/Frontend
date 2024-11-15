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
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { SUIBOND_PACKAGE_ID } from "@/config/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

export default function DeveloperForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const walletAddress = currentAccount?.address;


	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }: { bytes: any; signature: any }) =>
			await client.executeTransactionBlock({
				transactionBlock: bytes,
				signature,
				options: {
					showRawEffects: true,
					showObjectChanges: true,
				},
			}),
	});

  useEffect(() => {
    const checkIdentification = async () => {
      setLoading(true); // Show loading
      try {
        const res = await fetch(
          `https://backend-c2ut.onrender.com/d-identification/${walletAddress}`
        );
        if (res.status === 200) {
          const data = await res.json(); // Parse the JSON response
          console.log("data",data)
          const developerCapId = data?.developerCap?.id;
          console.log("developerCapId",developerCapId)
          
          if (developerCapId) {
            localStorage.setItem("developerCapId", developerCapId);
            console.log(
              "developerCapId stored in local storage:",
              developerCapId
            );
          }
          router.push("/all-bounties");
        } else {
          console.error("Identification failed", res.status);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      } finally {
        setLoading(false); // Hide loading
      }
    };

    if (walletAddress) {
      checkIdentification();
    }
  }, [walletAddress, router]);
 
  const txCont = async () => {
    // setLoading(true); // Show loading
    const txb = new Transaction();

    try {
      txb.moveCall({
        target: `${SUIBOND_PACKAGE_ID}::suibond::mint_developer_cap`,
        arguments: [
          txb.pure.string( form.getValues("name") ),
          txb.pure.string( form.getValues("url") ),
        ],
      });
      txb.setGasBudget(100000000);

      const response = await signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: async (result) => {
            console.log("Transaction onSuccess result:", result);
            if (result) {
              console.log("Transaction result received:", result);
              try {
                setLoading(true);
                const res = await fetch(
                  `https://backend-c2ut.onrender.com/d-identification/${walletAddress}`
                );
                if (res.status === 200) {
                  const data = await res.json(); // Parse the JSON response
                  console.log("data",data)
                  const developerCapId = data?.developerCap?.id;
                  console.log("developerCapId",developerCapId)
                  
                  if (developerCapId) {
                    localStorage.setItem("developerCapId", developerCapId);
                    console.log(
                      "developerCapId stored in local storage:",
                      developerCapId
                    );
                    router.push("/all-bounties");
                  } else {
                    console.error("developerCapId not found or invalid format");
                  }
                } else {
                  console.error("Backend API call did not return 200 status");
                }
                
              } catch (error) {
                
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
    } finally {
      setLoading(false); // Hide loading
    }
  };

  return (
    <div className="flex items-center justify-center flex-1">
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          <span className="text-blue-500">Processing...</span>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => console.log(values))}
            className="w-full space-y-8 max-w-64"
          >
            <h2 className="mb-8 text-2xl font-bold text-center">
              Please create your profile
            </h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-shadowBlue">
                    Name
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
              name="url"
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
      )}
    </div>
  );
}
