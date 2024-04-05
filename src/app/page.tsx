"use client";

import { useState } from "react";
import Switch from "react-switch";
import { Display } from "react-7-segment-display";
import { Donut } from "react-dial-knob";

export default function Home() {

    // NextJS handles variables that are used as *states* differently, but these will be the core states of our program.
    
    // We need 9 LEDs
    const [currentUser, setCurrentUser] = useState(0); // 0 to 8

    // We need two 7-segs
    const [userTemp, setUserTemp] = useState(41);
    const [userPressure, setUserPressure] = useState(0.69);

    const [actualTemp, setActualTemp] = useState(25);
    const [actualPressure, setActualPressure] = useState(0);

    // We need 3 buttons

    // We need one switch
    const [isOn, setOn] = useState(false);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="m-auto flex flex-col">

                {/* TOP row -- controls */}
                <div className="flex flex-row p-2 border-black border-solid border-2">
                    <p className=" border-black border-solid border-4 w-48 p-2 m-2"><b>S.U.S.</b> Shower Unification System</p>
                    <div className="flex flex-col m-2 mx-4 py-2">
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
                            onValueChange={(value)=>{setUserPressure(value / 100)}}
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
                            onValueChange={setUserTemp}
                        >
                        </Donut>
                        <p>Temperature</p>
                    </div>
                    <div className="ml-auto">
                        <Display value={Math.round(userTemp)} count={2} height={80} color="red" skew/>
                    </div>
                </div>

                {/* User controls module */}
                <div className="flex flex-col p-2 border-black border-solid border-2">
                    {/* User select buttons */}
                    <div>

                    </div>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform active:translate-y-1">STORE</button>
                </div>
            </div>
        </main>
    );
}
