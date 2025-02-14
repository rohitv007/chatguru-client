import PropTypes from 'prop-types';

const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full my-4">
      <p className="text-center text-xl font-semibold">{message}</p>
    </div>
  );
};

export default EmptyState;

EmptyState.propTypes = {
  message: PropTypes.string.isRequired
};
