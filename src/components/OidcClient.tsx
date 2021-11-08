import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';
import CustomInput from "./CustomInput";
// import * as ReactDOM from 'react-dom';
import * as dotenv from 'dotenv';
// dotenv.config({ path: 'okta-tools/src/.env' });

const OidcClient = () => {

    type FormValues = {
        authorizeUri: string;
        redirectUri: string;
        clientId: string;
        scope: string;
        state: string;
        nonce: string;
        uriValidationError: string;
        // responseType: string;
        // responseMode: string;
    };
    const redirectUrl = process.env.REACT_APP_OIDC_CLIENT_REDIRECT_URL;
    console.log(redirectUrl);

    const preloadedValues = {
        redirectUri: redirectUrl
    };
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ mode: "onBlur", reValidateMode: "onChange", defaultValues: preloadedValues });

    const [selectedCheckbox, setSelectedCheckbox] = useState('');
    const [selectedRadioButton, setSelectedRadioButton] = useState('');
    const [checkboxErrorMessage, setCheckboxErrorMessage] = useState(false);
    const [radioButtonErrorMessage, setRadioButtonErrorMessage] = useState(false);
    const [showUriValidationErrorMessage, setShowUriValidationErrorMessage] = useState(false);
    function errorComponent(data: string) {
        return (<div className="form-text error-msg">Please enter {data}</div>);
    }

    const handleCheckbox = (event: any) => {
        if (selectedCheckbox.length > 0) {
            setSelectedCheckbox(selectedCheckbox + ' ' + event.target.value);
        }
        else {
            setSelectedCheckbox(event.target.value);
        }
    };

    const handleRadioButton = (event: any) => {
        setSelectedRadioButton(event.target.value);
    }

    const isDataValid = () => {
        let flag = false;
        if (selectedCheckbox === '') {
            setCheckboxErrorMessage(true);
            flag = true;
        }
        if (selectedRadioButton === '') {
            setRadioButtonErrorMessage(true);
            flag = true;
        }
        if (flag) {
            return false;
        }
        return true;
    }

    const resetErrorMessages = () => {
        setCheckboxErrorMessage(false);
        setRadioButtonErrorMessage(false);
        setShowUriValidationErrorMessage(false);
    }

    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    const validateUri = (data: string) => {
        if (data.match(regex)) {
            return true;
        }
        else {
            setShowUriValidationErrorMessage(true);
            return false;
        }
    }

    const onSubmit = (data: any) => {
        resetErrorMessages();
        if (!isDataValid()) {
            return;
        }
        var authorizeUriValidation = validateUri(data.authorizeUri);
        if (authorizeUriValidation) {
            const url = `${data.authorizeUri}?client_id=${data.clientId}&redirect_uri=${data.redirectUri}&scope=${data.scope}
            &response_type=${selectedCheckbox}&response_mode=${selectedRadioButton}&state=${data.state}&nonce=${data.nonce}`;
            window.location.assign(url);
        }
        else {
            // console.log("Hello");
            // console.log(showUriValidationErrorMessage);
        }
    }

    return (
        <div id="oidc-client" className="container-fluid">
            <form onSubmit={handleSubmit(onSubmit)}>
                <CustomInput
                    labelText={"Authorize URI"}
                    placeholder={"Enter Authorize URI"}
                    id={"authorizeUri"}
                    name={"authorizeUri"}
                    register={register}
                    errors={errors.authorizeUri}
                    required={true}
                    errorMessage={"valid Authorize URI"}
                    format={regex}
                ></CustomInput>
                <CustomInput
                    labelText={"Redirect URI"}
                    placeholder={"Enter Redirect URI"}
                    id={"redirectUri"}
                    name={"redirectUri"}
                    register={register}
                    errors={errors.redirectUri}
                    required={true}
                    errorMessage={"valid Redirect URI"}
                // format={regex}
                ></CustomInput>
                <CustomInput
                    labelText={"Client ID"}
                    placeholder={"Enter Client ID"}
                    id={"clientId"}
                    name={"clientId"}
                    register={register}
                    errors={errors.clientId}
                    required={true}
                    errorMessage="Client ID"
                ></CustomInput>
                <CustomInput
                    labelText={"Scope"}
                    placeholder={"Enter Scope"}
                    id={"scope"}
                    name={"scope"}
                    register={register}
                    errors={errors.scope}
                    required={true}
                    errorMessage="Scope"
                ></CustomInput>
                <CustomInput
                    labelText={"State"}
                    placeholder={"Enter State"}
                    id={"state"}
                    name={"state"}
                    register={register}
                    errors={errors.state}
                    required={false}
                    errorMessage="State"
                ></CustomInput>
                <CustomInput
                    labelText={"Nonce"}
                    placeholder={"Enter Nonce"}
                    id={"nonce"}
                    name={"nonce"}
                    register={register}
                    errors={errors.nonce}
                    required={false}
                    errorMessage="Nonce"
                ></CustomInput>
                <div className="mb-3 col-6 form-group required" id="responseType">
                    <label htmlFor="responseType" className="form-label">
                        Response Type
                    </label><br></br>
                    <div className="form-check form-check-inline">
                        <input onChange={handleCheckbox} className="form-check-input" type="checkbox" id="responseType-code" value="code" />
                        <label className="form-check-label" htmlFor="responseType-code" id="code">code &nbsp;</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onChange={handleCheckbox} className="form-check-input" type="checkbox" id="responseType-token" value="token" />
                        <label className="form-check-label" htmlFor="responseType-token" id="token">token &nbsp;</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onChange={handleCheckbox} className="form-check-input" type="checkbox" id="responseType-idToken" value="id_token" />
                        <label className="form-check-label" htmlFor="responseType-idToken" id="idToken">id_token</label>
                    </div>
                    {checkboxErrorMessage && errorComponent("Response Type")}
                </div>
                <div className="mb-3 col-6 form-group required" id="responseMode">
                    <label htmlFor="responseMode" className="form-label">
                        Response Mode
                    </label><br></br>
                    <div className="form-check form-check-inline">
                        <input onChange={handleRadioButton} className="form-check-input" type="radio" name="responseMode" id="responseMode-query" value="query" />
                        <label className="form-check-label" htmlFor="responseMode-query" id="query">query &nbsp;</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onChange={handleRadioButton} className="form-check-input" type="radio" name="responseMode" id="responseMode-formPost" value="form_post" />
                        <label className="form-check-label" htmlFor="responseMode-formPost" id="formPost">form_post &nbsp;</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onChange={handleRadioButton} className="form-check-input" type="radio" name="responseMode" id="responseMode-fragment" value="fragment" />
                        <label className="form-check-label" htmlFor="responseMode-fragment" id="fragment">fragment</label>
                    </div>
                    {radioButtonErrorMessage && errorComponent("Response Mode")}
                </div>
                <div className="mb-3 col-6 form-group">
                    <button
                        className="btn btn-primary"
                    >
                        Send Request
                    </button>
                </div>
            </form>
        </div >
    )
}

export default OidcClient;

