import { Button } from "@/components/ui/button";
import { getEvents, testConnection } from "@/lib/clickhouse";

export default async function HomePage() {
  // const isConnected = await testConnection();
  // const events = await getEvents();

  // if (isConnected) {
  //   console.log("ClickHouse connection successful");
  //   console.log("Events from ClickHouse:", events);
  // } else {
  //   console.log("Failed to connect to ClickHouse");
  // }

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-20">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-semibold text-black tracking-tight">
          Analytics Made Simple
        </h1>
        <p className="text-xl text-neutral-600 text-balance tracking-wide max-w-3xl">
          Track your website performance with privacy-focused analytics. Get
          insights that matter without compromising your users' data.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="cursor-pointer" size="lg">
          Start for free
        </Button>
        <Button variant="outline" size="lg" className="cursor-pointer">
          Live demo
        </Button>
      </div>
    </div>
  );
}
