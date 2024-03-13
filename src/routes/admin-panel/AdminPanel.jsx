import React from 'react';
import { AddNew } from './AddNew';
import { CategoriesManager } from './CategoriesManager';
import { Home } from './Home';
import { Orders } from './Orders';
import { Routes, Route, useParams } from 'react-router-dom';

export const AdminPanel = () => {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path='add' element={<AddNew />} />
            <Route path='manager' element={<CategoriesManager />} />
            <Route path='orders' element={<Orders />} />
        </Routes>
    )
}

export default AdminPanel