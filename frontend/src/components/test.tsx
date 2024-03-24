"use client"

import { useState } from "react"


const TestComponent = () => {
    const [a,setB] =  useState("dsds")
    console.log("hyu")
    return <>
        <div><p>dsadasdas</p> {a}</div>
    </>
}

export default TestComponent