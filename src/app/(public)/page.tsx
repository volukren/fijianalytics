import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center space-y-8 py-20">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Privacy First</h3>
          <p className="text-gray-600">
            No cookies, no tracking, just clean analytics that respect your
            users.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Real-time Data
          </h3>
          <p className="text-gray-600">
            Get instant insights into your website traffic and user behavior.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Easy Setup</h3>
          <p className="text-gray-600">
            Add one line of code and start tracking in minutes, not hours.
          </p>
        </div>
      </div>
    </div>
  );
}
