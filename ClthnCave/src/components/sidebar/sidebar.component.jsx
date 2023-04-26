import React, { useContext, useState, useEffect } from 'react'
import { CategoriesContext } from '../../contexts/categories.context'
import { SidebarContext } from '../../contexts/sidebar.context'
import { Modal } from './modal.component'
import './sidebar.styles.scss'
import { BiSearchAlt } from 'react-icons/bi'
import { AiOutlineCloseSquare } from 'react-icons/ai'
import { GoThreeBars } from 'react-icons/go'
import { MdOutlineExpandMore, MdExpandLess } from 'react-icons/md'
import AOS from 'aos'
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom'


const Sidebar = () => {
    const { setIsSidebarOpen, sidebarState, onChangeHandler } = useContext(SidebarContext)
    const [modal, setModal] = useState({ title: '' })
    const { categoriesMap } = useContext(CategoriesContext)
    const navigate = useNavigate()

    const { searchBox, isSidebarOpen, filteredItems, loading } = sidebarState

    const modalSetter = (item) => {
        const { title, imageUrls } = item
        setModal({ title: title, imageUrl: imageUrls })
    }

    const handleKeyDown = (e, data) => {
        if (e.key === 'Enter') {
            console.log(data)
            navigate('/shop/search', { state: data })
        }
    }

    const handleClick = (data) => {
        navigate('/shop/search', { state: data })
    }

    useEffect(() => {
        AOS.init()
    }, [])

    return (
        <div style={{ marginBottom: '10px' }}>
            <div className='full-screen' style={{
                backgroundColor: isSidebarOpen && 'rgba(58, 53, 53, 0.1)'
                , display: isSidebarOpen ? 'block' : 'none'
            }}>
                <div className='sidebar-width'>
                    <div className='text-alignment'>
                        {/* <ClthnLogo id='sidebar-icon' /> */}
                        <div className='close-icon'>
                            <AiOutlineCloseSquare className='close-icon' onClick={() => setIsSidebarOpen()} />
                        </div>
                        <h2>Search</h2>
                        <div className='column'>
                            <BiSearchAlt onClick={() => {
                                handleClick(filteredItems)
                            }} style={{ cursor: 'pointer' }} id='search-icon' />
                            <input
                                id='searchbox'
                                onChange={(e) => { onChangeHandler(e) }}
                                onKeyDown={(e) => {
                                    handleKeyDown(e, filteredItems)
                                }}
                            />
                        </div>
                        {loading ? (
                            <div className='categories'>
                                {searchBox ? filteredItems.map((item, idx) => {
                                    return (
                                        <div className='category' key={idx}>
                                            {modal.title === item.title ?
                                                <>
                                                    <Modal item={item} />
                                                    <MdExpandLess
                                                        onClick={() => {
                                                            modalSetter({ title: '', imageUrl: '' })
                                                        }}
                                                        className='expand-icon'
                                                    />
                                                </>
                                                :
                                                <>
                                                    <h3>{item.title}</h3>
                                                    <MdOutlineExpandMore
                                                        onClick={() => {
                                                            modalSetter(item)
                                                        }}
                                                        className='expand-icon'
                                                    />
                                                </>
                                            }
                                        </div>
                                    )
                                }) :
                                    <div className='category'>
                                        {categoriesMap.length ? categoriesMap.map((item) => {
                                            return (
                                                <div>
                                                    <h3 onClick={() => navigate(`/shop/${item.category.title}`)}>
                                                        {item.category.title}
                                                    </h3>
                                                </div>
                                            )
                                        }) : <></>}
                                    </div>}
                            </div>

                        ) : <></>
                        }
                    </div>
                </div>
            </div>
            <div style={{ display: isSidebarOpen ? 'none' : 'block' }}>
                <GoThreeBars id='open-sidebar' onClick={() => setIsSidebarOpen()} />
            </div>
        </div>)
}

export default Sidebar