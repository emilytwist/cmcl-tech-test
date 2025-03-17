import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useStations } from './hooks/useStations';
import { useStationsStore } from './store/stationsStore';
import "./App.css";
import "leaflet/dist/leaflet.css";
import { StationPopup } from './components/StationPopup/StationPopup';
import MapMarker from './assets/images/map-marker.png'

const CMCL_CENTER: [number, number] = [52.2139035, 0.1113293];
const ZOOM_LEVEL = 12;
const DEFAULT_BOUNDS = {
  southWest: {
    lat: 52.13707047178761,
    lng: -0.06969451904296876,
  },
  northEast: {
    lat: 52.290632597351866,
    lng: 0.2921676635742188,
  },
};

const getFloodMarkerIcon = () => {
  return new L.Icon({
    iconUrl: MapMarker,
    iconSize: [25, 38],
    iconAnchor: [12, 38],
    popupAnchor: [1, -34],
  });
};

const FullScreenMap: React.FC = () => {
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const { data: stations, isLoading } = useStations();
  const { setStations } = useStationsStore();

  useEffect(() => {
    if (stations) {
      setStations(stations); 
    }
  }, [stations, setStations]);

  useEffect(() => {
    if (!bounds) {
      setBounds( 
        L.latLngBounds(
          [DEFAULT_BOUNDS.southWest.lat, DEFAULT_BOUNDS.southWest.lng],
          [DEFAULT_BOUNDS.northEast.lat, DEFAULT_BOUNDS.northEast.lng]
      ))
    }
  },[bounds])

  const getVisibleStations = (stations: any[], bounds: L.LatLngBounds) => {
    if (!bounds || !stations || stations.length === 0) {
      return [];
    }
    return stations.filter((station) => {
        const isValidLatLong = typeof station.lat === 'number' && typeof station.long === 'number';
        return isValidLatLong && bounds.contains([station.lat, station.long]);
      }
    );
  };

  const MapEventHandler = () => {
    const map = useMapEvents({
      moveend: () => {
        const newBounds = map.getBounds();
        setBounds(newBounds); 
      },
      zoomend: () => {
        const newBounds = map.getBounds();
        setBounds(newBounds); 
      },
    });
    return null;
  };

  const LoadingIndicator = () => {
    return (<div className="loading-indicator">
      {Array(8).fill(null).map((_, index) => (
        <div key={index}></div>
      ))}
    </div>)
  }

  return (
    <div className="map-container">
      {(isLoading || !stations) && <LoadingIndicator />}
      <MapContainer center={CMCL_CENTER} zoom={ZOOM_LEVEL} style={{ height: '100%', width: '100%', zIndex: '10' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEventHandler />
        {!isLoading && stations &&
          getVisibleStations(stations, bounds!).map((station) => (
            <Marker key={station.stationReference} position={[station.lat, station.long]} icon={getFloodMarkerIcon()}>
              <Popup minWidth={400} closeOnEscapeKey>
                <h3 className="station-label">{station.label}</h3>
                <div>
                  <StationPopup stationId={station.stationReference} />
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      <span className="attribution">This uses Environment Agency flood and river level data from the real-time data API (Beta)</span>
    </div>
  );
};

export default FullScreenMap;
