import React, { useEffect, useState, useContext } from 'react';
import { getCategoriesAndDocuments, handleUpload, updateProducts, deleteCategories, updateCategory } from '../../utils/firebase/firebase.utils';
import { FormInput } from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';
import { EditContext } from '../../contexts/edit.context';
import { productValidation } from '../../utils/validation/validation';
import { Link } from 'react-router-dom';
import { HiArrowSmLeft } from 'react-icons/hi';

import { AiOutlineCloseSquare, AiFillDelete } from 'react-icons/ai';

const INITIAL_STATE = { title: '', categoryTitle: '', categoryImage: '', description: '', price: '', imageUrls: '', sizes: '' }

export const CategoriesManager = () => {
    const { state, setModal, handleChange, handleChangeSize, handleFileSelect, setCategoryIndex, setProductIndex } = useContext(EditContext);
    const { currentProduct, currentCategory, restData, modal, categoryIndex, productIndex } = state;
    const { price, description, title, sizes, imageUrls } = currentProduct;
    const [confirmModal, setConfirmModal] = useState(false)

    const handleProducts = async () => {
        setProductIndex(0)

        const res = await updateProducts(restData[categoryIndex].category.title, restData[categoryIndex].products)

        if (res === true) window.location.reload()
    }

    const handleCategory = async () => {
        const res = await updateCategory(restData[categoryIndex].category.title, currentCategory)

        if (res === true) window.location.reload()
    }

    const deleteProduct = async (categoryId) => {
        const newProducts = restData[categoryIndex].products
        newProducts.splice(productIndex, 1)
        const res = await updateProducts(categoryId, newProducts)

        if (res) window.location.reload()
    }
    const deleteCategory = async (categoryId) => {
        setConfirmModal(false)
        const res = await deleteCategories(categoryId)

        if (res) window.location.reload()
    }

    return (
        <>
            <h1>
                <Link to='../'>
                    <HiArrowSmLeft />
                </Link>
            </h1>
            <div className='manager-container'>
                {modal ? (
                    <>
                        <h1>
                            <AiOutlineCloseSquare onClick={() => setModal()} />
                        </h1>
                        <div className='modal'>
                            <h1>
                                <AiOutlineCloseSquare style={{ cursor: 'pointer' }} onClick={() => setModal()} />
                            </h1>
                            <table>
                                <tr style={{ flexDirection: 'row', gap: '5%' }}>
                                    {restData.length > 0 && restData[categoryIndex].products.map((item, idx) =>
                                        idx === productIndex ? (
                                            <td style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '5%', border: '2px solid black' }}>
                                                <FormInput name='title' value={title} onChange={handleChange} label='Product Title' style={{ textAlign: 'center' }} />
                                                <textarea name='description' value={description} onChange={handleChange} type='textarea' label='Product Description' style={{ textAlign: 'center' }} />
                                                <div>
                                                    <div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                                                        {imageUrls.map((image) => <img width='50px' src={image} height='50px' />
                                                        )}
                                                    </div>
                                                    <input
                                                        type='file'
                                                        accept="image/gif, image/jpeg, image/png"
                                                        className="custom-file-input"
                                                        multiple
                                                        name='imageUrls'
                                                        onChange={handleFileSelect}
                                                    />
                                                    <FormInput name='price' value={price} onChange={handleChange} type='number' label='Product Price' style={{ textAlign: 'center' }} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%%', marginLeft: '10%', gap: '5%' }}>
                                                    <FormInput name='sizes' onChange={handleChangeSize} checked={sizes.includes('xs') && 'true'} label='XS' value='xs' type='checkbox' />
                                                    <FormInput name='sizes' onChange={handleChangeSize} checked={sizes.includes('s') && 'true'} label='S' value='s' type='checkbox' />
                                                    <FormInput name='sizes' onChange={handleChangeSize} checked={sizes.includes('m') && 'true'} label='M' value='m' type='checkbox' />
                                                    <FormInput name='sizes' onChange={handleChangeSize} checked={sizes.includes('l') && 'true'} label='L' value='l' type='checkbox' />
                                                    <FormInput name='sizes' onChange={handleChangeSize} checked={sizes.includes('xl') && 'true'} label='XL' value='xl' type='checkbox' />
                                                    <FormInput name='sizes' onChange={handleChangeSize} checked={sizes.includes('xxl') && 'true'} label='XXL' value='xxl' type='checkbox' />
                                                </div>
                                                <div>
                                                    <h1><AiFillDelete className='delete-icon' onClick={() =>
                                                        deleteProduct(restData[categoryIndex].category.title)
                                                    } /></h1>
                                                </div>
                                            </td>

                                        )
                                            : (
                                                < td onClick={() => setProductIndex(idx)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer', padding: '5%', border: '2px solid black' }}>
                                                    <FormInput name='title' value={item.title} label='Product Title' style={{ textAlign: 'center' }} />
                                                    <textarea name='description' value={item.description} type='textarea' label='Product Description' style={{ textAlign: 'center' }} />
                                                    <div>
                                                        <div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                                                            {item.imageUrls.map((image) => <img width='50px' src={image} height='50px' />
                                                            )}
                                                        </div>
                                                        <input
                                                            type='file'
                                                            accept="image/gif, image/jpeg, image/png"
                                                            className="custom-file-input"
                                                            multiple
                                                            name='imageUrls'
                                                        />
                                                        <FormInput name='price' value={item.price} type='number' label='Product Price' style={{ textAlign: 'center' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%%', marginLeft: '10%', gap: '5%' }}>
                                                        <FormInput name='sizes' checked={item.sizes.includes() && 'true'} label='XS' value='xs' type='checkbox' />
                                                        <FormInput name='sizes' checked={item.sizes.includes() && 'true'} label='S' value='s' type='checkbox' />
                                                        <FormInput name='sizes' checked={item.sizes.includes() && 'true'} label='M' value='m' type='checkbox' />
                                                        <FormInput name='sizes' checked={item.sizes.includes() && 'true'} label='L' value='l' type='checkbox' />
                                                        <FormInput name='sizes' checked={item.sizes.includes() && 'true'} label='XL' value='xl' type='checkbox' />
                                                        <FormInput name='sizes' checked={item.sizes.includes() && 'true'} label='XXL' value='xxl' type='checkbox' />
                                                    </div>
                                                    <div>
                                                        <h1><AiFillDelete className='delete-icon' /></h1>
                                                    </div>
                                                </td>
                                            )
                                    )}
                                </tr>
                                <Button type='submit' onClick={handleProducts}>Submit</Button>
                            </table>
                        </div>
                    </>
                ) : <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1>Categories</h1>
                    {restData.length ? <table>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            gap: '5%'
                        }}>
                            {restData.length && restData.map((item, idx) =>
                                idx === categoryIndex ? (
                                    <div style={{ display: 'flex', flex: 'column', border: '2px solid gray' }}>
                                        {confirmModal &&
                                            <div className='confirm-modal'>
                                                <AiOutlineCloseSquare onClick={() => setConfirmModal(false)} style={{ zIndex: '3', marginLeft: '80%', width: '50px', height: '50px', cursor: 'pointer' }} />
                                                <h3>Are you sure you want to delete {item.category.title} ?</h3>
                                                <Button onClick={() => deleteCategory(restData[categoryIndex].category.title)}>Delete {item.category.title}</Button>
                                            </div>
                                        }
                                        <tr style={{ marginBottom: '10px' }}>
                                            <th>{item.category.title}</th>
                                            <h1><AiFillDelete onClick={() => setConfirmModal(true)} className='delete-icon' /></h1>
                                        </tr>
                                        <tr>
                                            <td style={{ cursor: 'pointer' }} >
                                                <FormInput
                                                    name='categoryTitle'
                                                    label='Category Title'
                                                    style={{ textAlign: 'center' }}
                                                    value={currentCategory.title}
                                                    onChange={handleChange}
                                                />
                                                <label>Category Image</label>
                                                <input
                                                    name='categoryImage'
                                                    type='file'
                                                    required
                                                    accept="image/gif, image/jpeg, image/png"
                                                    className="custom-file-input"
                                                    onChange={handleFileSelect}
                                                />
                                                <label>Products in {item.category.title}</label>
                                                <Button onClick={() => setModal()}>Edit/Delete</Button>
                                                <Button onClick={() => handleCategory()}>Submit</Button>
                                            </td>
                                        </tr>
                                    </div>
                                ) :
                                    <div onClick={() => setCategoryIndex(idx)} style={{ display: 'flex', flex: 'column', cursor: 'pointer' }}>
                                        <tr>
                                            <td style={{ cursor: 'pointer' }} >
                                                <FormInput
                                                    name='categoryTitle'
                                                    label='Category Title'
                                                    style={{ textAlign: 'center' }}
                                                    value={item.category.title}
                                                />
                                                <label>Category Image</label>
                                                <input
                                                    name='categoryImage'
                                                    type='file'
                                                    required
                                                    accept="image/gif, image/jpeg, image/png"
                                                    className="custom-file-input"
                                                    onChange={handleFileSelect}
                                                    value=''
                                                />
                                                <label>Products in {item.category.title}</label>
                                                <Button onClick={() => setModal()}>Edit/Delete</Button>
                                                <Button>Submit</Button>
                                            </td>
                                        </tr>
                                    </div>
                            )}

                        </div>
                    </table>
                        : <h2>No categories found! Add some <Link style={{ color: 'blue' }} to='../add'>HERE</Link></h2>}
                </div >

                }
            </div >
        </>
    )
}

export default CategoriesManager