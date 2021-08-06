import { useEffect, useRef, useState } from "react";
import XMLViewer from "react-xml-viewer";
import useDebounce from "./useDebounce";

const BuildMetadata = ()=> {
    const [xml, setXml] = useState(null);
    const [entityID, setEntityId] = useState(null);
    const [signOnService, setSignOnService] = useState(null)
    const [logoutService, setLogoutService] = useState(null)
    const [certificate, setCertificate] = useState(null)
    const [nameId, setNameId] = useState(null)
    const [authnRequestNeeded, setAuthnRequestNeeded] = useState(true)
    const [organisationName, setOrganisationName ] = useState(null)
    const [organisationDisplayName, setOrganisationDisplayName] = useState(null)
    const [organisationUrl, setOrganisationUrl] = useState(null)
    const [tecnicalContactName, setTecnicalContactName] = useState(null)
    const [tecnicalContactEmail, setTecnicalContactEmail] = useState(null)
    const [supportContactName, setSupportContactName] = useState(null);
    const [supportContactEmail, setSupportContactEmail] = useState(null);
    const [cert, setCert] = useState("");
    const input = useRef();
    const debounce = useDebounce();
    const { REACT_APP_BACKEND_URL } = process.env;

    useEffect(()=> {
        fetch(`${REACT_APP_BACKEND_URL}/formatCertificate`, {
            method: 'POST',
            type: 'CORS',
            body: cert
        })
        .then(res=> res.json())
        .then(data => setCertificate(data.certificate))
    }, [cert, REACT_APP_BACKEND_URL])

    const handleEntityId = (e)=> {
        setEntityId(e.target.value)
    }
    const handleSignOn = (e)=> {
        setSignOnService(e.target.value)
    }
    const handleLogout = (e)=> {
        setLogoutService(e.target.value)
    }
    const handleCert = (e)=> {
        let certificate_value = e.target.value;
        debounce(()=> setCert(certificate_value), 1000)        
    }
    const handleNameId = (e)=> {
        setNameId(e.target.value)
    }
    const handleAuthn = (e)=> {
        if(e.target.value !== undefined) {
            setAuthnRequestNeeded(e.target.value)
        }
    }
    const handleOrganization = (e) => {
        setOrganisationName(e.target.value);
    }

    const handleOrganizationDisplayName = (e) => {
        setOrganisationDisplayName(e.target.value)
    }

    const handleOrganizationUrl = (e)=> {
        setOrganisationUrl(e.target.value);
    }

    const handleTecnicalContactName = (e)=> {
        setTecnicalContactName(e.target.value)
    }
    const handleTecnicalEmail = (e)=> {
        setTecnicalContactEmail(e.target.value)
    }

    const handleSupportName = (e)=> {
        setSupportContactName(e.target.value);
    }
    const handleSupportEmail = (e)=> {
        setSupportContactEmail(e.target.value)
    }

    const generateMetadata =(e)=>{
        e.preventDefault();
        input.current.value = null
        let metadata = {
            "entityId": entityID,
            "signOnService": signOnService,
            "logoutService": logoutService,
            "certificate": certificate,
            "nameId": nameId,
            "authnRequesteNeeded": authnRequestNeeded,
            "organisationName": organisationName,
            "organisationDisplayName": organisationDisplayName,
            "organisationurl": organisationUrl,
            "tecnicalContactName": tecnicalContactName,
            "tecnicalContactEmail": tecnicalContactEmail,
            "supportContactName": supportContactName,
            "supportContactEmail": supportContactEmail
        }
        
        if(entityID === null || signOnService === null || certificate === null) {
            if(entityID === null){
                document.getElementById('entityId').innerHTML = "This field is required"
            }
            if(signOnService === null){
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
                    <input ref={input} type="text" className="form-control" id="input" placeholder="Entity Id" onChange={(e)=>{handleEntityId(e)}} required />
                </div>
                <span id="entityId"></span>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="SingleSignOnService" className="col-sm-2 control-label">Single Sign On Service End point <span>*</span></label>
                <div className="col-sm-4">
                    <input ref={input} type="text" className="form-control" id="input" placeholder="Single Sign on Service" onChange={(e)=>{handleSignOn(e)}}/>
                </div>
                <span id="sso"></span>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Single logout service end point</label>
                <div className="col-sm-4">
                    <input ref={input} type="text" className="form-control" id="input" placeholder="Single logout service" onChange={(e)=>{handleLogout(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">SP X.509 cert (same cert for sign/encrypt) <span>*</span></label>
                <div className="col-sm-4">
                    <textarea ref={input} type="text" className="form-control" id="certificate" placeholder="Certificate" onChange={(e)=>{handleCert(e)}}/>
                </div>
                <span id="cert"></span>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="NameId Format" className="col-sm-2 control-label">NameId Format</label>
                <div className="col-sm-4">
                    <select  onChange={(e)=>{handleNameId(e)}}>
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
                    <select onChange={(e)=>{handleAuthn(e)}} >
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
                    <input ref={input} type="text" className="form-control" id="input" placeholder="Organisation Name" onChange={(e)=>{handleOrganization(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Organisation Display Name</label>
                <div className="col-sm-4">
                    <input ref={input} type="text" className="form-control" id="input" placeholder="organisation display name" onChange={(e)=>{handleOrganizationDisplayName(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Organisation Url</label>
                <div className="col-sm-4">
                    <input ref={input} type="text" className="form-control" id="input" placeholder="organisation url" onChange={(e)=>{handleOrganizationUrl(e)}}/>
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
                    <input ref={input} type="text" className="form-control" id="input" placeholder="Name" onChange={(e)=>{handleTecnicalContactName(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Email</label>
                <div className="col-sm-4">
                    <input ref={input} type="text" className="form-control" id="input" placeholder="Email" onChange={(e)=>{handleTecnicalEmail  (e)}}/>
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
                    <input ref={input} type="text" className="form-control" id="input" placeholder="Support Name" onChange={(e)=>{handleSupportName(e)}}/>
                </div>
            </div>
            <br/>
            <br/>
            <div className="form-group">
                <label for="inputType" className="col-sm-2 control-label">Email</label>
                <div className="col-sm-4">
                    <input ref={input} type="text" className="form-control" id="input" placeholder="Email" onChange={(e)=>{handleSupportEmail(e)}}/>
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
