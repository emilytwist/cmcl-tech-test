import { create }from 'zustand';

interface Station {
  id: string;
  name: string;
  lat: number;
  long: number;
}

interface StationsStore {
  stations: Station[];
  setStations: (stations: Station[]) => void;
}

export const useStationsStore = create<StationsStore>((set) => ({
  stations: [],
  setStations: (stations) => set({ stations }),
}));
