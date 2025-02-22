import { useState, useEffect } from 'react';
import { AppLocalStorage } from '@/config';
import { User } from '@/types';

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const checkUser = async () => {
    try {
      const userData = await AppLocalStorage.get('user');
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsCheckingUser(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return { user, isCheckingUser };
};

export default useUser;
