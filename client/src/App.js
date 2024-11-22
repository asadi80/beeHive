import './App.css'; // Importing the main CSS file
import { Login } from './Pages/Login'; // Importing the Login component
import { Signup } from './Pages/Signup'; // Importing the Signup component
import { MainPage } from './Pages/MainPage'; // Importing the MainPage component
import { Routes, Route } from "react-router-dom"; // Importing necessary components from react-router
import { Profile } from './Pages/Profile'; // Importing the Profile component
import "mapbox-gl/dist/mapbox-gl.css"; // Importing Mapbox styles
import { Dashboard } from './Pages/Dashboard';
import { ShopInfo } from './Pages/ShopInfo/ShopInfo';
import {ShopPublicInfo} from './Pages/ShopPublicInfo';

function App() {
  return (
    <div className="app-container"> {/* Added a class for styling the main container */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/shop-info/:id" element={<ShopInfo />} />
        <Route path="/shop-public-info/:id" element={<ShopPublicInfo />} />
      </Routes>
    </div>
  );
}

export default App;
