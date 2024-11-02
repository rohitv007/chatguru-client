import PropTypes from 'prop-types';
import { defaultAvatar, groupImage } from '../helpers/constants';

const Avatar = ({ userImage, online, isGroup }) => {
  const imageSrc = isGroup ? groupImage : userImage || defaultAvatar;

  return (
    <div className="rounded-full relative bg-gray-200">
      <div className="flex w-8 h-8 rounded-full">
        <img
          src={imageSrc}
          alt="avatar"
          loading="lazy"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      {!isGroup && (
        <>
          {online ? (
            <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full"></div>
          ) : (
            <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full"></div>
          )}
        </>
      )}
    </div>
  );
};
export default Avatar;

Avatar.propTypes = {
  userImage: PropTypes.string,
  online: PropTypes.bool,
  isGroup: PropTypes.bool
};
