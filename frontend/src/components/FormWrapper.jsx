import React from 'react'
import FormTitle from './FormTitle'
const FormWrapper = ({ title = "", children }) => {
    return (
        <div className="pb-5 shadow-sm grid gap-6 mt-6">
            <FormTitle>{title}</FormTitle>
            {children}
        </div>
    )
}

export default Form
