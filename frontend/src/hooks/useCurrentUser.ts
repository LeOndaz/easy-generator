import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export const useCurrentUser = () => {
  const { user } = useContext(UserContext);
  return { user };
};
