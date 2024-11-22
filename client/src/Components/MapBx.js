import React, { useState, useEffect, useCallback } from "react";
import Map, { Marker } from "react-map-gl"; // Import Map and Marker components
import Pin from "./Pin";
import { MDBRow } from "mdb-react-ui-kit"; // Import UI components from MDB

 const MapBx = ({latitude, longitude, setErrorMessage, }) => {

    // Handle directions on pin click
  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(directionsUrl, "_blank");
  };

  return (
    <>
      <MDBRow className="mt-3">
        {longitude && latitude ? (
          <div
            style={{
              width: "100%",
              height: "400px",
              marginBottom: "20px",

              margin: "5px",
            }}
          >
            <Map
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              initialViewState={{
                longitude: longitude,
                latitude: latitude,
                zoom: 10,
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              onError={(e) => {
                console.error("Map loading error:", e);
                setErrorMessage("Failed to load map.");
              }}
              navigationControl={true} // Adds zoom controls
            >
              <Marker
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
                onClick={handleGetDirections} // Adding click handler here
              >
                <Pin />
              </Marker>
            </Map>
          </div>
        ) : (
          <p className="text-muted">Location data unavailable</p>
        )}
      </MDBRow>
    </>
  );
};

export default (MapBx);
