import { jwtDecode } from "jwt-decode";

class AuthService {
  // retrieve data saved in token
  getProfile() {
    return this.decodeToken(this.getToken());
  }

  // check if the user is still logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // check if the token has expired
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.exp < Date.now() / 1000 : true;
  }

  // decode token safely
  decodeToken(token) {
    try {
      return jwtDecode(token);
    } catch (err) {
      return null;
    }
  }

  // retrieve token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  getUserId() {
    const decoded = this.decodeToken(this.getToken());
    return decoded ? decoded.userId : null; // Return userId or null
  }

  // set token to localStorage and redirect to main page
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.replace('/main-page'); // Use replace for better UX
  }

  // set token to localStorage and redirect to main page
  signup(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.replace('/main-page');
  }

  // clear token from localStorage and force logout
  logout() {
    localStorage.removeItem('id_token');
    window.location.replace('/login'); // Ensure reload happens on logout
  }

  
}

export default new AuthService();
