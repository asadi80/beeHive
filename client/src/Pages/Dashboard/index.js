import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useParams, Link } from "react-router-dom"; // Import navigation hooks
import axios from "axios";
import Auth from "../../utils/auth";
import ShopMenuList from "../../Components/ShopMenuList";
import MapBx from "../../Components/MapBx";
import {
  MDBContainer,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBCardText,
  MDBTypography,
  MDBIcon,
  MDBSpinner,
} from "mdb-react-ui-kit"; // Import UI components from MDB
import MealForm from "../../Components/MealForm";
import MealList from "../../Components/MealList";
import { AddMenuForm } from "../../Components/AddMenuForm";
import { AboutUsUpdate } from "../../Components/AboutUsUpdate";
import SocialMediaForm from "../../Components/SocialMediaForm";
import UpdateShopColor from "../../Components/UpdateShopColor";
import { QRCode } from "react-qrcode-logo";
import { events } from "react-mapbox-gl/lib/map-events";
const baseUrl = process.env.REACT_APP_BASE_URL; // Base URL from environment variables

export const Dashboard = () => {
  const { id: shopId } = useParams(); // Extract shopId from URL parameters
  const [shopInfo, setShopInfo] = useState(null); // State to hold shop information
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to hold error messages
  const [longitude, setLongitude] = useState(""); // State for longitude
  const [latitude, setLatitude] = useState(""); // State for latitude
  const [errorMessage, setErrorMessage] = useState(""); // State for map error messages
  const [businessLinks, setBusinessLinks] = useState({
    facebook: "",
    x: "",
    instagram: "",
  }); // State for business links
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    x: "",
    instagram: "",
  });
  const [aboutUs, setAboutUs] = useState("");
  const [about, setAbout] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const socialPlatforms = ["facebook", "x", "instagram"];
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [mealItems, setMealItems] = useState([]);
  const [menuId, setMenuId] = useState("");
  const [buttonColors, setButtonColors] = useState({});
  const [selectedImageLogo, setSelectedImageLogo] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [shopColor, setShopColor] = useState("#ff9d2a");
  const [color, setColor] = useState("#ff9d2a");

  // Function to fetch shop information
  const getShopInfo = useCallback(async () => {
    const token = Auth.getToken(); // Retrieve authentication token

    try {
      const response = await axios.get(
        [baseUrl, "shop-info", shopId].join("/"),

        {
          headers: {
            Authorization: `Bearer ${token}`, // Set authorization header
            Accept: "application/json", // Accept JSON response
          },
        }
      );
      const { facebook, instagram, x, location } = response.data;
      setShopInfo(response.data); // Update state with fetched data
      setSocialMedia({ facebook, instagram, x });
      setMenuItems(response.data.menu);
      setAbout(response.data.about);
      // Set latitude and longitude from response
      setLatitude(location.latitude);
      setLongitude(location.longitude);
      setSelectedImageLogo(response.data.logo);

      if (response.data.color) {
        setShopColor(response.data.color);
      }
      if (response.data.menu.meal) {
        const firstNonEmptyMealCategory = response.data.menu.find(
          (item) => item.meal.length > 0
        );
        setMealItems(firstNonEmptyMealCategory.meal);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching shop info:", err); // Log error
      setError("Failed to fetch shop information. Please try again."); // Set error message
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  }, [shopId]); // Dependency array includes shopId

  const renderSocialMediaIcon = (platform, url, icon) => {
    if (!url) return null;

    return (
      <Link to={url} target="_blank">
        <MDBBtn
          outline
          floating
          style={{ borderColor: shopColor }}
          className="m-1"
        >
          <MDBIcon fab icon={icon} size="lg" style={{ color: shopColor }} />
        </MDBBtn>
      </Link>
    );
  };

  const findMealsByCategoryId = (id) => {
    const category = shopInfo.menu.find((item) => item.id === id);
    return category ? setMealItems(category.meal) : [];
  };

  const handleClick = (id) => {
    setButtonColors((prevColors) => ({
      prevColors,
      [id]: prevColors[id] === "#fab769" ? shopColor : "#fab769", // Toggle color for this specific button
    }));
  };

  const updateLogo = useCallback(
    async (logo) => {
      const token = Auth.getToken();
      if (!logo) {
        console.error("The 'Logo' field is empty.");
        setError("The 'Logo' field cannot be empty.");
        return;
      }
      try {
        const response = await axios.put(
          `${baseUrl}/update-shop-logo/${shopId}`,
          { logo: logo }, // Send 'about' data in the request body
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (response && response.data) {
          console.log("logo updated:", response.data);
          setSelectedImageLogo(response.data.logo);
        }
      } catch (err) {
        setError("An error occurred while updating the 'logo' section.");
        console.error("Error updating 'logo':", err);
      }
    },
    [shopId]
  );

  // Function to handle image selection
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageLogo(URL.createObjectURL(file)); // Preview selected image
      setLoading(true); // Start loading while uploading
      handleLogoUpload(file); // Trigger image upload after selection
    }
  };

  const handleLogoUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "h2cour5m");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dnmmunlkd/image/upload/`,
        formData
      );
      // Transform the image URL for display
      const transformedUrl = response.data.secure_url.replace(
        "/upload/",
        "/upload/w_300,h_300,c_fill/"
      );
      setImageUrl(transformedUrl);
      updateLogo(transformedUrl); // Update the logo URL in your backend
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleClickLogo = (e) => {
   
    document.getElementById("logoInput").click();
  };

  // Fetch shop info on component mount and when logged in status changes
  useEffect(() => {
    if (Auth.loggedIn()) {
      getShopInfo(); // Fetch shop info if user is logged in
    }
  }, [getShopInfo]);

  // Render loading state or error message
  if (loading) {
    return (
      <p className="center">
        {" "}
        <MDBSpinner size="lg" />
      </p>
    ); // Show loading indicator
  }

  if (error) {
    return <p className="text-danger">{error}</p>; // Show error message
  }

  return (
    <>
      {Auth.loggedIn() ? (
        <div className="vh-100" style={{ backgroundColor: "#eee" }}>
          <MDBContainer className="container py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol md="12" xl="4">
                <MDBCard style={{ borderRadius: "15px" }}>
                  <MDBCardBody className="text-center">
                    <div className="mt-3 mb-4">
                      <label
                        htmlFor="imageInput"
                        style={{ cursor: "pointer" }}
                        onClick={handleClickLogo}
                      >
                        <img
                          src={selectedImageLogo || "/images/my-image.png"}
                          alt="Upload"
                          className="rounded-circle"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </label>
                      <input
                        id="logoInput"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ display: "none" }}
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

                      {renderSocialMediaIcon(
                        "instagram",
                        socialMedia.instagram,
                        "instagram"
                      )}

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
                        logoImage={selectedImageLogo || "/images/my-image.png"}
                        logoOpacity={1}
                        logoHeight={220 * 0.2}
                        logoWidth={50}
                        logoPadding={4}
                        removeQrCodeBehindLogo={true}
                        ecLevel="Q"
                        eyeRadius={50}
                      />
                    </div>

                    <MDBCardBody className="text-black p-4">
                      <AboutUsUpdate
                        aboutUs={aboutUs}
                        about={about}
                        setAboutUs={setAboutUs}
                        setAbout={setAbout}
                        setError={setError}
                        shopInfo={shopInfo}
                        shopId={shopId}
                        shopColor={shopColor}
                      />
                      <UpdateShopColor
                        color={color}
                        setColor={setColor}
                        shopId={shopId}
                        shopColor={shopColor}
                        setShopColor={setShopColor}
                      />
                      <MDBRow className="mb-5">
                        <SocialMediaForm
                          setBusinessLinks={setBusinessLinks}
                          businessLinks={businessLinks}
                          shopId={shopId}
                          setErrorMessage={setErrorMessage}
                          setError={setError}
                          socialMedia={socialMedia}
                          setSocialMedia={setSocialMedia}
                          socialPlatforms={socialPlatforms}
                          shopColor={shopColor}
                        />
                        <AddMenuForm
                          menuItems={menuItems}
                          setMenuItems={setMenuItems}
                          shopColor={shopColor}
                        />
                      </MDBRow>
                      <p
                        className="lead fw-normal mb-1"
                        style={{ color: shopColor }}
                      >
                        Menu
                      </p>
                      <div className=" d-flex justify-content-center align-items-center mb-2 ">
                        {menuItems.length > 0 && (
                          <ShopMenuList
                            menuItems={menuItems}
                            setIsFormVisible={setIsFormVisible}
                            setMenuId={setMenuId}
                            findMealsByCategoryId={findMealsByCategoryId}
                            buttonColors={buttonColors}
                            handleClick={handleClick}
                            setButtonColor={setButtonColors}
                            shopColor={shopColor}
                          />
                        )}
                      </div>
                      {isFormVisible && (
                        <MealForm
                          loading={loading}
                          menuItems={menuItems}
                          menuId={menuId}
                          setMenuId={setMenuId}
                          findMealsByCategoryId={findMealsByCategoryId}
                          setMealItems={setMealItems}
                          shopColor={shopColor}
                        />
                      )}
                      <div className=" d-flex justify-content-center align-items-center ">
                        {mealItems.length > 0 && (
                          <MealList
                            mealItems={mealItems}
                            menuId={menuId}
                            setErrorMessage={setErrorMessage}
                            setMealItems={setMealItems}
                          />
                        )}
                      </div>
                      <p
                        className="lead fw-normal mb-1 mt-3"
                        style={{ color: shopColor }}
                      >
                        Our Location
                      </p>
                      <MapBx
                        latitude={latitude}
                        longitude={longitude}
                        setErrorMessage={setErrorMessage}
                      />
                      {errorMessage && (
                        <div className="text-danger mb-3">{errorMessage}</div>
                      )}{" "}
                      {/* Display error message */}
                    </MDBCardBody>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      ) : (
        <Navigate to="/login" /> // Redirect to login if not authenticated
      )}
    </>
  );
};
