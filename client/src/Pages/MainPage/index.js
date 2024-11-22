import React, { useState, useEffect, useCallback } from "react"; // Import React and hooks
import Auth from "../../utils/auth"; // Import authentication utility
import axios from "axios"; // Import axios for API calls
import Map, { Popup, Marker } from "react-map-gl"; // Import Map, Popup, and Marker from react-map-gl
import {
  MDBContainer,
  MDBCarousel,
  MDBCarouselItem,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBRow,
  MDBCol,
  MDBNavbar,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
} from "mdb-react-ui-kit"; // Import MDB components
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS
import Pin from "../../Components/Pin"; // Import custom Pin component
import { Navigate } from "react-router-dom"; // Import Navigate for routing

const baseUrl = process.env.REACT_APP_BASE_URL; // Get base URL from environment variables

export const MainPage = () => {
  // State variables to manage the component's state
  const [lng, setLng] = useState(""); // Longitude state
  const [lat, setLat] = useState(""); // Latitude state
  const [catData, setCatData] = useState([]); // Categories data state
  const [showPopup, setShowPopup] = useState({}); // Popup state
  const [openNavCentred, setOpenNavCentred] = useState(false); // Navbar toggle state
  const [shops, setShops] = useState([]); // Shops data state

  // Fetch user's location data using IP API
  const getData = useCallback(async () => {
    try {
      const res = await axios.get("https://ipapi.co/json");
      setLng(res.data.longitude); // Set longitude
      setLat(res.data.latitude); // Set latitude
    } catch (error) {
      console.error("Error fetching location data:", error); // Log any errors
    }
  }, []); // Empty dependency array means this runs only on mount

  // Handle the new marker location when the marker is dragged
  const handleNewLocation = ({ lngLat }) => {
    setLng(lngLat.lng); // Update longitude
    setLat(lngLat.lat); // Update latitude
    console.log("Marker Position:", {
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    }); // Log new position
  };

  // Fetch categories from the API
  const getCategories = useCallback(async (access_token) => {
    try {
      const { data } = await axios.get(`${baseUrl}/all-categories`, {
        headers: {
          Authorization: `Bearer ${access_token}`, // Include auth token
          Accept: "application/json", // Set Accept header
        },
      });
      setCatData(data); // Update categories data
    } catch (error) {
      console.error("Error fetching categories:", error); // Log any errors
    }
  }, []); // Empty dependency array means this runs only on mount

  // Fetch shops in the user's area
  const getShopsInMyArea = useCallback(async (access_token) => {
    try {
      const { data } = await axios.get(`${baseUrl}/shops`, {
        headers: {
          Authorization: `Bearer ${access_token}`, // Include auth token
          Accept: "application/json", // Set Accept header
        },
      });
      console.log(data); // Log fetched shop data
      setShops(data); // Update shops data
    } catch (error) {
      console.error("Error fetching shops:", error); // Log any errors
    }
  }, []); // Empty dependency array means this runs only on mount

  // Fetch data on component mount
  useEffect(() => {
    if (Auth.loggedIn()) {
      // Check if user is logged in
      const token = Auth.getToken(); // Get authentication token
      getData(); // Fetch location data
      getCategories(token); // Fetch categories
      getShopsInMyArea(token); // Fetch shops
    }
  }, [getData, getCategories, getShopsInMyArea]); // Added getShopsInMyArea to dependencies

  // Handle marker click event
  const handleMarkerClick = (e, long, lati, name, id, logo) => {
    e.originalEvent.stopPropagation(); // Prevent event from bubbling up
    setShowPopup({ long, lati, name, id, logo }); // Set popup coordinates
  };

  return (
    <>
      {Auth.loggedIn() ? ( // Check if user is logged 
      
        <MDBContainer
          breakpoint="xl"
          className="d-flex text-center flex-column justify-content-center p-3"
        >
          {/* Navbar */}
          <MDBNavbar expand="lg" light bgColor="light">
            <MDBContainer fluid>
              <MDBNavbarToggler
                type="button"
                aria-controls="navbarCenteredExample"
                aria-expanded={openNavCentred}
                aria-label="Toggle navigation"
                onClick={() => setOpenNavCentred(!openNavCentred)} // Toggle navbar
              >
                <MDBIcon icon="bars" fas />
              </MDBNavbarToggler>

              <MDBCollapse
                navbar
                open={openNavCentred}
                id="navbarCenteredExample"
              >
                <MDBNavbarNav className="mb-2 mb-lg-0">
                  <MDBNavbarItem>
                    <MDBNavbarLink active aria-current="page" href="#">
                      Home
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink href="/profile">
                      <i className="far fa-user"></i>
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                </MDBNavbarNav>
              </MDBCollapse>
            </MDBContainer>
          </MDBNavbar>

          {/* Carousel */}
          <MDBCarousel showControls showIndicators className="mt-2 mb-2">
            {[1, 2, 3].map(
              (
                itemId // Loop through items for the carousel
              ) => (
                <MDBCarouselItem itemId={itemId} key={itemId}>
                  <img
                    src={`https://mdbootstrap.com/img/new/slides/04${itemId}.jpg`} // Carousel image source
                    className="d-block w-100"
                    alt={`Slide ${itemId}`} // Alt text for accessibility
                  />
                </MDBCarouselItem>
              )
            )}
          </MDBCarousel>

          {/* Categories Row */}
          <MDBRow className="row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-2">
            {catData.map(
              (
                { id, category } // Map through categories data
              ) => (
                <MDBCol key={id}>
                  <MDBCard className="h-100">
                    <MDBCardBody>
                      <MDBCardTitle>{category}</MDBCardTitle>{" "}
                      {/* Display category name */}
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              )
            )}
          </MDBRow>

          {/* Map */}
          {lng &&
            lat && ( // Check if latitude and longitude are available
              <div style={{ width: "100%", height: "500px" }}>
                <Map
                  mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} // Get Mapbox token from environment variables
                  initialViewState={{
                    longitude: lng, // Initial longitude
                    latitude: lat, // Initial latitude
                    zoom: 10, // Initial zoom level
                  }}
                  style={{ width: "100%", height: "100%" }} // Map style
                  mapStyle="mapbox://styles/mapbox/streets-v9" // Map style from Mapbox
                >
                  {shops.map(
                    (
                      shop // Map through shops to create markers
                    ) => (
                      <Marker
                        key={shop.id} // Unique key for each marker
                        longitude={shop.location.longitude} // Marker longitude
                        latitude={shop.location.latitude} // Marker latitude
                        anchor="bottom" // Marker anchor position
                        onClick={(e) =>
                          handleMarkerClick(
                            e,
                            shop.location.longitude,
                            shop.location.latitude,
                            shop.name,
                            shop.id,
                            shop.logo
                          )
                        } // Pass longitude and latitude on click
                      >
                        <Pin />{" "}
                        {/* Render custom Pin component for the marker*/}
                      </Marker>
                    )
                  )}
                  {/* Popup for the marker */}
                  {showPopup.long &&
                    showPopup.lati && ( // Check if popup coordinates are set
                      <Popup
                        longitude={showPopup.long} // Popup longitude
                        latitude={showPopup.lati} // Popup latitude
                        onClose={() => setShowPopup({})} // Close popup on click
                      >
                        <div>
                          <a
                            target="_new"
                            href={`/shop-public-info/${showPopup.id}`} // Wikipedia link
                          >
                            {showPopup.name}
                          </a>
                          <img
                            src={showPopup.logo|| "/images/logo.png"} // Image for popup
                            className="d-block w-100"
                            alt="Popup Image" // Alt text for accessibility
                          />
                        </div>
                      </Popup>
                    )}
                </Map>
              </div>
            )}
        </MDBContainer>
      ) : (
        <Navigate to="/login" /> // Redirect to login if not logged in
      )}
    </>
  );
};
