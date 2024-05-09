import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="grid place-content-center h-screen text-center">
      <h1 className="text-3xl">404 Not Found</h1>
      <p>The page you are looking for could not be found.</p>
      <Link className="bg-green-300" to="/">Go to Home Page</Link>
    </div>
  );
};

export default NotFound;