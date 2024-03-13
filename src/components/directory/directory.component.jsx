import DirectoryItem from '../directory-item/directory-item.component';

import './directory.styles.scss';

const Directory = ({ categories }) => {
  return (
    <div className='directory-container'>
      {categories.length ? categories.map((category) => (
        <DirectoryItem category={category.category} />
      )) : <></>}
    </div>
  );
};

export default Directory;
