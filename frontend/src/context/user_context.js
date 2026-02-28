import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../utils/init-firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { upload_url, default_profile_image, user_profile_url, wishlist_toggle_url } from '../utils/constants';
import axios from 'axios';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mongoProfile, setMongoProfile] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logoutUser = () => {
    return signOut(auth);
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
    });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const resetPassword = (oobCode, newPassword) => {
    return confirmPasswordReset(auth, oobCode, newPassword);
  };

  const updateUserProfileImage = async (imageURL) => {
    return updateProfile(currentUser, {
      photoURL: imageURL,
    });
  };

  const updateUserProfileName = async (name) => {
    return updateProfile(currentUser, {
      displayName: name,
    });
  };

  const reauthenticateUser = async (existingPassword) => {
    const credentials = EmailAuthProvider.credential(
      currentUser.email,
      existingPassword
    );
    return reauthenticateWithCredential(currentUser, credentials);
  };

  const updateUserProfilePassword = async (newPassword) => {
    return updatePassword(currentUser, newPassword);
  };

  const uploadProfileImage = async (image) => {
    try {
      const response = await axios.post(upload_url, { image });
      const { success, data } = response.data;
      return { success, data };
    } catch (error) {
      const { message } = error.response?.data || {};
      return {
        success: false,
        message: message || 'Upload failed'
      };
    }
  };

  const fetchMongoProfile = async (user) => {
    try {
      const { data } = await axios.get(`${user_profile_url}?userId=${user.uid}&email=${user.email}`);
      if (data.success) {
        setMongoProfile(data.data);
        setWishlist(data.data.wishlist || []);
      }
    } catch (error) {
      console.error('Error fetching mongo profile:', error);
    }
  };

  const toggleWishlistItem = async (productId) => {
    if (!currentUser) return { success: false, message: 'Please login to add to wishlist' };
    try {
      const { data } = await axios.post(wishlist_toggle_url, {
        userId: currentUser.uid,
        productId,
        email: currentUser.email
      });
      if (data.success) {
        setWishlist(data.wishlist);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: 'Failed to update wishlist' };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchMongoProfile(user);
      } else {
        setMongoProfile(null);
        setWishlist([]);
      }
      setUserLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    if (!currentUser.photoURL) {
      updateUserProfileImage(default_profile_image)
        .then(() => setCurrentUser(currentUser))
        .catch(() => {
          // Error handled silently
        });
    }
    // eslint-disable-next-line
  }, [currentUser]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
        signInWithGoogle,
        forgotPassword,
        resetPassword,
        updateUserProfileImage,
        updateUserProfileName,
        uploadProfileImage,
        updateUserProfilePassword,
        reauthenticateUser,
        wishlist,
        toggleWishlistItem,
        mongoProfile,
        userLoading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
// make sure use
export const useUserContext = () => {
  return useContext(UserContext);
};
