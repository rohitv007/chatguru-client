import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-slate-50 p-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 transition-colors"
      >
        Go to Home Page
      </Link>
    </div>
  );
};

export default NotFound;
