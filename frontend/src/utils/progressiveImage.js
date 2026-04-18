import { useState, useEffect } from 'react';

export const addProgressiveLoading = (imgElement) => {
  if (!imgElement) return;

  imgElement.classList.add('progressive-image');
  
  const handleLoad = () => {
    imgElement.classList.add('loaded');
    imgElement.classList.add('image-fade-in');
  };

  const handleError = () => {
    console.error('Image failed to load:', imgElement.src);
    imgElement.classList.remove('progressive-image');
  };

  imgElement.addEventListener('load', handleLoad, { once: true });
  imgElement.addEventListener('error', handleError, { once: true });

  if (imgElement.complete && imgElement.naturalHeight !== 0) {
    handleLoad();
  }

  return () => {
    imgElement.removeEventListener('load', handleLoad);
    imgElement.removeEventListener('error', handleError);
  };
};

export const useProgressiveImage = (src) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsError(true);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoaded, isError };
};
