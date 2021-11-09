import React, { useState, useEffect } from "react";

interface iCustomInput {
    labelText: string;
    placeholder: string;
    id: string;
    name: string;
    register: (arg0: any, arg1: any) => any;
    errors?: any;
    required?: boolean;
    errorMessage?: string;
    format?: any;
    pattern?: string;
}
const CustomInput: React.FC<iCustomInput> = (props) => {
    const {
        labelText, placeholder, id, name, errors, required, errorMessage, register, format
    } = props;

    const errorComponent = (data: string) => {
        return (<div className="form-text error-msg">Please enter {data}</div>);
    }

    const divClassName = () => {
        if (props.required) {
            return ("mb-3 col-6 form-group required");
        }
        else {
            return ("mb-3 col-6 form-group");
        }
    }

    return (
        <div className={divClassName()}>
            <label className="form-label">{labelText}</label>
            <input className="form-control" placeholder={placeholder} {...register(name, { required: required, pattern: format ? format : '' })} id={id} name={name} />
            {errors && errorComponent(errorMessage ? errorMessage : "this field")}
        </div>
    )
}

export default CustomInput;