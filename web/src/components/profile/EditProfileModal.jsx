import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Modal from '../../shared/components/ui/Modal';
import Input from '../../shared/components/ui/Input';
import Button from '../../shared/components/ui/Button';
import { useUpdateUserProfileMutation } from '../../features/users/usersApiSlice';
import { handleErrorToast2, handleSuccessToast2 } from '../../utils/toasts';

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdate,
}) {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    interests: [],
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        phone: currentUser.phone || '',
        location: currentUser.location || '',
        dateOfBirth: currentUser.dateOfBirth 
          ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] 
          : '',
        interests: currentUser.interests || [],
      });
    }
  }, [currentUser]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updateData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        bio: formData.bio.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
      };

      const result = await updateUserProfile({
        userId: authUser._id,
        ...updateData,
      }).unwrap();

      handleSuccessToast2('Profile updated successfully!');
      
      // Call the callback to refresh parent component data
      if (onProfileUpdate) {
        onProfileUpdate(result.user || result);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      handleErrorToast2(
        error?.data?.message || error?.message || 'Failed to update profile. Please try again.'
      );
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!currentUser) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={errors.name}
            required
          />

          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            error={errors.username}
            required
            help="This will be visible to other users"
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1234567890"
            error={errors.phone}
            help="Optional - for contact purposes"
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
            error={errors.location}
          />

          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />

          <div className="md:col-span-2">
            <Input
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              multiline
              rows={3}
              help="Optional - Share something about yourself (max 500 characters)"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isUpdating}
            className={isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isUpdating ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}