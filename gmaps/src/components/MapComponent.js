import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapComponent.css";

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


const MapComponent = ({ initialLocation, destination, searchResults, route }) => {
  return (
    <MapContainer center={initialLocation} zoom={13} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={initialLocation} icon={customIcon}>
        <Popup>Initial Location</Popup>
      </Marker>
      <Marker position={destination} icon={customIcon}>
        <Popup>Destination</Popup>
      </Marker>
      {searchResults.map((result, index) => (
        <Marker key={index} position={result} icon={customIcon}>
          <Popup>Search Result {index + 1}</Popup>
        </Marker>
      ))}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default MapComponent;