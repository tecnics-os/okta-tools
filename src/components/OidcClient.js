import { useState } from "react";

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
    const redirect = () => {
        if((values.authorizeUrl === null) || (values.redirectUrl === null) || (values.clientId === null) || (values.scope === null) || (selectedCheckBox === null) ||(values.responseMode === null)) {
            if(values.authorizeUrl === null) {
                document.getElementById("authorizeUrlHelp").innerHTML = "This field is required";
            }
            if(values.redirectUrl === null) {
                document.getElementById("redirectUrlHelp").innerHTML = "This field is required";
            }
            if(values.clientId === null) {
                document.getElementById("clientIdHelp").innerHTML = "This field is required";
            }
            if(values.scope === null) {
                document.getElementById("scopeHelp").innerHTML = "This field is required";
            }
            if(selectedCheckBox === null) {
                document.getElementById("responseTypeHelp").innerHTML = "This field is required";
            }  
            if(values.responseMode === null) {
                document.getElementById("responseModeHelp").innerHTML = "This field is required";
            }  
        }
        else {
            let url = values.authorizeUrl+"?client_id="+values.clientId+"&redirect_uri="+values.redirectUrl+"&scope="+values.scope+"&response_type="+selectedCheckBox+"&response_mode"+values.responseMode+"&nonce="+values.nonce+"&state="+values.state;
            console.log(url);
            window.open(url);
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
                <div class="mb-3 col-6 form-group required">
                    <label for="authorizeUrl" className="form-label">Authorize Url</label>
                    <input type="text" id="authorizeUrl" name="authorizeUrl" class="form-control" placeholder="Authorize Url"
                    onChange={(e) => {handleInputChange(e);}} required />
                </div>
                <div id="authorizeUrlHelp" className="form-text error-msg"></div>
                <div class="mb-3 col-6 form-group required">
                    <label for="redirectUrl" className="form-label">Redirect Url</label>
                    <input type="text" id="redirectUrl" name="redirectUrl" class="form-control" placeholder="Redirect Url"
                    onChange={(e) => {handleInputChange(e);}} required />
                </div>
                <div id="redirectUrlHelp" className="form-text error-msg"></div>
                <div class="mb-3 col-6 form-group required">
                    <label for="clientId" className="form-label">Client ID</label>
                    <input type="text" id="clientId" name="clientId" class="form-control" placeholder="Client ID"
                    onChange={(e) => {handleInputChange(e);}} required/>
                </div>
                <div id="clientIdHelp" className="form-text error-msg"></div>
                <div class="mb-3 col-6 form-group required">
                    <label for="scope" className="form-label">Scope</label>
                    <input type="text" id="scope" name="scope" class="form-control" placeholder="Scope"
                    onChange={(e) => {handleInputChange(e);}} required />
                </div>
                <div id="scopeHelp" className="form-text error-msg"></div>
                <div class="mb-3 col-6 form-group">
                    <label for="state" className="form-label">State</label>
                    <input type="text" id="state" name="state" class="form-control" placeholder="State"
                    onChange={(e) => {handleInputChange(e);}}/>
                </div>

                <div class="mb-3 col-6 form-group">
                    <label for="nonce" className="form-label">Nonce</label>
                    <input type="text" id="nonce" name="nonce" class="form-control" placeholder="Nonce"
                    onChange={(e) => {handleInputChange(e);}}/>
                </div>
                <div class="mb-3 col-6 form-group required">
                    <label for="responseType" class="form-label">Response type</label><br></br>
                    <div className="form-check form-check-inline">
                        <input onChange={handleCheckBox} className="form-check-input" type="checkbox" id="responseType-code" value="code"/>
                        <label className="form-check-label" for="responseType-code" class="select-label">code &nbsp;</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onChange={handleCheckBox} className="form-check-input" type="checkbox" id="responseType-token" value="token"/>
                        <label className="form-check-label" for="responseType-token" class="select-label">token &nbsp;</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onChange={handleCheckBox} className="form-check-input" type="checkbox" id="responseType-id_token" value="id_token"/>
                        <label className="form-check-label" for="responseType-id_token" class="select-label">id_token &nbsp;</label>
                    </div>
                </div>
                <div id="responseTypeHelp" className="form-text error-msg"></div>
                <div class="mb-3 col-6 form-group required">
                    <label for="responseMode" class="form-label">Response mode</label><br></br>
                    <div className="form-check form-check-inline">
                        <input onChange={handleInputChange} className="form-check-input" type="radio" id="responseMode-query" name="responseMode" value="query"/>
                        <label className="form-check-label" for="responseMode-query" class="select-label">query</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onChange={handleInputChange} className="form-check-input" type="radio" id="responseMode-formPost" name="responseMode" value="form_post"/>
                        <label className="form-check-label" for="responseMode-formPost" class="select-label">form_post</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onChange={handleInputChange} className="form-check-input" type="radio" id="responseMode-fragment" name="responseMode" value="fragment"/>
                        <label className="form-check-label" for="responseMode-fragment" class="select-label">fragment</label>
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