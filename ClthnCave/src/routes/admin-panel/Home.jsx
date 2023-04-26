import React from 'react';
import './add-new.styles.scss';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate()
    const url = 'https://instagram.fsof9-1.fna.fbcdn.net/v/t51.2885-19/319278191_653456836481435_5831790469811858937_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fsof9-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=J_NmmK8y0bEAX-w6-8J&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfA6Hk5yE9J6u4x_KQ3JK_nbjkS6xq_qiDT0bD_ocDbaDA&oe=6424B7EF&_nc_sid=8fd12b'

    return (
        <>
            <div className='directory-item-container'
                onClick={() => {
                    navigate(`/admin-panel/add`)
                }}
            >
                <div
                    className='background-image'
                    style={{
                        backgroundImage: `url(${url})`,
                        transition: '2s'
                    }}
                />
                <div className='body'>
                    <h2>Admin</h2>
                    <p>Add Product/Category</p>
                </div>
            </div>
            <div className='directory-item-container'
                onClick={() => {
                    navigate(`/admin-panel/manager`)
                }}
            >
                <div
                    className='background-image'
                    style={{
                        backgroundImage: `url(${url})`,
                        transition: '2s'
                    }}
                />
                <div className='body'>
                    <h2>Admin</h2>
                    <p>Category Manager</p>
                </div>
            </div>
            <div className='directory-item-container'
                onClick={() => {
                    navigate(`/admin-panel/orders`)
                }}
            >
                <div
                    className='background-image'
                    style={{
                        backgroundImage: `url(${url})`,
                        transition: '2s'
                    }}
                />
                <div className='body'>
                    <h2>Admin</h2>
                    <p>Orders Preview</p>
                </div>
            </div>

        </>

    )
}

export default Home