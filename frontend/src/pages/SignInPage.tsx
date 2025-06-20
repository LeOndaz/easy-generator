import { Button, Form, Input, Card } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { type SignInDto } from '../api/api';
import { useLogin } from '../hooks/useLogin';

const SignInPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin({
    onSuccess: () => {
      navigate('/');
    },
  });

  const onFinish = (values: SignInDto) => {
    login({ data: values });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Card title="Sign In" style={{ width: 400 }}>
        <Form
          name="signin"
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending} block>
              Sign In
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            Don't have an account? <Link to="/signup">Sign up now!</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignInPage;
