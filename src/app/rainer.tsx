'use client';
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import {cloneDeep} from "lodash";

export default function Rainer(props: {numDrops: number}) {
    const [rain, setRain] = useState<ReactNode[]>([]);
    const {width, height} = useWindowDimensions();

    useEffect(()=>{
        console.log(`Rain amount changed! Current rain: ${rain.length}, New rain: ${props.numDrops}`);
        if (rain.length > props.numDrops) {
            console.log("Remove rain!");
            rain.splice(-(rain.length - props.numDrops));
        } else {
            console.log("Add rain!");
            const newRain = [];
            for (let i = 0; i < (props.numDrops - rain.length); i++) {
                newRain.push(<Rain numDrops={props.numDrops} width={width}/>);
            }
            rain.push(...newRain);
        }
    }, [props.numDrops]);

    return <div className="h-screen w-screen absolute top-0 left-0 overflow-clip">
        {
            rain
        }
    </div>
}

function Rain(props: {numDrops: number, width: number}) {
    return <motion.div animate={{y:1100}} transition={{ ease: "linear", repeatType: "loop", repeat: Infinity, duration: Math.random() + 1, delay: Math.random() * 2}} className="absolute -top-28 left-0 bg-gradient-to-b from-blue-300 to-blue-800 w-1 h-24" style={{
        left: (props.width / props.numDrops) * Math.round(Math.random() * props.numDrops)
    }}/>
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}