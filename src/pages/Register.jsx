import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = JSON.stringify({ username, email, password });
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const res = await axios.post(`/register`, body, { headers });
      // console.log(res);
      if (res.data.success) {
        // console.log("REGISTER DATA =>", res.data);
        setSuccessMessage(res.data.message);

        const timer = setInterval(() => {
          setCountdown((prevSeconds) => {
            if (prevSeconds === 0) {
              clearInterval(timer);
            }
            return prevSeconds - 1;
          });
        }, 1000);

        // redirect to login after success
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/login");
        }, 5000);

        return () => clearInterval(timer);
      }
    } catch (err) {
      // console.log(err);
      setIsSubmitting(false);
      if (err?.response?.data) {
        const errorMessage = err.response.data.message;
        setError(errorMessage ?? "Oops! Something went wrong. Please try again later");
      }
    }
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center justify-center flex-col">
      <h1 className="mb-2 text-2xl">Create New Account</h1>
      <form
        action="/register"
        method="POST"
        className="w-64 mx-auto"
        onSubmit={handleSubmit}
      >
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
          className="block w-full rounded-sm p-2 mb-2 border"
          id="username"
          autoComplete="username"
          disabled={isSubmitting}
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
          className="block w-full rounded-sm p-2 mb-2 border"
          id="email"
          autoComplete="email"
          disabled={isSubmitting}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="block w-full rounded-sm p-2 mb-2 border"
          id="registerPassword"
          autoComplete="new-password"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 text-white block w-full rounded-sm mb-2 p-2"
          disabled={isSubmitting}
        >
          Register
        </button>
      </form>
      <p>
        Already have an account?&nbsp;
        <Link className="text-orange-400" to="/login">
          Login
        </Link>
      </p>
      {successMessage ? (
        <div>
          <h4 className="text-green-600">
            {successMessage} Redirecting to login page in {countdown} second
            {countdown !== 1 ? "s" : ""}...
          </h4>
        </div>
      ) : null}
      {error ? (
        <div>
          <h4 className="text-red-600">{error}</h4>
        </div>
      ) : null}
    </div>
  );
};

export default Register;
