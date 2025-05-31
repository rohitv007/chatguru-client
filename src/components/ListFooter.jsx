import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import useModal from '../hooks/useModal';
import Modal from './Modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shadcn_components/ui/dropdown-menu';
import { Camera, Loader2, Trash, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { defaultAvatar } from '../helpers/constants';
import Avatar from './Avatar';

const ListFooter = () => {
  const { user, logoutUser, updateUser } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const fileInputRef = useRef(null);

  const [formState, setFormState] = useState({
    username: '',
    avatarImage: null,
    previewImage: defaultAvatar,
    isDeletePending: false,
    isSubmitting: false
  });

  // Initialize form state when modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      setFormState((prev) => ({
        ...prev,
        username: user?.username || '',
        avatarImage: null,
        previewImage: user?.avatarImage || defaultAvatar,
        isDeletePending: false
      }));
    }
  }, [isOpen, user]);

  const handleLogout = async () => {
    try {
      const { data } = await api.get('/users/logout');
      if (data.success) {
        logoutUser();
      } else {
        throw new Error('Error while logging out');
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setFormState((prev) => ({
        ...prev,
        avatarImage: selectedFile,
        previewImage: fileReader.result
      }));
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const handleImageDelete = (e) => {
    e.preventDefault();
    setFormState((prev) => ({
      ...prev,
      avatarImage: null,
      previewImage: defaultAvatar,
      isDeletePending: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const formData = new FormData();
      formData.append('username', formState.username);

      if (formState.isDeletePending) {
        await api.patch('/users/profile-image');
      }

      if (formState.avatarImage) {
        formData.append('avatarImage', formState.avatarImage);
      }

      const { data } = await api.patch('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        updateUser(data.user);
        closeModal();
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  const renderProfileImage = () => (
    <div className="flex flex-col items-center mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative container w-24 h-24 rounded-full overflow-hidden cursor-pointer group bg-gray-200">
            <img
              src={formState.previewImage}
              loading="lazy"
              className="w-full h-full rounded-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-100"
              alt="profile"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <span className="text-white text-xs font-medium text-center px-2">
                Change Profile Picture
              </span>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-1">
          <DropdownMenuItem
            disabled={true}
            className="flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-150 ease-in-out text-gray-400 cursor-not-allowed"
          >
            <Camera className="mr-2 h-4 w-4" />
            <span>Take Photo</span>
            <span className="ml-auto text-xs text-gray-400">(Unavailable)</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-150 ease-in-out"
          >
            <Upload className="mr-2 h-4 w-4" />
            <span>Upload Picture</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-150 ease-in-out ${
              formState.previewImage === defaultAvatar
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-red-600 hover:bg-red-50 cursor-pointer'
            }`}
            disabled={formState.previewImage === defaultAvatar}
            onClick={handleImageDelete}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete Picture</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />
          <div className="px-3 py-2 text-xs text-gray-500">
            Recommended: Square image, at least 200x200px
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );

  return (
    <>
      <div className="w-full p-3.5 flex justify-between items-center border-t border-gray-300">
        <div
          className="flex items-center justify-start w-auto max-w-[200px] h-10 gap-x-1 cursor-pointer border-4 border-orange-400 rounded-full hover:bg-gray-200 pr-1"
          onClick={openModal}
        >
          <Avatar online={true} userImage={user.avatarImage} isGroup={false} />
          <span className="text-center font-bold self-center truncate">
            {user?.username}
          </span>
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-3 rounded ml-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={handleCancel} title="Edit Profile">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-4 bg-white"
        >
          {renderProfileImage()}
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className="border border-gray-300 focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out px-4 py-2 rounded-md"
            value={formState.username}
            onChange={handleChange}
            aria-label="Username"
            required
          />

          <div className="flex justify-end mt-4 gap-2">
            <button
              className="bg-gray-400 hover:bg-gray-300 text-white font-medium px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 ease-in-out"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="bg-orange-400 hover:bg-orange-300 text-white font-medium px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300 ease-in-out"
            >
              {formState.isSubmitting ? (
                <Loader2 className="animate-spin-fast" />
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </Modal>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            textAlign: 'center'
          }
        }}
      />
    </>
  );
};

export default ListFooter;
