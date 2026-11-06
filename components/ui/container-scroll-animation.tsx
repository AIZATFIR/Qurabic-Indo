'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';

interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
}

export const ContainerScroll = ({
  titleComponent,
  children,
  compact = false,
}: ContainerScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [isMobile, setIsMobile] = React.useState(false);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const shouldAnimate = !isMobile && !reduceMotion;
  const rotate = useTransform(scrollYProgress, [0, 0.6], shouldAnimate ? [18, 0] : [0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], shouldAnimate ? [1.05, 1] : [1, 1]);
  const translate = useTransform(scrollYProgress, [0, 0.6], shouldAnimate ? [0, -40] : [0, 0]);

  return (
    <div
      className={`flex items-center justify-center relative p-2 md:p-16 ${compact ? 'h-[35rem] md:h-[46rem]' : 'h-[60rem] md:h-[75rem]'}`}
      ref={containerRef}
    >
      <div
        className="py-10 md:py-20 w-full relative"
        style={{
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} compact={compact}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center px-4"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  compact = false,
  children,
}: {
  rotate: any;
  scale: any;
  translate: any;
  compact?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
      className={`max-w-5xl -mt-12 mx-auto w-full p-2 md:p-6 bg-canvas-surface/90 backdrop-blur-md border border-hairline rounded-[30px] shadow-2xl overflow-hidden ${compact ? 'h-[21rem] md:h-[29rem]' : 'h-[30rem] md:h-[40rem]'}`}
    >
      <div className="bg-canvas-page h-full w-full rounded-2xl overflow-hidden border border-hairline/80 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};
