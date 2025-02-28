import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const baseTitle = "ADT News";
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
    
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

export default usePageTitle;