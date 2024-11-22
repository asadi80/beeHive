import React from "react";
import { MDBBtn, MDBInputGroup } from "mdb-react-ui-kit"; // Import UI components from MDB
import Auth from "../utils/auth";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL; // Base URL from environment variables

const SocialMediaForm = ({
  socialPlatforms,
  setBusinessLinks,
  businessLinks,
  shopId,
  setErrorMessage,
  setError,
  socialMedia,
  setSocialMedia,
  shopColor
}) => {
  // Handle input changes in the form
  const handleInputChange = ({ target: { name, value } }) => {
    setErrorMessage(""); // Clear error message
    setBusinessLinks((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  // Generalized handle link submission
  const handleLinkSubmit = async (platform) => {
    const token = Auth.getToken();
    const linkData = { [platform]: businessLinks[platform] };

    try {
      const response = await axios.put(
        `${baseUrl}/add-link/${shopId}`,
        linkData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response && response.data) {
        const { facebook, instagram, x } = response.data; // Destructure from response.data

        setSocialMedia({
          ...socialMedia, // Spread the existing socialMedia object
          facebook, // Update facebook, instagram, and x values
          instagram,
          x,
        });

        console.log(response);
      }
    } catch (err) {
      setError(`An error occurred while adding the ${platform} link.`);
      console.error(err);
    }
  };

  return (
    <>
      {socialPlatforms.map((platform) => (
        <MDBInputGroup className="mb-3" key={platform}>
          <input
            className="form-control"
            placeholder={`https://www.${platform}.com/user-account`}
            type="url"
            name={platform}
            value={businessLinks[platform]}
            onChange={handleInputChange}
          />
          <MDBBtn
            outline
            style={{ borderColor: shopColor }}
            onClick={() => handleLinkSubmit(platform)}
            disabled={
              !businessLinks[platform] ||
              businessLinks[platform] === socialMedia.platform
            }
          >
            +
          </MDBBtn>
        </MDBInputGroup>
      ))}
    </>
  );
};

export default SocialMediaForm;
