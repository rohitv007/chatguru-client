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
  // register state variables
  const [username, setUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [email, setEmail] = useState('');
  const [regError, setRegError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);

  // login state variables
  const [userPayload, setUserPayload] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  const { loginUser } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegSubmitting(true);

    const body = JSON.stringify({ username, email, regPassword });
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const res = await axios.post(`/user/register`, body, { headers });
      // console.log(res);
      if (res.data.success) {
        // console.log("REGISTER DATA =>", res.data);
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

    const body = { userPayload, loginPassword };

    try {
      loginUser(body).then(() => {
        // Reset form values
        setUserPayload('');
        setLoginPassword('');
        setLoginError('');
      });
    } catch (err) {
      // console.log(err);
      setIsLoginSubmitting(false);
      if (err?.response?.data) {
        console.log(err);
        const errorMessage = err.response.data.message;
        setLoginError(
          errorMessage ?? 'Oops! Something went wrong. Please try again later',
        );
      }
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
                action="/register"
                method="POST"
                className="w-[280px] mx-auto"
                onSubmit={handleRegister}
              >
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Username"
                  className="block w-full rounded-sm p-2 mb-1 border"
                  id="username"
                  autoComplete="username"
                  disabled={isRegSubmitting}
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="block w-full rounded-sm p-2 mb-1 border"
                  id="email"
                  autoComplete="email"
                  disabled={isRegSubmitting}
                />
                <input
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="block w-full rounded-sm p-2 mb-6 border"
                  id="registerPassword"
                  autoComplete="new-password"
                  disabled={isRegSubmitting}
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
        <TabsContent value="login">
          <Card>
            <CardHeader className="py-4 px-2">
              <CardTitle>Login</CardTitle>
              {/* <CardDescription>
                below to dive into Chat Guru 👨‍🏫
              </CardDescription> */}
            </CardHeader>
            <CardContent className="py-4 px-2 pb-1">
              <form
                action="/login"
                method="POST"
                className="w-[280px] mx-auto"
                onSubmit={handleLogin}
              >
                <input
                  value={userPayload}
                  onChange={(e) => setUserPayload(e.target.value)}
                  type="text"
                  placeholder="Username/Email"
                  className="block w-full rounded-sm p-2 mb-1 border"
                  id="userPayload"
                  autoComplete="username"
                  disabled={isLoginSubmitting}
                />
                <input
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="block w-full rounded-sm p-2 mb-6 border"
                  id="loginPassword"
                  autoComplete="current-password"
                  disabled={isLoginSubmitting}
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
                  onClick={(e) => {
                    e.preventDefault();
                    setUserPayload('guest');
                    setLoginPassword('guest1234');
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
      </Tabs>
    </div>
  );
};

export default AuthPage;
