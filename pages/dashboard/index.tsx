import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle2, Circle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const steps = [
  { id: "grant-info", name: "Grant Information" },
  { id: "proposal-info", name: "Proposal Information" },
  { id: "bid-bond", name: "Define Bid Bond" },
  { id: "proof-publish", name: "Proof & Publish" },
];

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  grantType: z.enum(["technical", "bounty", "other"], {
    required_error: "Grant type is required.",
  }),
  fundingRange: z.string().min(1, { message: "Funding range is required." }),
  proposalInfo: z.enum(["projectTitle", "description", "website"], {
    required_error: "Proposal Information is required.",
  }),
  stakeAmount: z.string().min(1, { message: "Bond Amount is required." }),
  numberOfBids: z.string().min(1, { message: "Number of Bids is required." }),
});

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState("grant-info");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      grantType: undefined,
      fundingRange: "",
      proposalInfo: undefined,
      stakeAmount: "",
      numberOfBids: "",
    },
  });

  useEffect(() => {
    const observers = steps.map((step) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentStep(step.id);

            setCompletedSteps((prevSteps) => {
              if (!prevSteps.includes(step.id)) {
                return [...prevSteps, step.id];
              }
              return prevSteps;
            });
          } else {
            setCompletedSteps((prevSteps) =>
              prevSteps.filter((id) => id !== step.id)
            );
          }
        },
        { threshold: 0.5 }
      );

      if (sectionRefs.current[step.id]) {
        observer.observe(sectionRefs.current[step.id]!);
      }

      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const isStepCompleted = (stepId: string) => completedSteps.includes(stepId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <main className="container py-8 mx-auto text-black">
          <div className="grid grid-cols-4 gap-8">
            <div className="sticky self-start space-y-8 top-8">
              {steps.map((step, stepIdx) => (
                <div key={step.id} className="relative flex items-start">
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-2.5 top-8 h-full w-0.5",
                        isStepCompleted(step.id) ? "bg-sui" : "bg-gray-200"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex items-center justify-center w-5 h-5">
                    {isStepCompleted(step.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-sui" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "ml-3 text-sm font-medium",
                      currentStep === step.id ? "text-sui" : "text-gray-500"
                    )}
                  >
                    {step.name}
                  </p>
                </div>
              ))}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-12"
              >
                <section
                  ref={(el) => {
                    sectionRefs.current["grant-info"] = el as HTMLDivElement;
                  }}
                >
                  <h2 className="mb-2 text-2xl font-semibold text-lightGray">
                    Grant Information
                  </h2>
                  <p className="mb-6 text-[#A5B0BF]">
                    Lorem ipsum dolor sit amet consectetur.
                  </p>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lightGray">Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="my-8">
                        <FormLabel className="text-lightGray">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Detailed Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormLabel className="text-lightGray">
                    Period of Application
                  </FormLabel>
                  <div className="flex gap-4 my-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select Start Date</span>
                                  )}
                                  <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select End Date</span>
                                  )}
                                  <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="grantType"
                    render={({ field }) => (
                      <FormItem className="my-8 space-y-3">
                        <FormLabel className="text-lightGray">
                          Type of grant
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="technical" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Technical Grant
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bounty" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Bounty
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Other type
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fundingRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-lightGray">
                          Funding Range
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the funding range"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fundingRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-lightGray">
                          Funding Range
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the funding range"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <section
                  ref={(el) => {
                    sectionRefs.current["proposal-info"] = el as HTMLDivElement;
                  }}
                >
                  <h2 className="mb-2 text-2xl font-semibold text-lightGray">
                    Proposal Information
                  </h2>
                  <p className="mb-6 text-[#A5B0BF]">
                    Lorem ipsum dolor sit amet consectetur.
                  </p>

                  <FormField
                    control={form.control}
                    name="proposalInfo"
                    render={({ field }) => (
                      <FormItem className="my-8 space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="projectTitle" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Project Title
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="description" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Description
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="website" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Website
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <section
                  ref={(el) => {
                    sectionRefs.current["bid-bond"] = el as HTMLDivElement;
                  }}
                >
                  <h2 className="mb-2 text-2xl font-semibold text-lightGray">
                    Define Bid Bond
                  </h2>
                  <p className="mb-6 text-[#A5B0BF]">
                    Lorem ipsum dolor sit amet consectetur.
                  </p>

                  <FormField
                    control={form.control}
                    name="stakeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lightGray">
                          How much should the applicants stake for their
                          proposal to be evaluated?
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Choose amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfBids"
                    render={({ field }) => (
                      <FormItem className="my-8">
                        <FormLabel className="text-lightGray">
                          Define how many bids can be submitted for this RFP
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Choose a name for the proposal NFT"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <Button className="my-2" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </>
  );
}
