import React, { useContext, useState } from 'react'
import { HiArrowSmLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { OrdersContext } from '../../contexts/orders.context';
import { deleteOrder } from '../../utils/firebase/firebase.utils';

import { TiTickOutline } from 'react-icons/ti';
import { AiOutlineCloseSquare } from 'react-icons/ai';

import Button from '../../components/button/button.component';
import './add-new.styles.scss';

export const Orders = () => {
    const { restData, currentOrder, setCurrentOrder } = useContext(OrdersContext);
    const [confirmModal, setConfirmModal] = useState(false)

    const handleDeleteOrder = async (order) => {
        const res = await deleteOrder(order)

        if (res) window.location.reload()
    }

    return (
        <div>
            <h1>
                <Link to='../'>
                    <HiArrowSmLeft />
                </Link>
            </h1>
            {confirmModal &&
                <div className='confirm-modal'>
                    <AiOutlineCloseSquare onClick={() => setConfirmModal(false)} style={{ zIndex: '3', marginLeft: '80%', width: '50px', height: '50px', cursor: 'pointer' }} />
                    <h3>This will delete the order.Are you sure you want to delete it ?</h3>
                    <Button onClick={() => handleDeleteOrder(restData[currentOrder].name)}>Delete</Button>
                </div>
            }
            <table className='orders-container'>
                <tr className='orders'>
                    <div className='header-block'>
                        <span>Name</span>
                    </div>
                    <div className='header-block'>
                        <span>City</span>
                    </div>
                    <div className='header-block'>
                        <span>Address</span>
                    </div>
                    <div className='header-block'>
                        <span>Email</span>
                    </div>
                    <div className='header-block'>
                        <span>From</span>
                    </div>
                    <div className='header-block'>
                        <span>Set</span>
                    </div>
                </tr>
                {restData.length ? restData.map((item, idx) =>
                    <tr className='orders' style={{ cursor: 'pointer' }} onClick={() => setCurrentOrder(idx)}>
                        <div className='header-block'>
                            <span>{item.name}</span>
                        </div>
                        <div className='header-block'>
                            <span>{item.city}</span>
                        </div>
                        <div className='header-block'>
                            <span>{item.address}</span>
                        </div>
                        <div className='header-block'>
                            <span>{item.email.toLowerCase()}</span>
                        </div>
                        <div className='header-block'>
                            <span>{String(item.from.toDate())}</span>
                        </div>
                        <div className='header-block'>
                            <h1><TiTickOutline onClick={() => setConfirmModal(true)} className='tick' /></h1>
                        </div>
                    </tr>
                ) : <></>}
            </table>

        </div >
    )
}

export default Orders