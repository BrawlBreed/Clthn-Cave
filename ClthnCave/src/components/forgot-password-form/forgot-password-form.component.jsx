import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { RecoveryContext } from '../../contexts/recovery.context'
import FormInput from '../form-input/form-input.component'
import Button from '../button/button.component'
import { setNewPassword, auth, sendConfirmationEmail } from '../../utils/firebase/firebase.utils'
import { validatePassword } from '../../utils/validation/validation'
import { Alerts } from '../../utils/alerts/Alerts'
import './forgot-password-form.styles.scss'


const INITIAL_STATE1 =
    { first: 0, second: 0, third: 0, forth: 0 }
const INITIAL_STATE2 =
    { password: '', confirmPassword: '' }
export const ForgotPassword = () => {
    const { setPage, setOtp, setEmail, recoveryState } = useContext(RecoveryContext)
    const { page, otp, obb, email } = recoveryState
    const [OTPinput, setOTPinput] = useState(INITIAL_STATE1)
    const [timerCount, setTimer] = useState(0);
    const [disable, setDisable] = useState(true);
    const [codeError, setCodeError] = useState('');
    const [formFields, setFormFields] = useState(INITIAL_STATE2);
    const [errors, setErrors] = useState(INITIAL_STATE2);
    const [msg, setMsg] = useState(false)
    const [emailNotification, setEmailNotification] = useState('')
    const location = useLocation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        // const OTP = Math.floor((Math.random() * 9000 + 1000))
        // setOtp(OTP)
        setTimer(60)
        setDisable(true)

        const response = await sendConfirmationEmail(email)

        if (response) {
            setDisable(true)
            setEmailNotification('Verification email sent!')
        }
        // navigateToOTP()
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormFields({ ...formFields, [name]: value });
    }

    const navigateToOTP = async () => {
        if (email) {
            const OTP = Math.floor((Math.random() * 9000 + 1000))
            setOtp(OTP)

            axios
                .post("http://localhost:5000/send_recovery_email", {
                    OTP: OTP,
                    recipient_email: email
                })
                .then(() => setPage('otp'))
                .catch((err) => {
                    console.log(err)
                })
            return
        }
    }

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer((lastTimerCount) => {
                lastTimerCount <= 1 && clearInterval(interval);
                if (lastTimerCount <= 1) setDisable(false);
                if (lastTimerCount <= 0) return lastTimerCount;
                return lastTimerCount - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [disable]);

    const proceed = (OTPinput) => {
        const code = Object.values(OTPinput).reduce((acc, curr) => acc + curr)

        if (Number(code) === otp) {
            setCodeError('')
            setPage('changePassword')
        }
        else {
            setCodeError('Wrong code. Try again!')
        }
    }

    const handleQuery = async (e) => {
        e.preventDefault()

        setErrors(validatePassword(formFields, errors))

        const valid = Object.values(errors).filter((err) => err !== '')
        if (valid.length === 0) {
            const { password } = formFields
            const response = await setNewPassword(auth, obb, password)
            if (response) {
                const Msg = { msg: 'Success!', success: 'Yes' };
                setMsg(Object.values(Msg))
                window.history.replaceState(null, '', location.pathname);

                setTimeout(() => {
                    setMsg('')
                    window.location.reload();
                }, 3005)
            }

            location.search = ''
        }
    }

    return (
        <>
            {page === 'sendEmail' && (
                <div className='forgot-password-container'>
                    <h2>Forgot your password?</h2>
                    <h4>Type in your email</h4>
                    <form onSubmit={(e) => {
                        if (disable === false) {
                            handleSubmit(e)
                        }
                    }}>
                        <FormInput
                            label='Email'
                            type='email'
                            required
                            onChange={(e) => setEmail(e)}
                            name='email'
                            value={email}
                        />
                        <Button id='btn' onSubmit={(e) => {
                            if (disable === false) {
                                handleSubmit(e)
                            }
                        }}>
                            Submit
                        </Button>
                        {emailNotification && (
                            <>
                                <p style={{ color: 'lightgreen' }}>{emailNotification}</p>
                                <p>Did't recieve code? {disable ? <span>Resend in {timerCount}</span> : <span style={{ cursor: 'pointer', color: 'blue' }} onClick={(e) => handleSubmit(e)}>Resend now</span>}
                                </p>
                            </>
                        )}

                    </form>
                </div>
            )}
            {page === 'otp' && (
                <div className='forgot-password-container'>
                    <h2>Forgot your password?</h2>
                    <h4>Type in the code we sent you!</h4>
                    <form>
                        <div className='code-breadcrumb'>
                            <input
                                className='digit-breadcrumb'
                                maxLength={1}
                                required
                                onChange={(e) => {
                                    setOTPinput({
                                        first: e.target.value,
                                        second: OTPinput.second,
                                        third: OTPinput.third,
                                        forth: OTPinput.forth,
                                    })
                                }}
                            />
                            <input className='digit-breadcrumb'
                                maxLength={1}
                                required
                                onChange={(e) =>
                                    setOTPinput({
                                        first: OTPinput.first,
                                        second: e.target.value,
                                        third: OTPinput.third,
                                        forth: OTPinput.forth,
                                    })
                                }

                            />
                            <input className='digit-breadcrumb'
                                maxLength={1}
                                required
                                onChange={(e) =>
                                    setOTPinput({
                                        first: OTPinput.first,
                                        second: OTPinput.second,
                                        third: e.target.value,
                                        forth: OTPinput.forth,
                                    })
                                }
                            />
                            <input className='digit-breadcrumb'
                                maxLength={1}
                                required
                                onChange={(e) =>
                                    setOTPinput({
                                        first: OTPinput.first,
                                        second: OTPinput.second,
                                        third: OTPinput.third,
                                        forth: e.target.value,
                                    })
                                }
                            />
                        </div>
                        {codeError ? (<p style={{ color: 'red' }}>{codeError}</p>) : <></>}
                        <Button onClick={(e) => {
                            e.preventDefault()
                            proceed(OTPinput)
                        }} id='btn'>
                            Submit
                        </Button>
                    </form>
                    <p>Did't recieve code? {disable ? <span>Resend in {timerCount}</span> : <span style={{ cursor: 'pointer', color: 'blue' }}
                        onClick={() => {
                            navigateToOTP()
                            setTimer(60)
                            setDisable(true)
                        }}>Resend now</span>}</p>
                </div>

            )}
            {page === 'changePassword' && (
                <div className='forgot-password-container'>
                    {msg && <Alerts success={msg[1]} msg={msg[0]} />}
                    <h2>Forgot your password?</h2>
                    <h4>Type in your new password!</h4>
                    <form onSubmit={(e) => handleQuery(e)}>
                        <FormInput
                            label='New Password'
                            type='password'
                            required
                            onChange={(e) => handleChange(e)}
                            name='password'
                            value={formFields.password}
                            error={errors.password}
                        />

                        <FormInput
                            label='Confirm New Password'
                            type='password'
                            required
                            onChange={(e) => handleChange(e)}
                            name='confirmPassword'
                            value={formFields.confirmPassword}
                            error={errors.confirmPassword}
                        />
                        <Button id='btn' type='submit'>Submit</Button>
                    </form>
                </div>
            )}
        </>
    )
}

export default ForgotPassword