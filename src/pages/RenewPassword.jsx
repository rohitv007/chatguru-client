import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent
} from '../../shadcn_components/ui/card';
import { LoaderCircle } from 'lucide-react';

const RenewPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Redirect if no token
  if (!token) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (!formData.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post('/users/reset-password', {
        token,
        newPassword: formData.newPassword
      });

      if (data.success) {
        toast.success(`${data.message} Redirecting to login page...`, {
          duration: 3000
        });

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to reset password. Please try again later';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
        <Card className="w-full max-w-md p-6 bg-white shadow-lg">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <LoaderCircle className="w-5 h-5 animate-spin mx-auto text-white" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </CardContent>

          <CardFooter className="text-center text-sm text-gray-600">
            Remember your password?&nbsp;
            <button
              onClick={() => navigate('/login')}
              className="text-orange-500 hover:text-orange-600"
            >
              Login here
            </button>
          </CardFooter>
        </Card>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              textAlign: 'center'
            }
          }}
        />
      </div>
    </>
  );
};

export default RenewPassword;
