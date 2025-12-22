import React from 'react'

const FormTitle = ({ children, bg = 'green' }) => {
    const gradientClasses = {
        green: 'bg-gradient-to-r from-green-600 to-emerald-600',
    }
    
    return (
        <div className={`text-center text-xl md:text-2xl py-4 ${gradientClasses[bg] || gradientClasses.green} text-white rounded-t-xl w-full shadow-lg`}>
            <strong className="font-bold">{children}</strong>
        </div>
    )
}

export default FormTitle
