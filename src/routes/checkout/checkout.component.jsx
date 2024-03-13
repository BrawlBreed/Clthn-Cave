import { useContext, useState } from 'react';
import { CartContext } from '../../contexts/cart.context';
import { CheckoutContext } from '../../contexts/checkout.context';
import CheckoutItem from '../../components/checkout-item/checkout-item.component';
import { CheckoutStatusBar } from '../../utils/alerts/CheckoutStatusBar';
import { Countries } from '../../utils/alerts/Countries';
import './checkout.styles.scss';
import { Button } from '../../components/button/button.component';
import { FormInput } from '../../components/form-input/form-input.component';
import { checkoutValidation } from '../../utils/validation/validation';
import { placeOrder } from '../../utils/firebase/firebase.utils';
import { IoCashOutline, IoCashSharp } from 'react-icons/io5';
import { TiTickOutline } from 'react-icons/ti';
import { GoMailRead } from 'react-icons/go';
import { HiArrowSmLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const INITIAL_STATE = { name: '', address: '', city: '', phone: '', email: '', pmethod: '', postcode: '' }
export const Checkout = () => {
  const { cartState, clearCart } = useContext(CartContext);
  const { cartItems, cartTotal } = cartState;
  const { state, setStage, handleAddressChange, setPhone, handleChange, setPaymentMethod } = useContext(CheckoutContext);
  const { name, address, phone, stage, country, email, city, postcode, pmethod } = state;
  const [errors, setErrors] = useState(INITIAL_STATE);
  const [icon, setIcon] = useState(0);
  const navigate = useNavigate()

  const handleProceed = (e) => {
    e.preventDefault()

    setErrors(checkoutValidation(state, errors))

    const valid = Object.values(errors).filter((item) => item.length > 0).length > 0 ? 0 : 1;

    if (valid) {
      setStage(stage + 1)
    }
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()

    if (pmethod) {
      const completed = placeOrder(state)

      if (completed) {
        clearCart()
        setStage(4)
      }
    } else {
      setErrors({ ...errors, pmethod: 'Select a payment method!' })
    }
  }

  return (
    <>
      <CheckoutStatusBar stage={stage} />
      {stage === 1 && (
        <>
          <div className='checkout-container-1'>
            <div className='checkout-header'>
              <div className='header-block'>
                <span>Product</span>
              </div>
              <div className='header-block'>
                <span>Description</span>
              </div>
              <div className='header-block'>
                <span>Quantity</span>
              </div>
              <div className='header-block'>
                <span>Size</span>
              </div>
              <div className='header-block'>
                <span>Price</span>
              </div>
              <div className='header-block'>
                <span>Remove</span>
              </div>
            </div>
            {cartItems.map((cartItem) => (
              <CheckoutItem key={cartItem.id} cartItem={cartItem} />
            ))}
            <span className='total'>Total: {cartTotal} BGN</span>
            {cartTotal ? <Button onClick={() => { setStage(2) }}>Continue</Button> : <></>}
          </div>
        </>
      )}
      {stage === 2 && (
        <>
          <HiArrowSmLeft onClick={() => setStage(1)} style={{ width: '60px', height: 'auto', cursor: 'pointer', marginLeft: '15%' }} />

          <div className='checkout-container-2'>
            <FormInput
              label='Email'
              type='email'
              required
              onChange={(e) => handleChange(e)}
              name='email'
              error={errors.email}
              value={email}
            />
            <FormInput
              label='Name'
              type='text'
              required
              onChange={(e) => handleChange(e)}
              name='name'
              error={errors.name}
              value={name}
            />
            <FormInput
              label='Address'
              type='address'
              required
              onChange={(e) => handleAddressChange(e)}
              name='address'
              error={errors.address}
              value={address}
            />
            <FormInput
              label='City/Province'
              type='text'
              required
              onChange={(e) => handleChange(e)}
              name='city'
              error={errors.city}
              value={city}
            />
            <FormInput
              label='Postcode'
              type='text'
              required
              onChange={(e) => handleChange(e)}
              name='postcode'
              error={errors.postcode}
              value={postcode}
            />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Countries />
              <FormInput
                label='Phone'
                type='phone'
                required
                maxLength={country.length + 10}
                onChange={(e) => setPhone(e)}
                name='phone'
                error={errors.phone}
                value={`+${country}${phone}`}
              />
            </div>
            <div style={{ gridArea: '4 / 2', alignSelf: 'center' }}>
              <Button onClick={(e) => handleProceed(e)}>Continue</Button>
            </div>
          </div>
        </>
      )}
      {stage === 3 && (
        <>
          <HiArrowSmLeft onClick={() => setStage(2)} style={{ width: '60px', height: 'auto', cursor: 'pointer', marginLeft: '15%' }} />

          <div className='checkout-container'>
            <h1>Payment</h1>
            <p>Select payment method</p>
            <div className="row" onClick={() => {
              setIcon((prev) => !prev)
              setPaymentMethod('cash')
            }}>
              <span>Cash </span>
              {icon ? <IoCashSharp /> : <IoCashOutline />}
            </div>
            {errors.pmethod ? (
              <span style={{ color: 'red' }}>{errors.pmethod}</span>
            )
              : <></>}
            <p style={{ marginBottom: '0', width: '50%' }}>Order</p>
            <div style={{ display: 'flex', flexDirection: 'row', width: '50%' }}>
              <div style={{ width: '100%', border: '2px solid gray', borderRadius: '3px' }}>
                {cartItems.map((item) => {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', borderTop: '0.5px solid #cfcfcf' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <ul style={{ listStyle: 'none', alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '20%', padding: '10px', width: '100%' }}>
                          <img width={50} height={50} src={item.imageUrls} />
                          <li>
                            <span style={{ color: '#a8a8a8' }}>{item.title}</span>
                          </li>
                          <li>
                            <span>Quantity:</span>
                            <span>{item.quantity}</span>
                          </li>
                          <li>
                            <span>{item.quantity * item.price}</span>
                            <span>BGN</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ width: '50%', border: '2px solid gray', borderRadius: '3px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ textAlign: 'center' }}>Total</h2>
                <span>{cartTotal} BGN <span style={{ color: '#a8a8a8' }}>20% VAT app.</span></span>
                <Button onClick={(e) => handlePlaceOrder(e)}>Place Order</Button>
              </div>
            </div>
          </div>
        </>
      )}
      {stage === 4 && (
        <>
          <HiArrowSmLeft onClick={() => setStage(3)} style={{ width: '60px', height: 'auto', cursor: 'pointer', marginLeft: '15%', }} />
          <div className='container-completed'>
            <h1><TiTickOutline color='green' /> Thank you for your order, {name} !</h1>
            <span>We've sent you an email with details about your order!  <GoMailRead /></span>
            <Button onClick={() => { navigate('/shop') }}>Back to Shop</Button>
          </div>
        </>
      )}
    </>

  );
};

export default Checkout;
