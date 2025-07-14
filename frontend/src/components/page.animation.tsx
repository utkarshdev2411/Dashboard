'use client';

import { AnimatePresence, motion, TargetAndTransition, Transition, VariantLabels } from 'framer-motion';
import React, { useEffect, useState } from 'react';

type Props = {
  keyValue?: string | number;
  children: React.ReactNode;
  initial?: boolean | TargetAndTransition | VariantLabels;
  animate?: TargetAndTransition | VariantLabels;
  transition?: Transition;
  className?: string;
};

const AnimationWrapper: React.FC<Props> = ({
  keyValue,
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 1 },
  className = '',
}) => {


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