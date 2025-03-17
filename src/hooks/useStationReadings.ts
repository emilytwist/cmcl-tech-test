import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_ROOT = 'https://environment.data.gov.uk/flood-monitoring';

interface StationReading {
  timestamp: string;
  value: number;
}

const fetchStationReadings = async (stationId: string): Promise<StationReading[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 1);

  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  const url = `${API_ROOT}/id/stations/${stationId}/readings?startdate=${startDateStr}&enddate=${endDateStr}&_sorted`;

  const { data } = await axios.get(url);

  if (!data.items) {
    throw new Error("API Error: No items found");
  }

  return data.items.map((reading: any) => ({
    timestamp: new Date(reading.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: reading.value
  }));
};

export const useStationReadings = (stationId: string) => {
  return useQuery({
    queryKey: ['stationReadings', stationId],
    queryFn: () => fetchStationReadings(stationId),
    enabled: !!stationId,
    staleTime: 15 * 60 * 1000, 
    retry: 1,
  });
};
