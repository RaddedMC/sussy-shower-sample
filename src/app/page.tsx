"use client";

import { useEffect, useState } from "react";
import Switch from "react-switch";
import { Display } from "react-7-segment-display";
import { Donut } from "react-dial-knob";
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import Rainer from "./rainer";
import { cloneDeep } from "lodash";

type userPreset = {
    temp: number,
    pressure: number
}

export default function Home() {

    // NextJS handles variables that are used as *states* differently, but these will be the core states of our program.
    
    // We need 9 LEDs
    const [currentUser, setCurrentUser] = useState(0); // 0 to 8
    const [userLEDs, setUserLEDs] = useState([true, false, false, false, false, false, false, false]);

    // We need two 7-segs
    const [userTemp, setUserTemp] = useState(41);
    const [userPressure, setUserPressure] = useState(0.69);

    const [pressureCold, setPressureCold] = useState(0);
    const [pressureHot, setPressureHot] = useState(0);

    // We need 3 buttons
    const [storeMode, setStoreMode] = useState(false);

    // We need one switch
    const [isOn, setOn] = useState(false);

    // Some memory to save the user's presets
    const [userPresets, setUserPresets] = useState<userPreset[]>([{"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}]);

    useEffect(() => {
        const storageItem = localStorage.getItem("shower.presets");
        setUserPresets(JSON.parse(storageItem || '[{"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}, {"temp": 41, "pressure": 0.69}]'));
    }, []);

    const setLEDsToCurrent = (offset: number)=>{
        const newLEDs = [false, false, false, false, false, false, false, false, false];
        newLEDs[currentUser + offset] = true;
        setUserLEDs(newLEDs);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-orange-200">

            <Rainer numDrops={isOn ? userPressure * 300 : 0}/>

            <div className="m-auto flex flex-col bg-white shadow-xl z-10">
                {/* TOP row -- controls */}
                <div className="flex flex-row p-2 border-black border-solid border-2">
                    <p className=" border-black border-solid border-4 w-48 p-2 m-2"><b>S.U.S.</b> Shower Unification System</p>
                    <div className="flex flex-col m-2 ml-auto mx-4 py-2">
                        <div className={isOn ? "w-4 h-4 rounded-full bg-green-500 mx-auto" : "w-4 h-4 rounded-full bg-red-500 mx-auto"}></div>
                        <p className="mx-auto my-auto">{isOn ? "ON" : "OFF"}</p>
                    </div>
                    <Switch className="mx-4 my-auto" onChange={()=>{setOn(!isOn)}} checked={isOn}/>
                </div>

                {/* Dial module -- pressure */}
                <div className="flex flex-row p-2 border-black border-solid border-2">
                    <div className="my-auto mx-auto flex flex-col items-center">
                        <Donut
                            diameter={50}
                            min={1}
                            max={99}
                            step={1}
                            value={Math.round(userPressure* 100)}
                            onValueChange={(value)=>{
                                setUserPressure(value / 100)
                            }}
                        >
                        </Donut>
                        <p>Pressure</p>
                    </div>
                    <div className="ml-auto">
                        <Display value={Math.round(userPressure * 100)} count={2} height={80} color="red" skew/>
                    </div>
                </div>

                {/* Dial module -- temperature */}
                <div className="flex flex-row p-2 border-black border-solid border-2">
                    <div className="my-auto mx-auto flex flex-col items-center">
                        <Donut
                            diameter={50}
                            min={25}
                            max={47} // Making it hotter than 47 degrees C could burn, we may want to lower this still
                            step={1}
                            value={Math.round(userTemp)}
                            onValueChange={(value)=>{
                                setUserTemp(value);
                            }}
                        >
                        </Donut>
                        <p>Temperature</p>
                    </div>
                    <div className="ml-auto">
                        <Display value={Math.round(userTemp)} count={2} height={80} color="red" skew/>
                    </div>
                </div>

                {/* User controls module */}
                <div className="flex flex-col p-2 border-black border-solid border-2 items-center">
                    <div className="flex flex-row p-2">
                        {/* LEFT button */}
                        <button onClick={()=>{
                            if (currentUser != 0) {
                                setCurrentUser(currentUser - 1);
                                setUserTemp(userPresets[currentUser].temp);
                                setUserPressure(userPresets[currentUser].pressure);
                                setLEDsToCurrent(-1);
                            }
                        }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform active:translate-y-1">&larr;</button>

                        {/* LEDs */}
                        <div className="flex flex-row m-2">
                            {
                                (()=>{
                                    const elements = [];

                                    for (let i = 0; i < 9; i++) {
                                        elements.push(<div key={i} className="flex flex-col items-center mx-1">
                                            <AccessibilityNewIcon className={ userLEDs[i] ? "text-red-500" : ""}/>
                                            <p className={userLEDs[i] ? "text-red-500" : ""}>{i+1}</p>
                                        </div>)
                                    }
                                    
                                    return elements;
                                })()
                            }
                        </div>

                        {/* RIGHT button */}
                        <button onClick={()=>{
                            if (currentUser != 8) {
                                setCurrentUser(currentUser + 1);
                                setUserTemp(userPresets[currentUser + 1].temp);
                                setUserPressure(userPresets[currentUser + 1].pressure);
                                setLEDsToCurrent(1);
                            }
                        }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform active:translate-y-1">&rarr;</button>
                    </div>

                    {/* STORE button */}
                    <button className="bg-gray-300 w-full hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform active:translate-y-1" onClick={()=>{
                        if (!storeMode) {
                            setStoreMode(true);
                        } else {
                            setTimeout(()=>{
                                setLEDsToCurrent(0);
                            }, 500);

                            const tempPresets = cloneDeep(userPresets);
                            tempPresets[currentUser] = {
                                temp: userTemp,
                                pressure: userPressure
                            }
                            setUserPresets(tempPresets);

                            localStorage.setItem("shower.presets", JSON.stringify(tempPresets));

                            setStoreMode(false);
                        }
                    }}>STORE</button>
                </div>
            </div>
            { storeMode ? <ButtonBlinker currentUser={currentUser} setUserLEDs={setUserLEDs} blinkInterval={500}/> : <></>}
        </main>
    );
}

function ButtonBlinker(props: {currentUser: number, setUserLEDs: (value: boolean[])=>void, blinkInterval: number}) {

    const [reblinkState, setReblinkState] = useState(false); // Just alternates, used to retrigger the useeffect so the newest user is applied

    const turnOffLEDs = ()=>{
        console.log("turning off LEDs");
        const newLEDs = [false, false, false, false, false, false, false, false, false];
        newLEDs[props.currentUser] = true;
        props.setUserLEDs(newLEDs);

        setTimeout(()=>{
            turnOnLEDs();
        }, props.blinkInterval);
    }

    const turnOnLEDs = ()=>{
        console.log("turning on LEDs");
        props.setUserLEDs([true, true, true, true, true, true, true, true, true]);
        setTimeout(()=>{
            setReblinkState(!reblinkState);
        }, props.blinkInterval);
    }

    useEffect(()=>{turnOffLEDs();}, [reblinkState]);

    return <></>
}