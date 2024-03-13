import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

//
export const Alerts = ({ success, msg }) => {
  const [active, setActive] = useState(false);
  const redirect = useNavigate()

  useEffect(async () => {
    setActive(true)
    setTimeout(() => {
      setActive(false)
    }, 3000)
  }, [])

  if (active && success === 'Yes') {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      showConfirmButton: false,
      timer: 2500
    })
  }
  else if (active && success === 'No') {
    Swal.fire({
      icon: 'error',
      title: msg === 'auth/email-already-in-use' ? 'This email is alreay in use!' : 'There was an error creating your account!',
      text: msg,
      showCancelButton: false,
      timer: 2500
    })
  }

  return (
    <div>
    </div>

  )
}

export default Alerts
