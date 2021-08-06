import { useEffect, useRef, useState } from "react";
import XMLViewer from "react-xml-viewer";
import useDebounce from "./useDebounce";

const initialValues = {
    entityID: null,
    signOnService: null,
    logoutService: null,
    nameId: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
    authnRequestNeeded: false,
    organisationName: null,
    organisationDisplayName: null,
    organisationUrl: null,
    tecnicalContactName: null,
    tecnicalContactEmail: null,
    supportContactName: null,
    supportContactEmail: null,
  };

const BuildMetadata = ()=> {
    const [xml, setXml] = useState(null);
    const [certificate, setCertificate] = useState(null)
    const [cert, setCert] = useState("");
    const input = useRef();
    const [values, setValues ] = useState(initialValues);
    const debounce = useDebounce();
    const { REACT_APP_BACKEND_URL } = process.env;

    useEffect(()=> {
        if(cert !== " " || cert !== null) {
            fetch(`${REACT_APP_BACKEND_URL}/formatCertificate`, {
                method: 'POST',
                type: 'CORS',
                body: cert
            })
            .then(res=> res.json())
            .then(data => setCertificate(data.certificate))
        }
        
    }, [cert])

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        }); 
    }
    
    const handleCert = (e)=> {
        let certificate_value = e.target.value;
        if(certificate_value !== null) {
            debounce(()=> setCert(certificate_value), 400);
        }
        console.log(cert);   
    }

    const generateMetadata =(e)=>{
        e.preventDefault();
        let metadata = {
            "entityId": values.entityID,
            "signOnService": values.signOnService,
            "logoutService": values.logoutService,
            "certificate": certificate,
            "nameId": values.nameId,
            "authnRequesteNeeded": values.authnRequestNeeded,
            "organisationName": values.organisationName,
            "organisationDisplayName": values.organisationDisplayName,
            "organisationurl": values.organisationUrl,
            "tecnicalContactName": values.tecnicalContactName,
            "tecnicalContactEmail": values.tecnicalContactEmail,
            "supportContactName": values.supportContactName,
            "supportContactEmail": values.supportContactEmail
        }
        console.log(metadata)
        if(values.entityID === null || values.signOnService === null || certificate === null) {
            if(values.entityID === null){
                document.getElementById('entityId').innerHTML = "This field is required"
            }
            if(values.signOnService === null){
                document.getElementById('sso').innerHTML = "This field is required"
            }
            if(certificate === null){
                document.getElementById('cert').innerHTML = "This field is required"
            }
        }else{
            formataDataToXml(metadata);
        }
    }
    const formataDataToXml = (metadata)=> {
        if(metadata.entityId.length < 1 || metadata.signOnService.length < 1 || metadata.certificate.length < 1){
            return "entity id is required";
        }else{
            let xml = `<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${metadata.entityId}">
            <md:IDPSSODescriptor WantAuthnRequestsSigned="${metadata.authnRequesteNeeded}" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
            <md:KeyDescriptor use="signing">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:X509Data>
            <ds:X509Certificate>${metadata.certificate}</ds:X509Certificate>
            </ds:X509Data>
            </ds:KeyInfo>
            </md:KeyDescriptor>`
            if(metadata.logoutService != null) {
                xml = xml + `<md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${metadata.logoutService}"/>`
            }
            if(metadata.nameId != null) {
                xml = xml + `<md:NameIDFormat>${metadata.nameId}</md:NameIDFormat>`
            }
            xml = xml + `<md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${metadata.signOnService}"/></md:IDPSSODescriptor>`

            if(metadata.organisationName != null || metadata.organisationDisplayName != null || metadata.setOrganisationUrl != null) {
                xml = xml + `<md:Organization>`;
                if(metadata.organisationName != null){
                    xml = xml + `<md:OrganizationName xml:lang="en-US">${metadata.organisationName}</md:OrganizationName>`
                }
                if(metadata.organisationDisplayName != null) {
                    xml = xml + `<md:OrganizationDisplayName xml:lang="en-US">${metadata.organisationDisplayName}</md:OrganizationDisplayName>`
                }
                if(metadata.organisationUrl != null) {
                    xml = xml + `<md:OrganizationURL xml:lang="en-US">${metadata.organisationUrl}</md:OrganizationURL>`
                }
                xml = xml + `</md:Organization>`
            }
            if(metadata.tecnicalContactName != null || metadata.tecnicalContactEmail != null){
                xml = xml + `<md:ContactPerson contactType="tecnical">`
                if(metadata.tecnicalContactName != null){
                    xml = xml + `<md:GivenName>${metadata.tecnicalContactName}</md:GivenName>`
                }
                if(metadata.tecnicalContactEmail != null){
                    xml = xml + `<md:EmailAddress>${metadata.tecnicalContactEmail}</md:EmailAddress>`
                }
                xml = xml + `</md:ContactPerson>`
            }
            if(metadata.supportContactEmail != null || metadata.supportContactName != null){
                xml = xml + `<md:ContactPerson contactType="support">`
                if(metadata.supportContactName != null){
                    xml = xml + `<md:GivenName>${metadata.supportContactName}</md:GivenName>`
                }
                if(metadata.supportContactEmail != null){
                    xml = xml + `<md:EmailAddress>${metadata.supportContactEmail}</md:EmailAddress>`
                }
                xml = xml + `</md:ContactPerson>`
            }
            xml = xml + `</md:EntityDescriptor>`
            setXml(xml)
        }
    }
    return (<div className="container">
        <form classNameName="form-group">
            <div classNameName="form-group">
                <label for="Entity Id" className="col-sm-2 control-label">Entity Id <span>*</span></label>
                <div className="col-sm-4">
                    <input name="entityID" ref={input} type="text" className="form-control" id="input" placeholder="Entity Id" onChange={(e)=>{handleInputChange(e)}} required />
                </div>
                <span id="entityId"></span>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="SingleSignOnService" className="col-sm-2 control-label">Single Sign On Service End point <span>*</span></label>
                <div className="col-sm-4">
                    <input name="signOnService" ref={input} type="text" className="form-control" id="input" placeholder="Single Sign on Service" onChange={(e)=>{handleInputChange(e)}}/>
                </div>
                <span id="sso"></span>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Single logout service end point</label>
                <div className="col-sm-4">
                    <input ref={input} name="logoutService" type="text" className="form-control" id="input" placeholder="Single logout service" onChange={(e)=>{handleInputChange(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">SP X.509 cert (same cert for sign/encrypt) <span>*</span></label>
                <div className="col-sm-4">
                    <textarea ref={input} name="certificate" type="text" className="form-control" id="certificate" placeholder="Certificate" onChange={(e)=>{handleCert(e)}}/>
                </div>
                <span id="cert"></span>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="NameId Format" className="col-sm-2 control-label">NameId Format</label>
                <div className="col-sm-4">
                    <select name="nameId" onChange={(e)=>{handleInputChange(e)}}>
                        <option >urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</option>
                        <option >urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</option>
                        <option >urn:oasis:names:tc:SAML:1.1:nameid-format:entity</option>
                        <option>urn:oasis:names:tc:SAML:1.1:nameid-format:transient</option>
                        <option>urn:oasis:names:tc:SAML:1.1:nameid-format:persistent</option>
                        <option>urn:oasis:names:tc:SAML:1.1:nameid-format:encrypted</option>
                    </select>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType"  className="col-sm-2 control-label">WantAuthnRequestsSigned</label>
                <div className="col-sm-4">
                    <select name= "authnRequesteNeeded"  onChange={(e)=>{handleInputChange(e)}} >
                        <option >True</option>
                        <option selected >False</option>
                    </select>
                </div>
            </div>
            <br/>
            <br/>
            <label for="organisation info" className="col-sm-4">ORGANISATION INFO(optional)</label>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Organisation Name</label>
                <div className="col-sm-4">
                    <input name="organisationName" ref={input} type="text" className="form-control" id="input" placeholder="Organisation Name" onChange={(e)=>{handleInputChange(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Organisation Display Name</label>
                <div className="col-sm-4">
                    <input name="organisationDisplayName" ref={input} type="text" className="form-control" id="input" placeholder="organisation display name" onChange={(e)=>{handleInputChange(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Organisation Url</label>
                <div className="col-sm-4">
                    <input name="organisationurl" ref={input} type="text" className="form-control" id="input" placeholder="organisation url" onChange={(e)=>{handleInputChange(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <label className="col-sm-4 control-label">TECHNICAL CONTACT(optional)</label>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Given Name</label>
                <div className="col-sm-4">
                    <input name="tecnicalContactName" ref={input} type="text" className="form-control" id="input" placeholder="Name" onChange={(e)=>{handleInputChange(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Email</label>
                <div className="col-sm-4">
                    <input ref={input} name="tecnicalContactEmail" type="text" className="form-control" id="input" placeholder="Email" onChange={(e)=>{handleInputChange(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <label className="col-sm-4 control-label">SUPPORT CONTACT(optional)</label>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Given Name</label>
                <div className="col-sm-4">
                    <input name="supportContactName" ref={input} type="text" className="form-control" id="input" placeholder="Support Name" onChange={(e)=>{handleInputChange(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Email</label>
                <div className="col-sm-4">
                    <input name="supportContactEmail" ref={input} type="text" className="form-control" id="input" placeholder="Email" onChange={(e)=>{handleInputChange(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="col-sm-2">
            <button className="btn btn-primary btn-center" onClick={(e)=>{generateMetadata(e)}}>Build IDP Metadata</button>
            </div>
        </form>
        <br/>
        <br/>
        <div>
            {xml != null ? <p><XMLViewer  xml={xml}/></p> : null}
        </div>
    </div>)
}
export default BuildMetadata
