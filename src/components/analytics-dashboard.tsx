"use client";

import { useEffect, useState } from "react";

interface Analytics {
  pageViews: number;
  uniqueSessions: number;
  topPages: Array<{ href: string; views: number }>;
  referrers: Array<{ referrer: string; count: number }>;
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
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-600">Page Views</div>
          <div className="text-2xl font-bold">{analytics.pageViews}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-600">Unique Sessions</div>
          <div className="text-2xl font-bold">{analytics.uniqueSessions}</div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Top Pages</h2>
        <div className="space-y-2">
          {analytics.topPages.length > 0 ? (
            analytics.topPages.map((page) => (
              <div key={page.href} className="flex justify-between">
                <div className="text-sm truncate max-w-md">{page.href}</div>
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

      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">Installation</h2>
        <p className="text-sm text-gray-600 mb-2">
          Add this script to your website:
        </p>
        <code className="block p-2 bg-white rounded text-xs">
          {`<script data-domain="${domain}" src="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/script.js"></script>`}
        </code>
      </div>
    </div>
  );
}
