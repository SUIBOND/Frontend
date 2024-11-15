import { useState, useEffect, useMemo } from "react";
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

// Define the type for a Bounty
interface Bounty {
  id: string;
  foundation: string;
  title: string;
  description: string;
  bounty_type: string;
  risk_percent: string;
  min_amount: string;
  max_amount: string;
  unconfirmed_proposals: string[];
  processing_proposals: string[];
  completed_proposals: string[];
}

const dateSortOptions = ["Newest", "Oldest"];

export default function Component() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("Newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch bounties from the API
    const fetchBounties = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch("https://backend-c2ut.onrender.com/bounties");
        const data: Bounty[] = await response.json();
        setBounties(data);
      } catch (error) {
        console.error("Failed to fetch bounties:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBounties();
  }, []);

  const filteredBounties = useMemo(() => {
    return bounties
      .filter((bounty) => {
        const matchesSearch = bounty.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesOrg =
          selectedOrg === "All" || bounty.foundation === selectedOrg;
        const matchesType =
          selectedType === "All" || bounty.bounty_type === selectedType;
        return matchesSearch && matchesOrg && matchesType;
      })
      .sort((a, b) => {
        if (selectedDate === "Newest") {
          return b.id > a.id ? -1 : 1; // Assuming `id` corresponds to posting order
        }
        return b.id < a.id ? -1 : 1;
      });
  }, [bounties, searchQuery, selectedOrg, selectedType, selectedDate]);

  const availableOrganizations = useMemo(() => {
    const orgs = new Set(bounties.map((bounty) => bounty.foundation));
    return ["All", ...Array.from(orgs)];
  }, [bounties]);

  const availableBountyTypes = useMemo(() => {
    const types = new Set(bounties.map((bounty) => bounty.bounty_type));
    return ["All", ...Array.from(types)];
  }, [bounties]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-5 h-5 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        <span className="ml-2 text-blue-500">Loading bounty data...</span>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-semibold text-center">
        Explore active bounties
      </h1>

      <div className="flex flex-col gap-4 mb-8 lg:flex-row">
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                        Min: {bounty.min_amount}, Max: {bounty.max_amount}
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
