import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { UserContext } from '../contexts/UserContext';
import { useAuthControllerMeV1, type User } from '../api/api';
import { useRefreshToken } from '../hooks/useRefreshToken';
import { useLogout } from '../hooks/useLogout';

const ProtectedRoute = () => {
  const { user, setUser } = useContext(UserContext);
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: doRefreshToken } = useRefreshToken({
    onSuccess: () => {
      refetchUser();
    },
    onError: () => {
      logout();
      setIsLoading(false);
    },
  });

  // The main query to get the current user.
  const { refetch: refetchUser } = useAuthControllerMeV1({
    query: {
      enabled: false,
      retry: false,
    },
  });

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      return;
    }
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      logout();
      setIsLoading(false);
      return;
    }

    refetchUser()
      .then((queryResult) => {
        if (queryResult.isSuccess && queryResult.data) {
          setUser(queryResult.data as User);
          setIsLoading(false);
          return;
        }
        
        if (queryResult.isError) {
          const storedRefreshToken = localStorage.getItem('refreshToken');
          if (storedRefreshToken) {
            doRefreshToken({ data: { refreshToken: storedRefreshToken } });
            return;
          }
          
          logout();
          setIsLoading(false);
        }
      });
  }, []);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute; 