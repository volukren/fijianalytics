"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageviewsChart } from "@/components/website/pageviews-chart";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

interface Analytics {
  pageViews: number;
  uniqueSessions: number;
  topPages: Array<{ href: string; views: number }>;
  referrers: Array<{ referrer: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  operatingSystems: Array<{ os: string; count: number }>;
  visitorsByHour: Array<{ hour: number; visitors: number }>;
}

interface AnalyticsDashboardProps {
  domain: string;
}

export function AnalyticsDashboard({ domain }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/${domain}`);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [domain]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600">Error loading analytics: {error}</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div>No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex gap-4 divide-x-2">
            <div className="p-4">
              <div className="text-sm text-gray-600">Page Views</div>
              <div className="text-2xl font-bold">{analytics.pageViews}</div>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-600">Unique Sessions</div>
              <div className="text-2xl font-bold">{analytics.uniqueSessions}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PageviewsChart data={analytics.visitorsByHour} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Pages</h2>
          <div className="space-y-2">
            {analytics.topPages.length > 0 ? (
              analytics.topPages.map((page) => (
                <div key={page.href} className="flex justify-between">
                  <div className="text-sm truncate max-w-md">
                    {page.href || "/"}
                  </div>
                  <div className="text-sm font-medium">{page.views}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No data yet</div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Top Referrers</h2>
          <div className="space-y-2">
            {analytics.referrers.length > 0 ? (
              analytics.referrers.map((referrer) => (
                <div key={referrer.referrer} className="flex justify-between">
                  <div className="text-sm truncate max-w-md">
                    {referrer.referrer || "Direct"}
                  </div>
                  <div className="text-sm font-medium">{referrer.count}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No data yet</div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Devices</h2>
          <Tabs defaultValue="browser" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browser">Browser</TabsTrigger>
              <TabsTrigger value="os">OS</TabsTrigger>
            </TabsList>
            <TabsContent value="browser" className="space-y-2 mt-3">
              {analytics.browsers.length > 0 ? (
                analytics.browsers.map((browser) => (
                  <div key={browser.browser} className="flex justify-between">
                    <div className="text-sm truncate max-w-md">
                      {browser.browser || "Unknown"}
                    </div>
                    <div className="text-sm font-medium">{browser.count}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No data yet</div>
              )}
            </TabsContent>
            <TabsContent value="os" className="space-y-2 mt-3">
              {analytics.operatingSystems.length > 0 ? (
                analytics.operatingSystems.map((os) => (
                  <div key={os.os} className="flex justify-between">
                    <div className="text-sm truncate max-w-md">
                      {os.os || "Unknown"}
                    </div>
                    <div className="text-sm font-medium">{os.count}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No data yet</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
