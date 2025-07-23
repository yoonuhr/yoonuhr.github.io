import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import LoginForm from '../components/features/LoginForm';

const LoginPage = () => {

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-purdue-gold hover:text-yellow-600">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="px-4 py-8 sm:px-10">
            <LoginForm />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;