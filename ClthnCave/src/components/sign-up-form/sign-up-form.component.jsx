import { useState, useEffect, useContext } from 'react';
import { RecoveryContext } from '../../contexts/recovery.context';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import Alerts from '../../utils/alerts/Alerts';

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';
import { validate } from '../../utils/validation/validation';
import { addUser } from '../../utils/firebase/firebase.utils';

import './sign-up-form.styles.scss';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const defaultErrors = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [errors, setErrors] = useState(defaultErrors);
  const [isSubmit, setIsSubmit] = useState(false)
  const [msg, setMsg] = useState('')
  const { setPage } = useContext(RecoveryContext)

  const { displayName, email, password, confirmPassword } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmit(true)

    setErrors(validate(formFields, errors))

    const valid = Object.values(errors).filter((err) => err !== '')
    if (valid.length === 0) {
      const Msg = await addUser(formFields);
      console.log(Msg)
      if (Msg.code === 'auth/email-already-in-use') {
        setErrors({ ...errors, email: 'This email is already being used by another user!' });
      } else {
        setMsg(Object.values(Msg));
        setTimeout(() => {
          setMsg('')
        }, 3001)
        resetFormFields();
        setPage('signIn')
      }
    }
  };

  useEffect(() => {
    if (isSubmit === true) {
      setErrors(validate(formFields, errors))
    }
  }, [formFields])

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className='sign-up-container'>
      <h2>Don't have an account?</h2>
      <h4>Sign up with your email and password</h4>
      {msg && <Alerts success={msg[1]} msg={msg[0]} />}
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Display Name'
          type='text'
          required
          onChange={handleChange}
          name='displayName'
          value={displayName}
          error={errors.displayName}
        />

        <FormInput
          label='Email'
          type='email'
          required
          onChange={handleChange}
          name='email'
          value={email}
          error={errors.email}
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

        <FormInput
          label='Confirm Password'
          type='password'
          required
          onChange={handleChange}
          name='confirmPassword'
          value={confirmPassword}
          error={errors.confirmPassword}
        />
        <Button id='btn' type='submit'>Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUpForm;
