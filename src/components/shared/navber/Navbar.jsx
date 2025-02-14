import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/logo.png";
import Container from "../container/Container";
import { useContext } from "react";
import { AuthContext } from "../../context/auth/authProvider/AuthProvider";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  return (
    <Container>
      <div className="grid grid-cols-7 items-center justify-between   py-6">
        {/* logo  */}
        <div className="flex items-center justify-start col-span-2">
          <img src={logo} className="h-12" alt="" />
          <h1 className="ms-3">
            <p className="text-3xl font-light">Endeavor Align</p>
            {/* <p className="-mt-1">Management Software</p> */}
          </h1>
        </div>
        {/* routes  */}
        <nav className="grow flex items-center justify-center col-span-3">
          <ul className="flex">
            <li>
              <NavLink className={"px-3 py-2 "} to={"/"}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={"px-3 py-2 "} to={"/"}>
                Pricing
              </NavLink>
            </li>
            <li>
              <NavLink className={"px-3 py-2 "} to={"/"}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink className={"px-3 py-2 "} to={"/"}>
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* buttons */}
        <div className="flex items-center justify-end gap-3 col-span-2">
          <Link
            className={`hover:font-semibold ${
              user ? "hidden" : "inline-block"
            }`}
            to={"/register"}
          >
            Sign Up
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
