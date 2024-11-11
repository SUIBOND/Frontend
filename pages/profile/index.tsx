import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import { useState } from "react";

// Dummy data
const bounties = [
  {
    id: 1,
    title: "Bounty 1",
    proposals: {
      submitted: [
        {
          id: 1,
          title: "Proposal 1",
          description: "Description of the submitted proposal",
        },
        {
          id: 2,
          title: "Proposal 1",
          description: "Another submitted proposal description",
        },
      ],
      inProgress: [
        {
          id: 3,
          title: "Proposal 1",
          description: "Description of the in-progress proposal",
        },
      ],
      inReview: [
        {
          id: 4,
          title: "Proposal 1",
          description: "Description of the proposal under review",
        },
      ],
    },
  },
  {
    id: 2,
    title: "Bounty 2",
    proposals: {
      submitted: [],
      inProgress: [],
      inReview: [],
    },
  },
  {
    id: 3,
    title: "Bounty 3",
    proposals: {
      submitted: [],
      inProgress: [],
      inReview: [],
    },
  },
];

export default function Component() {
  const [openBounties, setOpenBounties] = useState<number[]>([1]);

  const toggleBounty = (bountyId: number) => {
    setOpenBounties((prev) =>
      prev.includes(bountyId)
        ? prev.filter((id) => id !== bountyId)
        : [...prev, bountyId]
    );
  };

  return (
    <div className="container max-w-6xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">
          Overview of proposal submitted to your bounties
        </h1>
        <Button className="bg-blue-500 hover:bg-blue-600">
          Create new bounty
        </Button>
      </div>

      <div className="mb-8 space-y-4">
        {bounties.map((bounty) => (
          <Collapsible
            key={bounty.id}
            open={openBounties.includes(bounty.id)}
            className="border rounded-lg"
          >
            <CollapsibleTrigger
              className="flex items-center justify-between w-full p-4 hover:bg-muted/50"
              onClick={() => toggleBounty(bounty.id)}
            >
              <h2 className="text-xl font-semibold">{bounty.title}</h2>
              {openBounties.includes(bounty.id) ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-4">
                  <Badge variant="secondary" className="mb-2">
                    Submitted
                  </Badge>
                  {bounty.proposals.submitted.map((proposal) => (
                    <Card key={proposal.id} className="bg-card">
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
                    <Card key={proposal.id} className="bg-card">
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
                    <Card key={proposal.id} className="bg-card">
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
      </div>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Organisation</CardTitle>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Title of the organisation
            </label>
            <p className="text-muted-foreground">Acme Corp</p>
          </div>
          <div>
            <label className="text-sm font-medium">Website URL</label>
            <p className="text-muted-foreground">https://acme.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
