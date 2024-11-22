// BusinessForm.js
import React from "react";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import Map, { Marker } from "react-map-gl";
import Pin from "./Pin"

const BusinessForm = ({
  businessInfo,
  formErrors,
  handleInputChange,
  handleFormSubmit,
  handleMarkerDragEnd,
  longitude,
  latitude,
  loading,
  errorMessage,
  shopColor
}) => {
  return (
    <form onSubmit={handleFormSubmit} className="mt-4">
      <MDBInput
        wrapperClass="mb-4"
        label="Shop Name"
        type="text"
        name="name"
        value={businessInfo.name}
        onChange={handleInputChange}
        invalid={formErrors.name ? true : false}
      />
      {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
      
      <MDBInput
        wrapperClass="mb-4"
        type="email"
        label="Email"
        name="email"
        value={businessInfo.email}
        onChange={handleInputChange}
        invalid={formErrors.email ? true : false}
      />
      {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
      
      <MDBInput
        wrapperClass="mb-4"
        type="tel"
        label="Phone"
        name="phone"
        value={businessInfo.phone}
        onChange={handleInputChange}
        invalid={formErrors.phone ? true : false}
      />
      {formErrors.phone && <div className="text-danger">{formErrors.phone}</div>}
      
      {longitude && latitude && (
        <div style={{ width: "100%", height: "400px", marginBottom: "20px" }}>
          <Map
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            initialViewState={{ longitude, latitude, zoom: 10 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <Marker
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
              draggable
              onDragEnd={handleMarkerDragEnd}
            >
              <Pin />
            </Marker>
          </Map>
        </div>
      )}
      
      {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
      
      <MDBBtn className="mb-4" type="submit" block disabled={loading}  style={{ backgroundColor: shopColor }}>
        {loading ? "Creating..." : "Create"}
      </MDBBtn>
    </form>
  );
};

export default (BusinessForm);
