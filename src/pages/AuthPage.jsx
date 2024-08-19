import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../shadcn_components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../shadcn_components/ui/tabs';
import axios from 'axios';

const AuthPage = () => {
  // register form data
  const [registerFormData, setRegisterFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [regError, setRegError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);

  // login form data
  const [loginFormData, setLoginFormData] = useState({
    userInput: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  const { loginUser } = useAuth();

  const handleRegisterForm = (e) => {
    const { name, value } = e.target;

    setRegisterFormData({
      ...registerFormData,
      [name]: value,
    });
  };

  const handleLoginForm = (e) => {
    const { name, value } = e.target;

    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegSubmitting(true);

    const body = { ...registerFormData };
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const res = await axios.post(`/user/register`, body, { headers });
      // console.log(res);
      if (res.data.success) {
        setSuccessMessage(res.data.message);
      }
    } catch (err) {
      // console.log(err);
      setIsRegSubmitting(false);
      if (err?.response?.data) {
        const errorMessage = err.response.data.message;
        setRegError(
          errorMessage ?? 'Oops! Something went wrong. Please try again later',
        );
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginSubmitting(true);

    const body = { ...loginFormData };
    try {
      await Promise.resolve(loginUser(body));

      // Reset form
      setLoginFormData({
        userInput: '',
        password: '',
      });
    } catch (error) {
      // console.log(error);
      setLoginError(
        error?.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  return (
    <div className="bg-white h-screen flex items-center justify-center flex-col text-center overflow-auto custom-scrollbar">
      <Tabs className="w-[400px]" defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            className="data-[state=active]:bg-orange-400 data-[state=active]:text-white"
            value="login"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-orange-400 data-[state=active]:text-white"
            value="register"
          >
            Create Account
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader className="py-4 px-2">
              <CardTitle>Login</CardTitle>
              {/* <CardDescription>
                Login below to dive into Chat Guru 👨‍🏫
              </CardDescription> */}
            </CardHeader>
            <CardContent className="py-4 px-2 pb-1">
              <form
                method="POST"
                className="w-[280px] mx-auto"
                onSubmit={handleLogin}
              >
                <input
                  id="userInput"
                  name="userInput"
                  type="text"
                  placeholder="Username/Email"
                  value={loginFormData.userInput}
                  onChange={handleLoginForm}
                  className="block w-full rounded-sm p-2 mb-1 border"
                  autoComplete="username"
                  disabled={isLoginSubmitting}
                  required
                />
                <input
                  id="loginPassword"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={loginFormData.password}
                  onChange={handleLoginForm}
                  className="block w-full rounded-sm p-2 mb-6 border"
                  autoComplete="current-password"
                  disabled={isLoginSubmitting}
                  required
                />
                <button
                  className="bg-orange-400 hover:bg-orange-500 text-white block mx-auto rounded-sm mb-1 p-2 w-[90%]"
                  disabled={isLoginSubmitting}
                  type="submit"
                >
                  Login
                </button>
                <button
                  type="button"
                  className="bg-green-400 hover:bg-green-500 text-white block mx-auto rounded-sm p-2 w-[90%]"
                  onClick={() => {
                    setLoginFormData({
                      userInput: 'guest',
                      password: 'guest1234',
                    });
                  }}
                >
                  Get Guest Credentials
                </button>
              </form>
              {loginError ? (
                <div>
                  <h4 className="text-red-600">{loginError}</h4>
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="justify-center py-4 px-2 pt-1">
              <p className="text-sm font-medium">Forgot Password?</p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader className="py-4 px-2">
              <CardTitle>Create Account</CardTitle>
              {/* <CardDescription>
                Create personal account below to get started
              </CardDescription> */}
            </CardHeader>
            <CardContent className="py-4 px-2 pb-1">
              <form
                method="POST"
                className="w-[280px] mx-auto"
                onSubmit={handleRegister}
              >
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={registerFormData.username}
                  onChange={handleRegisterForm}
                  className="block w-full rounded-sm p-2 mb-1 border"
                  autoComplete="username"
                  disabled={isRegSubmitting}
                  required
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={registerFormData.email}
                  onChange={handleRegisterForm}
                  className="block w-full rounded-sm p-2 mb-1 border"
                  autoComplete="email"
                  disabled={isRegSubmitting}
                  required
                />
                <input
                  id="registerPassword"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={registerFormData.password}
                  onChange={handleRegisterForm}
                  className="block w-full rounded-sm p-2 mb-6 border"
                  autoComplete="new-password"
                  disabled={isRegSubmitting}
                  required
                />
                <button
                  className="bg-orange-400 hover:bg-orange-500 text-white block mx-auto rounded-sm p-2 w-[90%]"
                  disabled={isRegSubmitting}
                  type="submit"
                >
                  Register
                </button>
              </form>
              {successMessage ? (
                <div>
                  <h4 className="text-green-600">
                    {successMessage} Please login to experience Chat Guru 👨‍🏫
                  </h4>
                </div>
              ) : null}
              {regError ? (
                <div>
                  <h4 className="text-red-600">{regError}</h4>
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="justify-center py-4 px-2 pt-1">
              <p className="text-sm font-medium">
                Already have an account? Go to{' '}
                <Link to="/" className="text-blue-500">
                  Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;
