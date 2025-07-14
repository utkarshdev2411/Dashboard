'use client';

import React from 'react';

type Props = {
  children: React.ReactNode;
};

const AnimationWrapper: React.FC<Props> = ({ children }) => {


  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) return null;
  return (
    <>
    {children}
    </>
  );
};

export default AnimationWrapper;