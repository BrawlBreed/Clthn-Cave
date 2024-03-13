import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import './DarkDropdown.styles.scss';

export const DarkDropdown = ({ title, itemsArr, setFunction }) => {
    const [open, setIsOpen] = useState(false)

    return (
        <Navbar expand="lg">
            <Container fluid>
                <Navbar.Collapse >
                    <Nav>
                        <NavDropdown
                            title={title ? title : `Select`}
                            className='dropdown'
                            onClick={() => setIsOpen((prev) => !prev)}
                        >
                            {open ? itemsArr.map((item, i) => (
                                <div
                                    className='item-container'
                                    key={i}
                                    onClick={() => {
                                        setFunction(item.category.title)
                                    }}
                                >
                                    <NavDropdown.Item
                                        className='dropdown-item'
                                    >
                                        {item.category.title}
                                    </NavDropdown.Item>
                                </div>
                            )) : <></>}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default DarkDropdown