import { useNavigate } from 'react-router-dom';
import './directory-item.styles.scss';

const DirectoryItem = ({ category }) => {
  const { imageUrl, title } = category;
  const navigate = useNavigate()

  return (
    <div className='directory-item-container'>
      <div
        className='background-image'
        style={{
          backgroundImage: `url(${imageUrl})`,
          transition: '2s'
        }}
        onClick={() => {
          navigate(`/shop/${title.charAt(0).toUpperCase() + title.slice(1)}`)
        }}
      />
      <div className='body'>
        <h2>{title}</h2>
        <p>Shop Now</p>
      </div>
    </div>
  );
};

export default DirectoryItem;
