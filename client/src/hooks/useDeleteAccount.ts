import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import axios from 'axios';
import { authState } from '../store/auth';
import { serversAtom, serverDetailsAtom, pingHistoryAtom, selectedDaysAtom } from '../store/serverAtoms';

const useDeleteAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const resetAuth = useResetRecoilState(authState);
  const resetServers = useResetRecoilState(serversAtom);
  const resetServerDetails = useResetRecoilState(serverDetailsAtom);
  const resetPingHistory = useResetRecoilState(pingHistoryAtom);
  const resetSelectedDays = useResetRecoilState(selectedDaysAtom);

  const deleteAccount = async (onSuccess?: () => void) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/delete-account`, {
        headers: {
          "x-auth-token": token,
        },
      });

      // Clear all local storage and state
      localStorage.removeItem('token');
      resetAuth();
      resetServers();
      resetServerDetails();
      resetPingHistory();
      resetSelectedDays();

      // Call success callback if provided
      onSuccess?.();

      // Navigate to home page
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete account');
      } else {
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { deleteAccount, loading, error, setError };
};

export default useDeleteAccount;
