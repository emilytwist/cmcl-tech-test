import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchStations = async () => {
  const response = await axios.get('https://environment.data.gov.uk/flood-monitoring/id/stations');
  return response.data.items;
};

export const useStations = () => {
    return useQuery({
      queryKey: ['stations'], 
      queryFn: fetchStations,  
      staleTime: 1000 * 60 * 5,
    });
  };
