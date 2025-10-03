"use client";

import { ResponsiveLine } from "@nivo/line";

interface VisitorsChartProps {
  data: Array<{ hour: number; visitors: number }>;
}

export function PageviewsChart({ data }: VisitorsChartProps) {
  const chartData = [
    {
      id: "visitors",
      data: data.map((d) => ({
        x: `${d.hour}:00`,
        y: d.visitors,
      })),
    },
  ];

  return (
    <div className="h-96">
      <ResponsiveLine
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 50, left: 40 }}
        // xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legendOffset: 45,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: -35,
          legendPosition: "middle",
        }}
        colors={{ scheme: "category10" }}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={0.15}
        useMesh={true}
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: 11,
              },
            },
            legend: {
              text: {
                fontSize: 12,
              },
            },
          },
        }}
      />
    </div>
  );
}
