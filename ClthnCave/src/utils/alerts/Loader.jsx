import { useEffect, useState, useContext } from 'react';
import { CategoriesContext } from '../../contexts/categories.context';
import './utils.styles.scss';

export const Loader = () => {
    const [result, setResult] = useState(0);
    const { categoriesMap } = useContext(CategoriesContext)

    useEffect(() => {

        if (categoriesMap.length) {
            setResult(0)
        } else {
            setTimeout(() => setResult(1), 5000)
        }
    }, [categoriesMap])

    return (
        <>
            {result ?
                <></> :
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            }
        </>
    )



}
export default Loader;
