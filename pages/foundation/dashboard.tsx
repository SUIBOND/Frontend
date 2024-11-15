import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Dummy data
// const bounties = [
//   {
//     id: 1,
//     title: "Bounty 1",
//     proposals: {
//       submitted: [
//         {
//           id: 1,
//           title: "Proposal 1",
//           description: "Description of the submitted proposal",
//         },
//         {
//           id: 2,
//           title: "Proposal 1",
//           description: "Another submitted proposal description",
//         },
//       ],
//       inProgress: [
//         {
//           id: 3,
//           title: "Proposal 1",
//           description: "Description of the in-progress proposal",
//         },
//       ],
//       inReview: [
//         {
//           id: 4,
//           title: "Proposal 1",
//           description: "Description of the proposal under review",
//         },
//       ],
//     },
//   },
//   {
//     id: 2,
//     title: "Bounty 2",
//     proposals: {
//       submitted: [],
//       inProgress: [],
//       inReview: [],
//     },
//   },
//   {
//     id: 3,
//     title: "Bounty 3",
//     proposals: {
//       submitted: [],
//       inProgress: [],
//       inReview: [],
//     },
//   },
// ];

export default function Dashboard() {
  const [foundationData, setFoundationData] = useState<any>(null); // State to store foundation data
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchFoundationData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Retrieve foundation_ids from local storage
        const foundationIds = localStorage.getItem("foundation_ids");

        if (!foundationIds) {
          throw new Error("No foundation IDs found in local storage");
        }

        const ids = JSON.parse(foundationIds); // Parse the stored string into an array
        console.log("Foundation IDs:", ids);

        // Call the backend API with foundation IDs
        const res = await fetch(
          `https://backend-c2ut.onrender.com/foundation/${ids[0]}`
        );

        if (!res.ok) {
          throw new Error(`API call failed with status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Data from API:", data);

        setFoundationData(data); // Store the API response in state
      } catch (err: any) {
        console.error("Error fetching foundation data:", err);
        setError(err.message); // Update error state
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchFoundationData();
  }, []);

  // Add another useEffect to log foundationData after it updates
  useEffect(() => {
    if (foundationData) {
      console.log("Updated Foundation Data:", foundationData);
    }
  }, [foundationData]); // This runs whenever foundationData changes

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-5 h-5 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        <span className="ml-2 text-blue-500">Loading foundation data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  // const [openBounties, setOpenBounties] = useState<number[]>([1]);
  // const toggleBounty = (bountyId: number) => {
  //   setOpenBounties((prev) =>
  //     prev.includes(bountyId)
  //       ? prev.filter((id) => id !== bountyId)
  //       : [...prev, bountyId]
  //   );
  // };

  return (
    <div className="container max-w-6xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">
          Overview of proposal submitted to your bounties
        </h1>
        <Link href="/foundation/create" passHref>
          <Button className="bg-blue-500 hover:bg-blue-600">
            Create new bounty
          </Button>
        </Link>
      </div>

      <div className="mb-8 space-y-4">
        {foundationData?.bounties?.length === 0 ? (
          <p className="text-center text-lg text-gray-500">
            No bounty proposals present.
          </p> // Message when bounties is empty
        ) : (
          foundationData?.bounties?.map((bounty: any, index: any) => (
            <div key={index}>
              {/* Render your bounty item here */}
              <p>{bounty.name}</p> {/* Example: Display bounty name */}
            </div>
          ))
        )}
      </div>

      {/* <div className="mb-8 space-y-4">
        {bounties.map((bounty) => (
          <Collapsible
            key={bounty.id}
            open={openBounties.includes(bounty.id)}
            className="border rounded-lg border-water"
          >
            <CollapsibleTrigger
              className="flex items-center justify-between w-full p-4 hover:bg-muted/50"
              onClick={() => toggleBounty(bounty.id)}
            >
              <h2 className="text-xl font-semibold">{bounty.title}</h2>
              {openBounties.includes(bounty.id) ? (
                <ChevronUp className="w-6 h-6 text-water" />
              ) : (
                <ChevronDown className="w-6 h-6 text-water" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-4">
                  <Badge variant="secondary" className="mb-2">
                    Submitted
                  </Badge>
                  {bounty.proposals.submitted.map((proposal) => (
                    <Card key={proposal.id} className="bg-card border-water">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {proposal.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {proposal.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="space-y-4">
                  <Badge className="mb-2 text-green-800 bg-green-100">
                    In progress
                  </Badge>
                  {bounty.proposals.inProgress.map((proposal) => (
                    <Card key={proposal.id} className="bg-card border-water">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {proposal.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {proposal.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="space-y-4">
                  <Badge className="mb-2 text-yellow-800 bg-yellow-100">
                    In Review
                  </Badge>
                  {bounty.proposals.inReview.map((proposal) => (
                    <Card key={proposal.id} className="bg-card border-water">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {proposal.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {proposal.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div> */}

      <Card className="mt-8 border-water">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className=" text-2xl">My Organisation</CardTitle>
          <Button
            className="border-sui text-sui cursor-not-allowed"
            variant="outline"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Title of the organisation
            </label>
            <p className="text-muted-foreground">{foundationData?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Website URL</label>
            <p className="text-muted-foreground">{foundationData?.url}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
