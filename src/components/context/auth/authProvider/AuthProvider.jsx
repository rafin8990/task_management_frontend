import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOutUser = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:5000/api/v1/auth/signout", {
        method: "POST",
        credentials: "include", 
      });
      Cookies.remove("accessToken"); // Remove token from cookies
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("accessToken"); // Get token from cookies
      if (token) {
        try {
          const decodedUser = jwtDecode(token); // Decode token
          setUser(decodedUser);
        } catch (error) {
          console.error("Error decoding token:", error);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node,
};
