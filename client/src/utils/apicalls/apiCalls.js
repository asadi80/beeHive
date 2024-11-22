import axios from "axios";
import Auth from "../auth"; // Import authentication utility

// Base URL for the API
const baseUrl = process.env.REACT_APP_BASE_URL;

// API endpoint constants
const addtoolbox = "addtoolbox";
const add_drawer = "addrawer";
const addtool = "addtool";
const addset = "addset";
const updateToolBox = "updateToolBox";
const updatetoolstatus = "updatetoolstatus";
const updatesetstatus = "updatesetstatus";
const updatepm = "updatepm";
const removeUpdatefromToolBox = "removeUpdatefromToolBox";
const newpm = "newpm";

// Retrieve token for authentication
const token = Auth.getToken();

class apiCalls {
  //-------------------- Add Tool Box ----------------------------------------
  getShopInfo = async (shopId) => {
    try {
      const res = await axios.get(
        [baseUrl, "shop-info", shopId].join("/"),

        {
          headers: {
            Authorization: `Bearer ${token}`, // Set authorization header
            Accept: "application/json", // Accept JSON response
          },
        }
      );
      // console.log(res.data); // Log response data
      return res.data;
    } catch (err) {
      console.log(err); // Log errors
    }
  };

  //-------------------- Add Tool Box ----------------------------------------
  getShopInfoPublic = async (shopId) => {
    try {
      const res = await axios.get(
        `${baseUrl}/shopinfopublic`, // Using query parameter
        { params: { shopId } } // Send organizationId as query parameter
      );
      // console.log(res.data); // Log response data
      return res.data;
    } catch (err) {
      console.log(err); // Log errors
    }
  };
  //-------------------- Add Tool Box ----------------------------------------
  addToolBox = async (toolBoxInfo) => {
    try {
      const res = await axios.post(
        [baseUrl, addtoolbox].join("/"),
        {
          number: toolBoxInfo.number,
          location: toolBoxInfo.location,
          owner: toolBoxInfo.owner,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set authorization header
            Accept: "application/json", // Accept JSON response
          },
        }
      );
      console.log(res.data); // Log response data
    } catch (err) {
      console.log(err); // Log errors
    }
  };

  //-------------------- Add Drawer ----------------------------------------
  addDrawer = async (drawerNumber, toolboxId) => {
    try {
      const res = await axios.post(
        [baseUrl, add_drawer, toolboxId].join("/"),
        { number: drawerNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //-------------------- Add Tool ----------------------------------------
  addTool = async (drawerId, toolInfo) => {
    try {
      const res = await axios.post(
        [baseUrl, addtool, drawerId].join("/"),
        {
          description: toolInfo.description,
          size: toolInfo.size,
          status: "available", // Set default status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //-------------------- Update Tool Status ----------------------------------------
  updateToolStatus = async (toolId, toolStatus) => {
    try {
      const res = await axios.put(
        [baseUrl, updatetoolstatus, toolId].join("/"),
        {
          status: toolStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //-------------------- Add Set ----------------------------------------
  addSet = async (drawerId, setInfo) => {
    try {
      const res = await axios.post(
        [baseUrl, addset, drawerId].join("/"),
        {
          title: setInfo.title,
          status: "available", // Set default status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //-------------------- Update Set Status ----------------------------------------
  updateSetStatus = async (setId, setStatus) => {
    try {
      const res = await axios.put(
        [baseUrl, updatesetstatus, setId].join("/"),
        {
          status: setStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //-------------------- Update Tool Box ----------------------------------------
  updateToolBox = async (toolBoxId, toolInfo, toolStatus) => {
    try {
      const res = await axios.put(
        [baseUrl, updateToolBox, toolBoxId].join("/"),
        {
          status: toolStatus,
          toolSize: toolInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //-------------------- Remove Update from Tool Box ----------------------------------------
  removeExtraMissingToolBox = async (toolBoxId, size, status) => {
    try {
      const res = await axios.put(
        [baseUrl, removeUpdatefromToolBox, toolBoxId].join("/"),
        {
          status: status,
          size: size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //-------------------- Create New PM ----------------------------------------
  newPM = async (name, pmInfo) => {
    try {
      const res = await axios.post(
        [baseUrl, newpm].join("/"),
        {
          name: name,
          toolId: pmInfo.toolId,
          toolBoxNo: pmInfo.toolBoxNo,
          note: pmInfo.note,
          status: "open", // Set default status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //-------------------- Update PM ----------------------------------------
  updatePM = async (pmId, note) => {
    try {
      const res = await axios.put(
        [baseUrl, updatepm, pmId].join("/"),
        {
          status: "closed", // Update status to closed
          note: note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data);
      window.location.assign(`/allpms`); // Redirect after update
    } catch (err) {
      console.log(err);
    }
  };
}

// Export a new instance of the apiCalls class
export default new apiCalls();
