import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { googleLogin, login } from "@/services";
import { message } from 'antd';
import { setCookie } from '@/utils';
import SignUp from '../Signup'; // Import SignUp component

const SignIn = ({ onClose, popupType = 'signin', isHideCloseIcon = false, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopupType] = useState(popupType);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // For button loading state

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (popup === 'signUp') {
      if (e.target.value && e.target.value.length < 8) {
        setError('Password must be at least 8 characters long.');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true); // Start loading

    if (popupType === "signin") {
      try {
        let res = await login({ emailOrMobile: email, password: password });
        setCookie('session', res.token, 30);
        message.success("You're logged in! Let's get started.");
        onSuccess();
      } catch (e) {
        message.error(e.error || "Login failed");
        console.error(e);
      }
    }

    setLoading(false); // End loading
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true); // Start loading
      const res = await googleLogin({ tokenId: credentialResponse.credential });
      setCookie('session', res.token, 30);
      message.success("You're logged in! Let's get started.");
      onClose();
    } catch (e) {
      message.error("Google login failed");
      console.error(e);
    } finally {
      setLoading(false); // End loading
    }
  };

  const renderComponent = () => {
    let element = null;
    switch (popup) {
      case 'signin':
        element = (
          <div className="bg-white rounded-lg p-8 w-[25%] z-20 relative max-sm:w-[98%]">
            {!isHideCloseIcon && (
              <span
                className="absolute text-gray-600 cursor-pointer text-[29px] top-[23px] right-[29px]"
                onClick={() => onClose()}
              >
                &times;
              </span>
            )}
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            <GoogleOAuthProvider clientId="222983834379-p85rvbma31c02vijtel6aocn0kc6f6c7.apps.googleusercontent.com">
              <div className="mb-4 flex justify-center">
                <GoogleLogin
                  onSuccess={onGoogleLogin}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
              </div>
            </GoogleOAuthProvider>
            <div className="my-[2rem] relative" style={{ borderBottom: '2px solid #e2e1e1' }}>
              <div
                className="absolute w-[36px] text-[1.125em] font-medium left-[47%] top-[-9px] text-center bg-white leading-none"
              >
                <i>Or</i>
              </div>
            </div>
            <form onSubmit={(e) => handleSubmit(e, 'signIn')}>
              <div className="mb-4">
                <input
                  autoComplete="off"
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="mb-4">
                <input
                  autoComplete="off"
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <a
                    href="#"
                    className="text-green-500 hover:underline text-[14px]"
                    onClick={() => setPopupType('forgotPassword')}
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
              <div className="text-center">
                <span className="text-gray-800">Don't have an account?</span>{' '}
                <a
                  href="#"
                  onClick={() => setPopupType('signUp')}
                  className="text-green-500 hover:underline text-[14px]"
                >
                  Sign Up with Email
                </a>
              </div>
            </form>
          </div>
        );
        break;
      case 'signUp':
        // Render SignUp component
        element = (
          <SignUp
            onClose={onClose} // Pass onClose function to handle closing the modal
            handleSignup={handleSubmit} // Pass the signup handler function to SignUp
            form={null} // You can pass the form if needed, or you can manage it in SignUp itself
          />
        );
        break;
      case 'forgotPassword':
        element = (
          <div className="bg-white rounded-lg p-8 w-[25%] z-20 relative max-sm:w-[98%]">
            {!isHideCloseIcon && (
              <span
                className="absolute text-gray-600 cursor-pointer text-[29px] top-[23px] right-[29px]"
                onClick={() => onClose()}
              >
                &times;
              </span>
            )}
            <h2 className="text-2xl font-bold mb-4">Forgot Password?</h2>
            <div className="mb-4 text-[13px]" style={{ color: 'rgba(36, 44, 66, 0.8)' }}>
              Have you forgotten your password? Please enter your email address associated with the account and we'll mail you the reset link.
            </div>

            <form onSubmit={(e) => handleSubmit(e, 'forgotPassword')}>
              <div className="mb-4">
                <input
                  autoComplete="off"
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>

              {error && <p className="text-red-500 mb-4 text-[13px]">{error}</p>}
              <div className="flex justify-between items-center mb-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        );
        break;
      default:
        break;
    }
    return element;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-900 opacity-50 z-10" onClick={() => onClose()}></div>
      {renderComponent()}
    </div>
  );
};

export default SignIn;
