import PropTypes from "prop-types";

const Container = ({ children }) => {
  return (
    <section className="container mx-auto lg:px-16 px-4">{children}</section>
  );
};

export default Container;

Container.propTypes = {
  children: PropTypes.node,
};
