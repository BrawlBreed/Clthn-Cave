import React, { useContext, useState, useEffect } from 'react'
import { SidebarContext } from '../../contexts/sidebar.context'
import { Modal } from './modal.component'
import './sidebar.styles.scss'
import { BiSearchAlt } from 'react-icons/bi'
import { AiOutlineCloseSquare } from 'react-icons/ai'
import { GoThreeBars } from 'react-icons/go'
import { MdOutlineExpandMore, MdExpandLess } from 'react-icons/md'
// import { ReactComponent as ClthnLogo } from '../../assets/clthncave.svg';
import AOS from 'aos'
import 'aos/dist/aos.css';


const Sidebar = () => {
    const { setIsSidebarOpen, sidebarState, onChangeHandler } = useContext(SidebarContext)
    const [modal, setModal] = useState({ name: '' })

    const { searchBox, isSidebarOpen, filteredItems, loading } = sidebarState

    const modalSetter = (item) => {
        const { id, name, imageUrl } = item
        setModal({ id: id, name: name, imageUrl: imageUrl })
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
                            <BiSearchAlt id='search-icon' />
                            <input
                                id='searchbox'
                                onChange={(e) => { onChangeHandler(e) }}
                            />
                        </div>
                        {loading ? (
                            <div className='categories'>
                                {Object.values(filteredItems).flat().filter((_, idx) => idx < 5).map((item) => {
                                    return (
                                        <div key={item.id}>
                                            <p>{item.name}</p>
                                            {modal.name === item.name ?
                                                <>
                                                    <Modal item={item} />
                                                    <MdExpandLess
                                                        onClick={() => {
                                                            modalSetter({ name: '' })
                                                        }}
                                                        className='expand-icon'
                                                    />
                                                </>
                                                :
                                                <MdOutlineExpandMore
                                                    onClick={() => {
                                                        modalSetter(item)
                                                    }}
                                                    className='expand-icon'
                                                />
                                            }
                                        </div>
                                    )
                                })}
                            </div>

                        ) : <p>Loading...</p>}
                    </div>
                </div>
            </div>
            <div style={{ display: isSidebarOpen ? 'none' : 'block' }}>
                <GoThreeBars id='open-sidebar' onClick={() => setIsSidebarOpen()} />
            </div>
        </div>)
}

export default Sidebar