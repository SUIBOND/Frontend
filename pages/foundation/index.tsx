import { useState, useEffect } from "react";
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
import { useRouter } from "next/router";
import { Transaction } from "@mysten/sui/transactions";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { PLATFORM_OBJ_ID, SUIBOND_PACKAGE_ID } from "@/config/constants";

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
          `https://backend-c2ut.onrender.com/identification/${walletAddress}`
        );
        if (res.status === 200) {
          router.push("/foundation/dashboard");
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
    setLoading(true); // Show loading
    const txb = new Transaction();
    try {
      txb.moveCall({
        target: `${SUIBOND_PACKAGE_ID}::suibond::mint_foundation_cap`,
        arguments: [
          txb.object(PLATFORM_OBJ_ID),
          txb.pure.string(form.getValues("title")),
          txb.pure.string(form.getValues("website")),
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
                  `https://backend-c2ut.onrender.com/foundation/identification/${walletAddress}`
                );

                if (res.status === 200) {
                  const data = await res.json(); // Parse the JSON response
                  const foundationIds = data?.foundationCap?.foundation_ids;
                  const foundationCapId = data.foundationCap.id;

                  if (foundationIds && Array.isArray(foundationIds)) {
                    // Store the foundation_ids in local storage
                    localStorage.setItem(
                      "foundation_ids",
                      JSON.stringify(foundationIds)
                    );
                    localStorage.setItem("foundationCapId", foundationCapId);
                    console.log(
                      "Foundation IDs stored in local storage:",
                      foundationIds
                    );

                    // Redirect to the dashboard
                    router.push("/foundation/dashboard");
                  } else {
                    console.error("Foundation IDs not found or invalid format");
                  }
                } else {
                  console.error("Backend API call did not return 200 status");
                }
              } catch (error) {
                console.error("Error fetching data from backend API", error);
              } finally {
                setLoading(false);
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
              Please create a profile for your organisation
            </h2>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-shadowBlue">
                    Title
                  </FormLabel>
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
      )}
    </div>
  );
}
