import React, { useReducer, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Alerts } from '../../utils/alerts/Alerts'

import { AddContext } from '../../contexts/add.context'
import Button from '../../components/button/button.component'
import FormInput from '../../components/form-input/form-input.component'
import DarkDropdown from '../../components/dropdown/DarkDropdown.component'

import { handleUpload, addCategoryDocument } from '../../utils/firebase/firebase.utils'

import { CategoriesContext } from '../../contexts/categories.context'
import { productValidation } from '../../utils/validation/validation';

import { HiArrowSmLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import './add-new.styles.scss';

export const AddNew = () => {
    const { handleChange, setCategory, setImageUrls, setCategoryImage, setSize, state } = useContext(AddContext)
    const [errors, setErrors] = useState({ title: '', description: '', price: '', imageUrls: '', categoryImage: '', sizes: '' })
    const { title, category, description, price, imageUrls, categoryImage, sizes } = state
    const { categoriesMap } = useContext(CategoriesContext)
    const [categoryType, setCategoryType] = useState(true)
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleFileSelect = async (e) => {
        const { files } = e.target
        const url = await handleUpload(files)
        setImageUrls(url)
    }

    const categoryImageUpload = async (e) => {
        const { files } = e.target
        const url = await handleUpload(files)
        setCategoryImage(url)
    }

    const handleSumbit = async (e) => {
        e.preventDefault()
        setErrors(productValidation(state, errors))

        const valid = Object.values(errors).filter((item) => {
            return item.length > 0
        })

        if (valid.length === 0) {
            const data = {
                title: title,
                description: description,
                price: Number(price),
                imageUrls: imageUrls,
                categoryImage: categoryImage,
                sizes: Array.from(sizes)
            }

            const res = await addCategoryDocument(category, title, data)
            if (res) {
                const Msg = { msg: 'Success!', success: 'Yes' };
                setMsg(Object.values(Msg))
                setTimeout(() => {
                    setMsg('')
                    navigate('/admin-panel/')
                    window.location.reload()
                }, 3001)
            }
        }
    }

    return (
        <div>
            <h1>
                <Link to='../'>
                    <HiArrowSmLeft />
                </Link>
            </h1>
            <h1>Add Category / Product</h1>
            {msg && <Alerts success={msg[1]} msg={msg[0]} />}
            <form>
                <div>
                    <FormInput
                        label='Product Title'
                        type='text'
                        required
                        onChange={handleChange}
                        name='title'
                        value={title}
                        error={errors.title}
                    />
                </div>
                <div>
                    <FormInput
                        label='Product Desctiption'
                        type='textarea'
                        required
                        onChange={handleChange}
                        name='description'
                        value={description}
                        error={errors.description}
                    />
                </div>
                <div style={{ display: 'flex', width: '50%' }}>
                    <FormInput
                        label='Product Price'
                        type='number'
                        required
                        onChange={handleChange}
                        name='price'
                        value={price}
                        error={errors.price}
                    />
                    <label style={{ gridColumn: '100%' }}>Sizes</label>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', width: '100%%', marginLeft: '10%', gap: '5%' }}>
                            <FormInput onChange={setSize} label='XS' value='xs' type='checkbox' />
                            <FormInput onChange={setSize} label='S' value='s' type='checkbox' />
                            <FormInput onChange={setSize} label='M' value='m' type='checkbox' />
                            <FormInput onChange={setSize} label='L' value='l' type='checkbox' />
                            <FormInput onChange={setSize} label='XL' value='xl' type='checkbox' />
                            <FormInput onChange={setSize} label='XXL' value='xxl' type='checkbox' />
                        </div>
                        {errors.sizes ? <span style={{ color: 'red' }}>{errors.sizes}</span> : <></>}
                    </div>
                </div>
                <div>
                    <label>Category</label>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                        <Button onClick={() => setCategoryType(true)}>Existing</Button>
                        <h3>OR</h3>
                        <Button onClick={() => setCategoryType(false)}>Set New</Button>
                    </div>
                    {categoryType ? (
                        <DarkDropdown title={category} itemsArr={categoriesMap} setFunction={setCategory} />
                    ) :
                        <div style={{ display: 'flex', msFlexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <FormInput
                                label='Product Category'
                                type='text'
                                required
                                onChange={handleChange}
                                name='category'
                                value={category}
                                error={errors.category}
                            />
                            <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                <label style={{ position: 'relative', marginBottom: '20px' }}>Catgory Image</label>
                                {categoryImage.length ?
                                    <img style={{
                                        border: '2px dashed black', margin: '10px',
                                        width: '100%',
                                        height: '100%',
                                        maxWidth: '240px',
                                        maxHeight: '260px',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'cente',
                                    }}
                                        src={categoryImage} />
                                    :
                                    <input
                                        type='file'
                                        required
                                        accept="image/gif, image/jpeg, image/png"
                                        className="custom-file-input"
                                        onChange={categoryImageUpload}
                                    />
                                }

                            </div>
                        </div>
                    }
                </div>
                <label>* The first image will be the template</label>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div className='file-upload'>
                        <div style={{ borderRight: 'solid 4px black', marginTop: '10px', paddingRight: '10px' }}>
                            <input
                                type='file'
                                accept="image/gif, image/jpeg, image/png"
                                className="custom-file-input"
                                multiple
                                onChange={handleFileSelect}
                            />
                        </div>
                        <div className='image-preview'>
                            {imageUrls.length ? imageUrls.map((url) => {
                                return (
                                    <div>
                                        <img style={{
                                            width: '100%',
                                            height: '100%',
                                            maxWidth: '240px',
                                            maxHeight: '260px',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'cente',
                                        }} src={url} />
                                    </div>
                                )
                            }) : <div></div>}
                        </div>
                    </div>
                </div>

                <Button type='submit' onClick={handleSumbit}>Add</Button>
            </form>
        </div>
    )
}

export default AddNew