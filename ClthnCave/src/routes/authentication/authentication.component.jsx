import { useContext, useEffect } from 'react'
import { RecoveryContext } from "../../contexts/recovery.context";

import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import SignInForm from "../../components/sign-in-form/sign-in-form.component";
import ForgotPassword from "../../components/forgot-password-form/forgot-password-form.component";

import "./authentication.styles.scss";

const Authentication = () => {
  const { setPage, recoveryState } = useContext(RecoveryContext)
  const { page } = recoveryState

  return (
    <div className="authentication-container">
      {page === 'signIn' ? (
        <div className="form">
          <SignInForm />
          <p>Don't have an account yet? Sign up <span className="click-here" onClick={() => setPage('signUp')}>here</span></p>
          <p><span className="click-here" onClick={() => setPage('sendEmail')}>Forgot password?</span></p>
        </div>
      ) : <></>}
      {page === 'signUp' ? (
        <div className="form">
          <SignUpForm />
          <p>Already have an account? Sign in <span className="click-here" onClick={() => setPage('signIn')}>here</span></p>
        </div>
      ) : <></>}
      {page === 'sendEmail' || page === 'otp' || page === 'changePassword' ? (
        <div className="form">
          <ForgotPassword />
          <p><span className="click-here" onClick={() => setPage('signIn')}>Back to login</span></p>
        </div>
      ) : <></>}
    </div>
  );
};

export default Authentication;
