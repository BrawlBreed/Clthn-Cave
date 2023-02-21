import { useState, useEffect } from 'react';

import FormInput from '../form-input/form-input.component';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';
import Alerts from '../../utils/alerts/Alerts';

import {
  signIn,
  signInWithGooglePopup,
} from '../../utils/firebase/firebase.utils';

import { validateQuery } from '../../utils/validation/validation';

import './sign-in-form.styles.scss';

const defaultFormFields = {
  displayNameEmail: '',
  password: '',
};
const defaultErrors = {
  displayNameEmail: '',
  password: '',
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [errors, setErrors] = useState(defaultErrors)
  const { displayNameEmail, password } = formFields;
  const [msg, setMsg] = useState('');

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signUserIn = async (userData) => {
    const err = await validateQuery(formFields, errors)
    setErrors(err)

    // const valid = Object.values(errors).filter((err) => err !== '')

    if (err.displayNameEmail === '') {
      const res = await signIn(userData)

      if (res.success === "No") {
        if (res.error === 'auth/wrong-password') {
          setErrors({ ...errors, password: "You typed a wrong Password" })
        }
        else if (res.error === 'auth/too-many-requests') {
          const Msg = { msg: 'Too many requests!Try again later.', success: 'No', }
          setMsg(Object.values(Msg))
          setTimeout(() => {
            setMsg('')
          }, 3001)
        }
      } else if (res.success = "Yes") {
        const Msg = { msg: 'Success!', success: 'Yes' };
        setMsg(Object.values(Msg))
        setTimeout(() => {
          setMsg('')
        }, 3001)
      }
    }
  }


  const signInWithGoogle = async () => {
    await signInWithGooglePopup();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    signUserIn(formFields)

  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className='sign-in-container'>
      <h2>Already have an account?</h2>
      <h4>Sign in with your email and password</h4>
      {msg && <Alerts success={msg[1]} msg={msg[0]} />}
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Display name or password'
          required
          onChange={handleChange}
          name='displayNameEmail'
          value={displayNameEmail}
          error={errors.displayNameEmail}
        />

        <FormInput
          label='Password'
          type='password'
          required
          onChange={handleChange}
          name='password'
          value={password}
          error={errors.password}
        />
        <div className='buttons-container'>
          <Button type='submit'>Sign In</Button>
          <Button
            buttonType={BUTTON_TYPE_CLASSES.google}
            type='button'
            onClick={signInWithGoogle}
          >
            Sign In With Google
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
