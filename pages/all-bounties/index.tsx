import { useState, useMemo } from "react";
import { Search, Building, Tag, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

// Dummy data
const bounties = [
  {
    id: 1,
    title: "Frontend Developer Bounty",
    organization: "TechCorp",
    type: "Development",
    datePosted: "2024-01-15",
    applicationPeriod: "15/01/2024 - 15/02/2024",
    description:
      "Lorem ipsum dolor sit amet consectetur. Mollis sit eget congue in. Morbi magnis risus a mauris augue viverra.",
  },
  {
    id: 2,
    title: "UI Design Challenge",
    organization: "DesignLab",
    type: "Design",
    datePosted: "2024-01-14",
    applicationPeriod: "14/01/2024 - 14/02/2024",
    description:
      "Lorem ipsum dolor sit amet consectetur. Mollis sit eget congue in. Morbi magnis risus a mauris augue viverra.",
  },
  {
    id: 3,
    title: "Backend API Development",
    organization: "CloudSys",
    type: "Development",
    datePosted: "2024-01-13",
    applicationPeriod: "13/01/2024 - 13/02/2024",
    description:
      "Lorem ipsum dolor sit amet consectetur. Mollis sit eget congue in. Morbi magnis risus a mauris augue viverra.",
  },
  {
    id: 4,
    title: "Content Writing Bounty",
    organization: "MediaHub",
    type: "Content",
    datePosted: "2024-01-12",
    applicationPeriod: "12/01/2024 - 12/02/2024",
    description:
      "Lorem ipsum dolor sit amet consectetur. Mollis sit eget congue in. Morbi magnis risus a mauris augue viverra.",
  },
];

const dateSortOptions = ["Newest", "Oldest"];

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("Newest");

  const filteredBounties = useMemo(() => {
    return bounties
      .filter((bounty) => {
        const matchesSearch = bounty.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesOrg =
          selectedOrg === "All" || bounty.organization === selectedOrg;
        const matchesType =
          selectedType === "All" || bounty.type === selectedType;
        return matchesSearch && matchesOrg && matchesType;
      })
      .sort((a, b) => {
        if (selectedDate === "Newest") {
          return (
            new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
          );
        }
        return (
          new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime()
        );
      });
  }, [searchQuery, selectedOrg, selectedType, selectedDate]);

  const availableOrganizations = useMemo(() => {
    const orgs = new Set(filteredBounties.map((bounty) => bounty.organization));
    return ["All", ...Array.from(orgs)];
  }, [filteredBounties]);

  const availableBountyTypes = useMemo(() => {
    const types = new Set(filteredBounties.map((bounty) => bounty.type));
    return ["All", ...Array.from(types)];
  }, [filteredBounties]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-semibold text-center">
        Explore active bounties
      </h1>

      <div className="flex flex-col gap-4 mb-8 md:flex-row">
        <div className="flex flex-1 gap-4 text-sui">
          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger className="w-[200px] border-sui">
              <Building className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Organisation" />
            </SelectTrigger>
            <SelectContent>
              {availableOrganizations.map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[200px] border-sui">
              <Tag className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Bounty type" />
            </SelectTrigger>
            <SelectContent>
              {availableBountyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[200px] border-sui">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date posted" />
            </SelectTrigger>
            <SelectContent>
              {dateSortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <Input
            className="pl-10 w-full md:w-[300px]"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredBounties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredBounties.map((bounty) => (
            <Card
              key={bounty.id}
              className="transition-shadow border-none shadow-sm bg-water hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center rounded-lg">
                      <Image
                        src="/bounty.svg"
                        alt="get-funded"
                        priority
                        width={0}
                        height={0}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold">
                        {bounty.title}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">
                        Application period: {bounty.applicationPeriod}
                      </p>
                      <p className="text-sm text-gray-600">
                        {bounty.description}
                      </p>
                    </div>
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">
          No results found. Please try adjusting your filters or search query.
        </div>
      )}
    </div>
  );
}
