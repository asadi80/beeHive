import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";

const ShopMenuList = ({ menuItems, setIsFormVisible, setMenuId, findMealsByCategoryId, buttonColors, handleClick,  setButtonColors, shopColor}) => {
  return (
    <div className="justify-content-center align-items-center h-100">
      {menuItems.map((item) => (
        <MDBBtn
        color='white'
          key={item.id}
          className="m-2"
          size="lg"
          style={{ backgroundColor: buttonColors[item.id]? shopColor :"white", fontSize: "1.2em"}} // Use the dynamic color for this specific button
          onClick={() => {
            setIsFormVisible((prev) => !prev); // Toggle the form visibility
            setMenuId(item.id); // Set the selected menu ID
            findMealsByCategoryId(item.id); // Fetch meals based on the category
            handleClick(item.id); // Toggle color for the clicked button
           
          }}
        >
          {item.category}
        </MDBBtn>
      ))}
    </div>
  );
};

export default ShopMenuList;
