import { Button, Typography, Space, Card } from 'antd';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useLogout } from '../hooks/useLogout';

const { Title, Text } = Typography;

const WelcomePage = () => {
  const { user } = useContext(UserContext);
  const logout = useLogout();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Space direction="vertical" size="large">
          <Title level={2}>Welcome, {user?.username || 'User'}!</Title>
          <Text>You have successfully signed in.</Text>
          <Button type="primary" onClick={logout} block>
            Sign Out
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default WelcomePage; 