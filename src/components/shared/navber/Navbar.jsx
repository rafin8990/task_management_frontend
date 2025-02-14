import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import Container from "../container/Container";
import { useContext } from "react";
import { AuthContext } from "../../context/auth/authProvider/AuthProvider";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  return (
    <Container>
      <div className="flex items-center justify-between   py-6">
        <div className="flex items-center justify-start col-span-2">
          <img src={logo} className="h-12" alt="" />
        </div>
        <div className="flex items-center justify-end gap-3 col-span-2">
          <Link
            className={`hover:font-semibold ${
              user ? "hidden" : "inline-block"
            }`}
            to={"/login"}
          >
            Login
          </Link>
          <div
            className={`h-7 w-0.5 bg-black rotate-6  ${
              user ? "hidden" : "inline-block"
            }`}
          ></div>
          <Link className="hover:font-semibold" to={"/dashboard"}>
            Get Started
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Navbar;
