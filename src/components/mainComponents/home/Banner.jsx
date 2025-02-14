import Container from "../../shared/container/Container";
import blackLogo from "../../../assets/banner-black-logo.png";

const Banner = () => {
  return (
    <div className="border-b-2 border-black">
      <Container>
        <div className="relative h-[87vh] flex flex-col items-center justify-center ">
          {/* Banner content  */}
          <div className="pb-16">
            <h2 className="text-7xl w-10/12 text-center mx-auto py-16">
              Experience Seamless Task Management with Endeavor Align
            </h2>
            <div className="flex items-center justify-center">
              <div className="space-x-7">
                <button className="text-center mx-auto  input-primary px-8 py-3.5 bg-white border-2 border-dark ">
                  Sign Up
                </button>
                <button className="text-center mx-auto  button-primary px-8 py-3.5 bg-dark text-white border-2 border-dark">
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
          <img
            className="absolute bottom-0 -left-[54rem]  w-8/12"
            src={blackLogo}
            alt=""
          />
          <img
            className="absolute bottom-0 -right-[54rem] w-8/12"
            style={{ transform: "scaleX(-1)" }}
            src={blackLogo}
            alt=""
          />
        </div>
      </Container>
    </div>
  );
};

export default Banner;
