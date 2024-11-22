// UserShopsList.js
import React from "react";
import {
  MDBBtn,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";

const UserShopsList = ({ userShops, navigateTo, deleteShop }) => {
  let row =0;
  return (
    <div>
      <h2>Your Shops</h2>
      <MDBTable>
        <MDBTableHead light>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Shop name</th>
            <th scope="col">Delete</th>
          </tr>
        </MDBTableHead>

        {userShops.map((shop) => (
          <MDBTableBody key={shop.id}>
            <tr>
              <th scope="row">{row+=1}</th>
              <td>
                {" "}
                <MDBBtn color="secondary" outline style={{ border: "none" }}  onClick={() => navigateTo(shop.id)}>
                  {shop.name}
                </MDBBtn>
              </td>
              <td>
                {" "}
                <MDBBtn color="secondary" outline floating style={{ border: "none" }}>
                  <MDBIcon
                    far
                    icon="trash-alt"
                    size="2x"
                    style={{ color: "#fc0303" }}
                    onClick={() => deleteShop(shop.id)}
                  />
                </MDBBtn>
              </td>
            </tr>
          </MDBTableBody>
        ))}
      </MDBTable>
    </div>
  );
};

export default UserShopsList;
