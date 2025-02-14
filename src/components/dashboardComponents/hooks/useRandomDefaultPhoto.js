import { useState } from 'react';

const useRandomDefaultPhoto = () => {
  const defaultPhotos = ['https://i.ibb.co/xHWPrFT/Bear-by-Yangxue.png'];

  const [randomDefaultPhoto, setRandomDefaultPhoto] = useState('');

  const getRandomDefaultPhoto = () => {
    const randomPhoto = defaultPhotos[Math.floor(Math.random() * defaultPhotos.length)];
    setRandomDefaultPhoto(randomPhoto);
  };

  return { randomDefaultPhoto, getRandomDefaultPhoto };
};

export default useRandomDefaultPhoto;
