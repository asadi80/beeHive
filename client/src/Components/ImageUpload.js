import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "h2cour5m");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dnmmunlkd/image/upload`,
        formData
      );
      // console.log(response.data.secure_url);
      
      setImageUrl(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file)); // Show a preview of the selected image
    handleImageUpload(file); // Upload the image to Cloudinary
  };

  const handleClick = () => {
    document.getElementById('fileInput').click(); // Trigger file input click
  };

  return (
    <div>
      
      <input
        id="fileInput"

        className="mt-4 mb-2 img-thumbnail"

        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the default input
      />
      <div
        onClick={handleClick}
        style={{
          width: '150px',
          height: '200px',
          border: '2px dashed #ccc',
          borderRadius: '3px',
          cursor: 'pointer',
          zIndex: "1",
          backgroundSize: 'cover',
          backgroundImage: `url(${selectedImage || "https://via.placeholder.com/300"})`
        }}
      >
        {!selectedImage && <p style={{ textAlign: 'center', paddingTop: '40%' }}>Click to upload an image</p>}
      </div>
      {/* {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ width: '300px', borderRadius: '8px' }} />
        </div>
      )} */}
    </div>
  );
};

export default ImageUpload;
