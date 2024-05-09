import { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [userPayload, setUserPayload] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { authUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = JSON.stringify({ userPayload, password });
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const res = await axios.post(`/login`, body, { headers });
      // console.log(res);
      if (res.data.success) {
        // console.log("LOGIN DATA =>", res.data);
        authUser(res.data);

        // Reset form values
        setUserPayload("");
        setPassword("");
        setError("");
      }
    } catch (err) {
      // console.log(err);
      setIsSubmitting(false);
      if (err?.response?.data) {
        const errorMessage = err.response.data.message;
        setError(
          errorMessage ?? "Oops! Something went wrong. Please try again later"
        );
      }
    }
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center justify-center flex-col">
      <h1 className="mb-2 text-2xl">Login</h1>
      <form
        action="/login"
        method="POST"
        className="w-64 mx-auto"
        onSubmit={handleSubmit}
      >
        <input
          value={userPayload}
          onChange={(e) => setUserPayload(e.target.value)}
          type="text"
          placeholder="Username/Email"
          className="block w-full rounded-sm p-2 mb-2 border"
          id="userPayload"
          autoComplete="username"
          disabled={isSubmitting}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="block w-full rounded-sm p-2 mb-2 border"
          id="loginPassword"
          autoComplete="current-password"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 text-white block w-full rounded-sm mb-2 p-2"
          disabled={isSubmitting}
        >
          Login
        </button>
        <button
          type="button"
          className="bg-green-400 hover:bg-green-500 text-white block w-full rounded-sm mb-2 p-2"
          onClick={(e) => {
            e.preventDefault();
            setUserPayload("guest");
            setPassword("guest1234");
          }}
        >
          Get Guest User Credentials
        </button>
      </form>
      <p>
        Don&apos;t have an account?&nbsp;
        <Link className="text-orange-400" to="/register">
          Register
        </Link>
      </p>
      {error ? (
        <div>
          <h4 className="text-red-600">{error}</h4>
        </div>
      ) : null}
    </div>
  );
};

export default Login;
