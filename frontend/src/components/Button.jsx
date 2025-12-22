import React from 'react'
import Spinner from './Spinner'
const Button = ({ isLoading = false, bgColor = "green", color = "white", type = 'submit', onClick = null, children, className = "" }) => {
    const colorClasses = {
        green: isLoading 
            ? "bg-green-400 cursor-not-allowed" 
            : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl",
    }
    
    return (
        <button 
            disabled={isLoading}
            onClick={onClick}
            type={type}
            className={`flex items-center justify-center gap-2 text-${color} ${colorClasses[bgColor] || colorClasses.green} focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-xl text-sm w-full px-6 py-3 text-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
        >
            {!isLoading ? <span>{children}</span> :
                <React.Fragment>
                    <Spinner size="small" color={color} />
                    <span>Loading...</span>
                </React.Fragment>}
        </button>
    )
}

export default Button
