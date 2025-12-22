import React, { useEffect } from 'react'

const Alert = ({ error, setError }) => {

    // const [show, setShow] = useState(false);   // Controls mounting
    // const [animateIn, setAnimateIn] = useState(false); // Controls animation
    if (!error) return
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(false)
            }, 10000); // Trigger animation
        }
    }, [error]);


    return (
        <div className={` w-full flex justify-center `}>
            <ul className="list-none list-inside space-y-1  text-sm text-red-800 rounded-lg bg-red-200  px-4 py-2 w-full">
                {Array.isArray(error) ?
                    error.map((msg, index) => (
                        <li key={index} className="w-full  text-center">{msg}</li>
                    )) :
                    <p className='text-center'>{error}</p>
                }
            </ul>
        </div>
    )
}

export default Alert
