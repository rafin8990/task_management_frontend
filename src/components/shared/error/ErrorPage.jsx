import { Link } from "react-router-dom";
import notFoundImage from "../../../assets/illustration/not-found.png";
import { IoIosArrowRoundBack } from "react-icons/io";

const ErrorPage = () => {
  return (
    <section className="h-screen flex justify-center items-center text-white mx-auto text-center -mt-10">
      <div className="">
        <p className="text-center text-2xl mb-16 text-black">
          404 - Page Not Found
        </p>
        <img src={notFoundImage} className="h-96" alt="" />

        <Link
          className="rounded-none px-8 py-4 bg-black button-primary  w-60"
          to={"/"}
        >
          <button className=" text-sm space-x-2">
            <IoIosArrowRoundBack className="inline text-xl" />
            <span>Let&#39;s Back to Home</span>
          </button>
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
