import React, { useState, useEffect } from "react";
import MapComponent from "../components/MapComponent";
import "./Home.css";

const geocodeCity = async (city) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
  );
  const data = await response.json();
  if (data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
};

const getRoute = async (start, end) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
    }
  } catch (error) {
    console.error("Error fetching route:", error);
  }
  return [];
};

const HomePage = () => {
  const [initialLocation, setInitialLocation] = useState([28.6139, 77.2090]);
  const [destination, setDestination] = useState([19.0760, 72.8777]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = ([position.coords.latitude, position.coords.longitude]);
          setCurrentLocation(userLocation);
          setInitialLocation(userLocation);
        },
        (error) => console.error("Error fetching current location:", error)
      );
    }
  }, []);

  const handleSearch = async () => {
    const coords = await geocodeCity(searchQuery);
    if (coords) {
      setSearchResults([...searchResults, coords]);
    }
  };

  const handleSetLocation = async (query, setLocation) => {
    const coords = await geocodeCity(query);
    if (coords) {
      setLocation(coords);
    }
  };

  const calculateRoute = async () => {
    const newRoute = await getRoute(initialLocation, destination);
    setRoute(newRoute);
    if (newRoute.length > 0) {
      const totalDistance = (newRoute.length / 10).toFixed(2);
      setDistance(totalDistance);
    }
  };
  const switchLocations = () => {
    setInitialLocation(destination);
    setDestination(initialLocation);
  };

  return (
    <div className="homepage-container">
      <h1 className="title">Real-Time Location Map</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Enter initial city"
        onBlur={(e) => handleSetLocation(e.target.value, setInitialLocation)}
      />
      <button className="switch-button" onClick={switchLocations}> 🔁 </button>
      <input
        type="text"
        className="search-input"
        placeholder="Enter destination city"
        onBlur={(e) => handleSetLocation(e.target.value, setDestination)}
      />
      <button className="calculate-button" onClick={calculateRoute}>Find Location</button>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search city"
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
      {distance && <p className="distance">Distance: {distance} km</p>}
      <MapComponent initialLocation={initialLocation} destination={destination} searchResults={searchResults} route={route} currentLocation={currentLocation} />
    </div>
  );
};

export default HomePage;
