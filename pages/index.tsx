import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <main className="container px-4 py-12 mx-auto">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-medium md:text-5xl">
            Welcome to suibond
          </h1>
          <p className="text-muted-foreground">xxx</p>
        </div>

        <div className="grid max-w-4xl gap-6 mx-auto md:grid-cols-2">
          <Card className="relative overflow-hidden transition-shadow hover:shadow-lg border-sui">
            <CardContent className="p-6">
              <div className="relative mb-4">
                <Image
                  src="/fund.svg"
                  alt="get-funded"
                  priority
                  width={0}
                  height={0}
                  className="w-full h-full"
                />
              </div>
              <h2 className="mb-2 text-xl font-semibold">
                I want to fund projects
              </h2>
              <p className="text-muted-foreground">
                I'm an organisation that has funding to allocate and I want to
                issue a request for proposals.
              </p>
              <Link href="/foundation" className="absolute inset-0">
                <span className="sr-only">I want to fund projects</span>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden transition-shadow hover:shadow-lg border-sui">
            <CardContent className="p-6">
              <div className="relative mb-4">
                <Image
                  src="/fund.svg"
                  alt="get-funded"
                  priority
                  width={0}
                  height={0}
                  className="w-full h-full"
                />
              </div>
              <h2 className="mb-2 text-xl font-semibold">
                I want to get funded
              </h2>
              <p className="text-muted-foreground">
                I'm a project owner looking for funding and I want to submit a
                proposal.
              </p>
              <Link href="/developer" className="absolute inset-0">
                <span className="sr-only">I want to get funded</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
