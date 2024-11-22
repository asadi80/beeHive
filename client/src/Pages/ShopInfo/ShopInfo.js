import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom"; // Import navigation hooks
import apiCalls from "../../utils/apicalls/apiCalls";
import ShopMenuList from "../../Components/ShopMenuList";
import MealList from "../../Components/MealList";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBIcon,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Map, { Marker } from "react-map-gl"; // Import Map and Marker components
import Pin from "../../Components/Pin";
export const ShopInfo = () => {
  const { id: shopId } = useParams(); // Extract shopId from URL parameters
  const [shopInfo, setShopInfo] = useState(null); // State to hold shop information
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to hold error messages
  const [longitude, setLongitude] = useState(""); // State for longitude
  const [latitude, setLatitude] = useState(""); // State for latitude
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
    x: "",
  });
  const [menuItems, setMenuItems] = useState([]);
  const [mealItems, setMealItems] = useState([]);
  const [menuId, setMenuId] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for map error messages
  const [buttonColors, setButtonColors] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  const getShopInfo = useCallback(async () => {
    try {
      const response = await apiCalls.getShopInfoPublic(shopId); // Call API to get shop info
      console.log(response);

      const { facebook, instagram, x, location, about, menu } = response;
      setShopInfo(response); // Update state with fetched data
      setSocialMedia({ facebook, instagram, x });
      setLatitude(location.latitude);
      setLongitude(location.longitude);
      setMenuItems(response.menu || []);

      const firstNonEmptyMealCategory = response.menu.find(
        (item) => item.meal.length > 0
      );
      setMealItems(
        firstNonEmptyMealCategory ? firstNonEmptyMealCategory.meal : []
      );
    } catch (err) {
      console.error("Error fetching shop info:", err); // Log error
      setError("Failed to fetch shop information. Please try again."); // Set error message
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  }, [shopId]); // Dependency array includes shopId

  useEffect(() => {
    getShopInfo(); // Fetch shop info when component mounts
  }, [getShopInfo]);

  const renderSocialMediaIcon = (platform, url, icon) => {
    if (!url) return null;

    return (
      <MDBCardText className="mb-1 h5">
        <Link to={url} target="_blank">
          <MDBIcon fab icon={icon} size="2x" style={{ color: "#F54748" }} />
        </Link>
      </MDBCardText>
    );
  };

  const findMealsByCategoryId = (id) => {
    const category = shopInfo.menu.find((item) => item.id === id);
    return category ? setMealItems(category.meal) : [];
  };

  // Handle directions on pin click
  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(directionsUrl, "_blank");
  };

  const handleClick = (id) => {
    setButtonColors((prevColors) => ({
      prevColors,
      [id]: prevColors[id] === "#F29191" ? "#F54748" : "#F29191", // Toggle color for this specific button
    }));
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="text-center">
        <MDBSpinner size="lg" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center">
        <p>{error}</p>
      </div>
    );
  }

  // If shopInfo is available, render the shop information

  return (
    <div className="gradient-custom-2">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div
                className="rounded-top text-white d-flex flex-row"
                style={{ backgroundColor: "#000", height: "200px" }}
              >
                <div
                  className="ms-4 mt-5 d-flex flex-column"
                  style={{ width: "150px" }}
                >
                  <MDBCardImage
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                    alt="Generic placeholder image"
                    className="mt-4 mb-2 img-thumbnail"
                    fluid
                    style={{ width: "150px", zIndex: "1" }}
                  />
                  <MDBBtn
                    outline
                    color="dark"
                    style={{ height: "36px", overflow: "visible" }}
                  >
                    Edit profile
                  </MDBBtn>
                </div>
                <div className="ms-3" style={{ marginTop: "130px" }}>
                  <MDBTypography tag="h5">{shopInfo.name}</MDBTypography>
                  <MDBCardText>{shopInfo.phone}</MDBCardText>
                </div>
              </div>
              <div className="p-4 text-black">
                <div className="d-flex justify-content-end text-center py-1">
                  {renderSocialMediaIcon(
                    "facebook",
                    socialMedia.facebook,
                    "facebook-square"
                  )}
                  <div className="px-3">
                    {renderSocialMediaIcon(
                      "instagram",
                      socialMedia.instagram,
                      "instagram"
                    )}
                  </div>
                  {renderSocialMediaIcon("x", socialMedia.x, "x")}
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">About Us</p>
                  <div className="p-4" >
                    <MDBCardText className="font-italic mb-1">
                      {shopInfo.about}
                    </MDBCardText>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">
                    Menu
                  </MDBCardText>
                </div>
                <div className=" d-flex justify-content-center align-items-center mb-2 ">
                  {menuItems.length > 0 && (
                    <ShopMenuList
                      menuItems={menuItems}
                      setMenuId={setMenuId}
                      findMealsByCategoryId={findMealsByCategoryId}
                      buttonColors={buttonColors}
                      handleClick={handleClick}
                      setButtonColor={setButtonColors}
                      setIsFormVisible={setIsFormVisible}

                    />
                  )}
                </div>

                <div className=" d-flex justify-content-center align-items-center ">
                  {mealItems.length > 0 && <MealList mealItems={mealItems} />}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mt-3">
                    Our Location
                  </MDBCardText>
                </div>
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
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}{" "}
      </MDBContainer>
    </div>
  );
};
