// UserShopsList.js
import React from "react";
import {
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBCardImage,
  MDBCard,
  MDBRow,
} from "mdb-react-ui-kit";

const MealList = ({ mealItems }) => {
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
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
    </div>
  );
};

export default MealList;
