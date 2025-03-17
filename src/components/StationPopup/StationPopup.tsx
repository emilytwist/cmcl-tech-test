import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useStationReadings } from "../../hooks/useStationReadings";

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { timestamp, value } = payload[0].payload;
  
      return (
        <div className="tooltip">
          <p>Time: {timestamp}</p>
          <p>Value: {value}</p>
        </div>
      );
    }
    return null;
  };

export const StationPopup = ({ stationId }: { stationId: string }) => {
    const { data: readings, isLoading, error } = useStationReadings(stationId);

    if (isLoading) return <p>Loading readings...</p>;
    if (error) return <p>Error fetching readings</p>;
    if (!readings || readings.length === 0) return <p>No readings available</p>;

  return (
    <div>
      <h4>Readings (Last 24 hours)</h4>

      <Tabs className="tabs-container" defaultValue="chart">
        <TabsList className="tabs-list">
            <TabsTrigger className="tab-trigger" value="chart">Chart</TabsTrigger>
            <TabsTrigger className="tab-trigger" value="table">Table</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="table">
            <div className="table-container">
                <table>
                <thead>
                    <tr>
                    <th>Time</th>
                    <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {readings.map(({ timestamp, value }, i) => (
                    <tr className="table-row" key={`${timestamp}-${i}`}>
                        <td>{timestamp}</td>
                        <td>{value}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
