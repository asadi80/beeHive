// UserShopsList.js
import React from "react";
import axios from "axios";
import Auth from "../utils/auth";
import { ToastContainer, toast } from "react-toastify";

import {
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBCardImage,
  MDBCard,
  MDBBtn,
  MDBRow,
  MDBIcon,
} from "mdb-react-ui-kit";
const baseUrl = process.env.REACT_APP_BASE_URL;

const MealList = ({ mealItems, setMealItems, setErrorMessage, menuId }) => {
  const deleteMeal = async (mealId) => {
    const token = Auth.getToken(); // Retrieve authentication token

    try {
      const response = await axios.delete(`${baseUrl}/delete-meal/${mealId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request headers
          Accept: "application/json",
        },
        data: { menuId }, // Pass menuId in the request body under `data`
      });

      if (response.data.message) {
        setErrorMessage(response.data.message);
      } else {
        console.log(response.data);

        toast.success("Meal deleted successfully !", {
          position: "top-center",
          autoClose: 2000,
        });
        setMealItems(mealItems.filter((meal) => meal.id !== mealId)); // Remove the deleted meal from the state
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="justify-content-center align-items-center h-100">
      <MDBRow className="row-cols-1 row-cols-md-2 g-4">
        {mealItems.map((item) => (
          <MDBCol key={item.id}>
            <MDBCard className="h-100">
              <MDBCardImage
                src={item.imageUrl}
                alt="..."
                position="top"
                style={{ width: " 100%", height: " 100%" }}
              />
              <MDBCardBody>
                <MDBCardTitle>{item.name}</MDBCardTitle>
                <MDBCardText>{item.ingredients}</MDBCardText>
                <MDBCardTitle>${item.price}</MDBCardTitle>

                <MDBBtn
                  color="secondary"
                  outline
                  floating
                  style={{ border: "none" }}
                >
                  <MDBIcon
                    far
                    icon="trash-alt"
                    size="2x"
                    style={{ color: "#fc0303" }}
                    onClick={() => deleteMeal(item.id)}
                  />
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
    </div>
  );
};

export default MealList;
