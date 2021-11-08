import { useState } from "react";
import { CustomInputAndLabel } from "./customInputAndLabel";

const OidcClient = () => {
    const initialValues = {
        authorizeUrl: null,
        redirectUrl: null,
        clientId: null,
        scope: null,
        nonce: null,
        state: null,
        responseMode: null
    }
    
    const [values, setValues] = useState(initialValues);
    const [selectedCheckBox, setSelectedCheckBox] = useState(null)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
      };

    const validateUrl = (data) => {
        if(data.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)) {
            return true;
        }
        else {
            return false;
        }
    }

    const validate = () => {
        if(values.authorizeUrl === null) {
            document.getElementById("authorizeUrlHelp").innerHTML = "This field is required";
        }
        else {
            document.getElementById("authorizeUrlHelp").innerHTML = "";
        }
        if(values.redirectUrl === null) {
            document.getElementById("redirectUrlHelp").innerHTML = "This field is required";
        }
        else {
            document.getElementById("redirectUrlHelp").innerHTML = "";
        }
        if(values.clientId === null) {
            document.getElementById("clientIdHelp").innerHTML = "This field is required";
        }
        else {
            document.getElementById("clientIdHelp").innerHTML = "";
        }
        if(values.scope === null) {
            document.getElementById("scopeHelp").innerHTML = "This field is required";
        }
        else {
            document.getElementById("scopeHelp").innerHTML = "";
        }
        if(selectedCheckBox === null) {
            document.getElementById("responseTypeHelp").innerHTML = "This field is required";
        }
        else {
            document.getElementById("responseTypeHelp").innerHTML = "";
        }
        if(values.responseMode === null) {
            document.getElementById("responseModeHelp").innerHTML = "This field is required";
        }
        else {
            document.getElementById("responseModeHelp").innerHTML = "";
        }
    }

    const redirect = () => {
        if((values.authorizeUrl === null) || (values.redirectUrl === null) || (values.clientId === null) || (values.scope === null) || (selectedCheckBox === null) ||(values.responseMode === null)) {
            validate();
        }
        else {
            const validateAuthorizeUrl = validateUrl(values.authorizeUrl)
            if(validateAuthorizeUrl){
                let url = values.authorizeUrl+"?client_id="+values.clientId+"&redirect_uri="+values.redirectUrl+"&scope="+values.scope+"&response_type="+selectedCheckBox+"&response_mode"+values.responseMode+"&nonce="+values.nonce+"&state="+values.state;
                console.log(url);
                window.location.assign(url);
            }
            else {
                document.getElementById("authorizeUrlHelp").innerHTML = "Enter valid url";
            }
        }
    }
    
    const handleCheckBox = (event) => {
        if(selectedCheckBox != null) {
            setSelectedCheckBox(selectedCheckBox + ' ' + event.target.value);
        }
        else {
            setSelectedCheckBox(event.target.value);
        }
    }
    return(
        <div className="container-fluid">
            <form>
                <CustomInputAndLabel
                divClassName="mb-3 col-6 form-group required"
                errorDivId="authorizeUrlHelp"
                labelText="Authorize Url"
                inputId="authorizeUrl"
                onChange={handleInputChange}
                >
                </CustomInputAndLabel>
                <CustomInputAndLabel
                divClassName="mb-3 col-6 form-group required"
                errorDivId="redirectUrlHelp"
                labelText="Redirect Url"
                inputId="redirectUrl"
                onChange={handleInputChange}
                >
                </CustomInputAndLabel>
                <CustomInputAndLabel
                divClassName="mb-3 col-6 form-group required"
                errorDivId="clientIdHelp"
                labelText="Client ID"
                inputId="clientId"
                onChange={handleInputChange}
                >
                </CustomInputAndLabel>
                <CustomInputAndLabel
                divClassName="mb-3 col-6 form-group required"
                errorDivId="scopeHelp"
                labelText="Scope"
                inputId="scope"
                onChange={handleInputChange}
                >
                </CustomInputAndLabel>
                <CustomInputAndLabel
                divClassName="mb-3 col-6 form-group"
                labelText="State"
                inputId="state"
                onChange={handleInputChange}
                >
                </CustomInputAndLabel>
                <CustomInputAndLabel
                divClassName="mb-3 col-6 form-group"
                labelText="Nonce"
                inputId="nonce"
                onChange={handleInputChange}
                >
                </CustomInputAndLabel>
                <div class="mb-3 col-6 form-group required">
                    <label for="responseType" class="form-label">Response type</label><br></br>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="responseType-code" name="responseType-code" value="code" onChange={handleCheckBox}/>
                        <label for="responseType-code" class="form-check-label">code</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="responseType-token" name="responseType-token" value="token" onChange={handleCheckBox}/>
                        <label for="responseType-token" class="form-check-label">token</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="responseType-id_token" name="responseType-id_token" value="id_token" onChange={handleCheckBox}/>
                        <label for="responseTYpe-id_token" class="form-check-label">id_token</label>
                    </div>
                </div>
                <div id="responseTypeHelp" className="form-text error-msg"></div>
                <div class="mb-3 col-6 form-group required">
                    <label for="responseMode" class="form-label">Response mode</label><br></br>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="responseMode-query" name="responseMode-query" value="query" onChange={handleInputChange}/>
                        <label for="responseMode-query" class="form-check-label">query</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="responseMode-formPost" name="responseMode-formPost" value="formPost" onChange={handleInputChange}/>
                        <label for="responseMode-formPost" class="form-check-label">formPost</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="responseMode-fragment" name="responseMode-fragment" value="fragment" onChange={handleInputChange}/>
                        <label for="responseMode-fragment" class="form-check-label">fragment</label>
                    </div>
                </div>
                <div id="responseModeHelp" className="form-text error-msg"></div>
                <div className="mb-3 col-6 form-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={redirect}
                    >
                        Send Request
                    </button>
                </div>
            </form>
      </div>
    );
}

export default OidcClient;