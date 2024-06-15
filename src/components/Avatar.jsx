import PropTypes from "prop-types";

const Avatar = ({ userImage, online }) => {
  return (
    <div className="w-8 h-8 rounded-full relative bg-gray-200">
      <div className="flex justify-center items-center text-center w-full h-full opacity-70">
        <img
          src={userImage}
          alt=""
          loading="lazy"
          className="rounded-full"
          style={{ content: "attr(alt)" }}
        />
      </div>
      {online && (
        <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
};
export default Avatar;

Avatar.propTypes = {
  userImage: PropTypes.node,
  online: PropTypes.bool.isRequired,
};
