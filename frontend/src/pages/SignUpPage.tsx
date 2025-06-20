import { Button, Form, Input, Card } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { type SignUpDto } from '../api/api';
import { useSignUp } from '../hooks/useSignUp';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { mutate: signUp, isPending } = useSignUp({
    onSuccess: () => {
      navigate('/');
    },
  });

  const onFinish = (values: SignUpDto) => {
    signUp({ data: values });
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
      <Card title="Sign Up" style={{ width: 400 }}>
        <Form
          name="signup"
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
            rules={[
              { required: true, message: 'Please input your password!' },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                message:
                  'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending} block>
              Sign Up
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            Already have an account? <Link to="/signin">Sign in</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignUpPage;
