import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom"; // Import navigation hooks
import apiCalls from "../../utils/apicalls/apiCalls";
import ShopMenuList from "../../Components/ShopMenuList";
import MealListForPublic from "../../Components/MealListForPublic";
import Map, { Marker } from "react-map-gl"; // Import Map and Marker components
import Pin from "../../Components/Pin";
import { QRCode } from "react-qrcode-logo";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBSpinner,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";

export const ShopPublicInfo = () => {
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
  const [shopColor, setShopColor] = useState("#ff9d2a");
  const [logo, setLogo] = useState(null)


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
      setShopColor(response.color)
      setLogo(response.logo)

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
      <Link to={url} target="_blank">
        <MDBBtn outline floating style={{ borderColor: shopColor }}>
          <MDBIcon fab icon={icon} size="lg" style={{ color: shopColor }} />
        </MDBBtn>
      </Link>
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
      [id]: prevColors[id] === "#F29191" ? shopColor : "#F29191", // Toggle color for this specific button
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

  return (
    <div className="vh-100 " style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="container py-3 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="12" xl="4">
            <MDBCard style={{ borderRadius: "15px" }}>
              <MDBCardBody className="text-center">
                <div className="mt-3 mb-4">
                  <MDBCardImage
                    src={logo || "/images/my-image.png"}
                    className="rounded-circle"
                    fluid
                    style={{ width: "150px" }}
                  />
                </div>
                <MDBTypography tag="h4">{shopInfo.name}</MDBTypography>
                <MDBCardText className="text-muted mb-4">
                  <MDBIcon fas icon="phone" style={{ color: shopColor }} />{" "}
                  {shopInfo.phone} <span className="mx-2">|</span>{" "}
                  <Link to={shopInfo.emal}>{shopInfo.email}</Link>
                </MDBCardText>

                <div className="d-flex justify-content-center text-center mb-4 pb-2">
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

                <div className="d-flex justify-content-center text-center mb-4 pb-2">
                      <QRCode
                        value={`http://localhost:3001/shop-public-info/${shopInfo.id}`}
                        size={220}
                        fgColor={shopColor}
                        bgColor="#FFFFFF"
                        logoPaddingStyle="circle"
                        quietZone={15}
                        qrStyle="dots"
                        logoImage={logo}
                        logoOpacity={1}
                        logoHeight={220 * 0.2}
                        logoWidth={50}
                        removeQrCodeBehindLogo={true}
                        eyeRadius={50}
                        logoPadding={3}
                        ecLevel="Q"

                        
                      />
                    </div>

                <MDBCardBody className="text-black p-4">
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1" style={{color: shopColor, fontSize: "2em"}}>About Us</p>
                    <div className="p-4">
                      <MDBCardText style={{textAlign: "justify"}} className="font-italic mb-1 ">
                        {shopInfo.about}
                      </MDBCardText>
                    </div>
                  </div>
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1" style={{color: shopColor, fontSize: "2em"}}>Menu</p>
                  </div>
                  <div className=" d-flex justify-content-center align-items-center mt-2  mb-2 ">
                    {menuItems.length > 0 && (
                      <ShopMenuList
                        menuItems={menuItems}
                        setMenuId={setMenuId}
                        findMealsByCategoryId={findMealsByCategoryId}
                        buttonColors={buttonColors}
                        handleClick={handleClick}
                        setButtonColor={setButtonColors}
                        setIsFormVisible={setIsFormVisible}
                        shopColor={shopColor}
                      />
                    )}
                  </div>

                  <div className=" d-flex justify-content-center align-items-center ">
                    {mealItems.length > 0 && <MealListForPublic mealItems={mealItems} />}
                  </div>

                  <div className="mb-2 mt-3">
                    <p className="lead fw-normal mb-1" style={{color: shopColor, fontSize: "2em"}}>Our Location</p>
                  </div>
                  <MDBRow className="mt-1">
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
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};
