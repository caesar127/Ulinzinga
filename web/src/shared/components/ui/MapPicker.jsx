import React, { useState, useEffect, useRef } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

const MapPicker = ({
  label,
  value,
  onChange,
  error,
  height = "300px",
  center = [-15.3875, 35.0066],
  className = "",
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState(value?.address || "");
  const [coordinates, setCoordinates] = useState(
    value
      ? { lat: value.lat, lng: value.lng }
      : { lat: center[0], lng: center[1] }
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (window.L) {
        setIsMapLoaded(true);
        return;
      }

      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      cssLink.crossOrigin = "";
      document.head.appendChild(cssLink);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => setIsMapLoaded(true);
      document.head.appendChild(script);
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    const map = L.map(mapRef.current).setView(
      [coordinates.lat, coordinates.lng],
      15
    );
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker([coordinates.lat, coordinates.lng], {
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    marker.on("dragend", function (e) {
      const { lat, lng } = e.target.getLatLng();
      handleLocationSelect(lat, lng);
    });

    map.on("click", function (e) {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      handleLocationSelect(lat, lng);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [isMapLoaded]);

  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      mapInstanceRef.current.setView(
        [coordinates.lat, coordinates.lng],
        mapInstanceRef.current.getZoom()
      );
    }
  }, [coordinates.lat, coordinates.lng]);

  const handleLocationSelect = (lat, lng) => {
    setCoordinates({ lat, lng });
    fetchAddress(lat, lng);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    if (coordinates.lat && coordinates.lng) {
      onChange({
        ...coordinates,
        address: newAddress,
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = { lat: latitude, lng: longitude };
          setCoordinates(newCoords);

          if (markerRef.current && mapInstanceRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
            mapInstanceRef.current.setView([latitude, longitude], 15);
          }

          fetchAddress(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please click on the map to select a location."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      if (data.display_name) {
        setAddress(data.display_name);
        onChange({ lat, lng, address: data.display_name });
      } else {
        const coordsAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setAddress(coordsAddress);
        onChange({ lat, lng, address: coordsAddress });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      const coordsAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(coordsAddress);
      onChange({ lat, lng, address: coordsAddress });
    }
  };

  const handleSearchAddress = async () => {
    if (!address.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        setCoordinates({ lat: newLat, lng: newLng });
        setAddress(display_name);

        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
          mapInstanceRef.current.setView([newLat, newLng], 15);
        }

        onChange({ lat: newLat, lng: newLng, address: display_name });
      } else {
        alert(
          "Address not found. Please try a different search or click on the map."
        );
      }
    } catch (error) {
      console.error("Error searching address:", error);
      alert("Error searching for address. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchAddress();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="space-y-3">
        <div
          className="border border-gray-300 rounded-lg overflow-hidden relative"
          style={{ height }}
        >
          {!isMapLoaded ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-500">Loading map...</div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}

          <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg z-[1000]">
            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="w-4 h-4 text-black/50" />
              <span>
                {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              onKeyPress={handleKeyPress}
              placeholder="Search address or click on map to select location"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleSearchAddress}
              className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
            >
              Search
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="flex-1 px-3 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none"
            >
              Use Current Location
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Click on the map to select a location, drag the marker to adjust, or
          search for an address.
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default MapPicker;
