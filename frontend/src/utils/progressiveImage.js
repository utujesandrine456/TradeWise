import { useState, useEffect } from 'react';

// Instagram-style progressive image loading utility

export const addProgressiveLoading = (imgElement) => {
  if (!imgElement) return;

  // Start with blur
  imgElement.classList.add('progressive-image');
  
  const handleLoad = () => {
    // Remove blur when loaded
    imgElement.classList.add('loaded');
    imgElement.classList.add('image-fade-in');
  };

  const handleError = () => {
    console.error('Image failed to load:', imgElement.src);
    imgElement.classList.remove('progressive-image');
  };

  // Add event listeners
  imgElement.addEventListener('load', handleLoad, { once: true });
  imgElement.addEventListener('error', handleError, { once: true });

  // If image is already loaded
  if (imgElement.complete && imgElement.naturalHeight !== 0) {
    handleLoad();
  }

  return () => {
    imgElement.removeEventListener('load', handleLoad);
    imgElement.removeEventListener('error', handleError);
  };
};

// React hook for progressive loading
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
