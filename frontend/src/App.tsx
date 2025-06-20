import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Layout } from 'antd';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import WelcomePage from './pages/WelcomePage';
import ProtectedRoute from './auth/ProtectedRoute';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '50px' }}>
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/welcome" element={<WelcomePage />} />
            </Route>

            <Route path="/" element={<Navigate to="/welcome" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
