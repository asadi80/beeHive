import React, { useState } from "react";
import { MDBBtn, MDBInput, MDBTextArea } from "mdb-react-ui-kit";
import axios from "axios";
import Auth from "../utils/auth";
const baseUrl = process.env.REACT_APP_BASE_URL;

const MealForm = ({
  formErrors,
  errorMessage,
  menuId,
  setMealItems,
  shopColor,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [mealInfo, setMealInfo] = useState({
    name: "",
    price: "",
    ingredients: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    handleImageUpload(file);
  };

  const handleMealInputs = ({ target: { name, value } }) => {
    setMealInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleMealFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { name, price, ingredients } = mealInfo;
    const token = Auth.getToken();

    try {
      const response = await axios.post(
        `${baseUrl}/add-meal/${menuId}`,
        { name, price, ingredients, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setSelectedImage(null);
      setMealItems([]);
      setMealItems((prevMealItems) => [
        ...prevMealItems,
        ...response.data.meal,
      ]); // Add new meal to the list
      setMealInfo({ name: "", price: "", ingredients: "", imageUrl: "" }); // Clear form fields
      console.log("Meal has been created:", response.data.meal);
      setLoading(false);
    } catch (err) {
      setError("An error occurred while creating the meal");
      console.error("Error creating Menu", err);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "h2cour5m");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dnmmunlkd/image/upload/`,
        formData
      );
      // Add transformations to the secure URL (e.g., resize to 300x300)
      const transformedUrl = response.data.secure_url.replace(
        "/upload/",
        "/upload/w_300,h_300,c_fill/"
      );
      setImageUrl(response.data.secure_url);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <form onSubmit={handleMealFormSubmit} className="mt-4">
      <MDBInput
        wrapperClass="mb-3"
        label="Meal Name"
        type="text"
        name="name"
        value={mealInfo.name}
        onChange={handleMealInputs}
      />
      <MDBInput
        wrapperClass="mb-3"
        type="number"
        label="Price"
        name="price"
        value={mealInfo.price}
        onChange={handleMealInputs}
      />
      <MDBTextArea
        className="mb-3"
        label="Description
"
        id="textAreaExample"
        rows="4"
        name="ingredients"
        value={mealInfo.ingredients}
        onChange={handleMealInputs}
      />
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <div
        onClick={handleClick}
        style={{
          width: "300px",
          height: "300px",
          border: "2px dashed #ccc",
          borderRadius: "8px",
          cursor: "pointer",
          backgroundSize: "cover",
          backgroundImage: `url(${
            selectedImage || "https://via.placeholder.com/300"
          })`,
        }}
      >
        {!selectedImage && (
          <p style={{ textAlign: "center", paddingTop: "40%" }}>
            Click to upload an image
          </p>
        )}
      </div>
      <MDBBtn
        className="mb-4 mt-2"
        type="submit"
        block
        disabled={loading || !imageUrl}
        style={{ backgroundColor: shopColor }}
      >
        {loading ? "Adding Meal..." : "Add Meal"}
      </MDBBtn>
    </form>
  );
};

export default MealForm;
