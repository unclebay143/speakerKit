"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function generateRandomPath(dimensions: { width: number; height: number }) {
  return {
    x: [
      Math.random() * dimensions.width,
      Math.random() * dimensions.width,
      Math.random() * dimensions.width,
    ],
    y: [
      Math.random() * dimensions.height,
      Math.random() * dimensions.height,
      Math.random() * dimensions.height,
    ],
    rotate: [0, 180, 360],
    duration: 20 + Math.random() * 10,
  };
}

export function FloatingPaper({ count = 5 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isClient, setIsClient] = useState(false);
  const [randomValues, setRandomValues] = useState<
    Array<{ x: number; y: number }>
  >([]);
  const [paths, setPaths] = useState<
    Array<{ x: number[]; y: number[]; rotate: number[]; duration: number }>
  >([]);

  useEffect(() => {
    setIsClient(true);

    const generateRandomPositions = () => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }));
    };

    setRandomValues(generateRandomPositions());
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Generate stable animation paths for each item
    setPaths(
      Array.from({ length: count }, () =>
        generateRandomPath({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      )
    );

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setRandomValues(generateRandomPositions());
      setPaths(
        Array.from({ length: count }, () =>
          generateRandomPath({
            width: window.innerWidth,
            height: window.innerHeight,
          })
        )
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [count]);

  return (
    <div className='relative w-full h-full'>
      {Array.from({ length: count }).map((_, i) => {
        if (!isClient || randomValues.length === 0 || paths.length === 0) {
          return (
            <div key={i} className='absolute w-16 h-20 opacity-0'>
              <div className='relative w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center'>
                <div className='w-8 h-8 bg-purple-400/50 rounded-full flex items-center justify-center'>
                  <span className='text-xs text-white font-bold'>Kit</span>
                </div>
              </div>
            </div>
          );
        }

        const currentValues = randomValues[i] || { x: 0, y: 0 };
        const path = paths[i];

        return (
          <motion.div
            key={i}
            className='absolute'
            initial={{
              x: currentValues.x,
              y: currentValues.y,
            }}
            animate={{
              x: path.x,
              y: path.y,
              rotate: path.rotate,
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className='relative w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform'>
              <div className='w-8 h-8 bg-purple-400/50 rounded-full flex items-center justify-center'>
                <span className='text-xs text-white font-bold'>Kit</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
