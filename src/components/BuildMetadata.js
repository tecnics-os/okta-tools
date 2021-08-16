import { useCallback, useEffect, useRef, useState } from "react";
import XMLViewer from "react-xml-viewer";
import React from "react";

const initialValues = {
  entityID: null,
  signOnService: null,
  logoutService: null,
  nameId: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
  authnRequestNeeded: true,
  organisationName: null,
  organisationDisplayName: null,
  organisationUrl: null,
  tecnicalContactName: null,
  tecnicalContactEmail: null,
  supportContactName: null,
  supportContactEmail: null,
};

const BuildMetadata = () => {
  const [xml, setXml] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [cert, setCert] = useState(null);
  const input = useRef();
  const [values, setValues] = useState(initialValues);

  const { REACT_APP_BACKEND_URL } = process.env;

  useEffect(() => {
    if (cert !== "" || cert !== null) {
      fetch(`${REACT_APP_BACKEND_URL}/formatCertificate`, {
        method: "POST",
        type: "CORS",
        body: cert,
      })
        .then((res) => res.json())
        .then((data) => setCertificate(data.certificate));
    }
  }, [cert, REACT_APP_BACKEND_URL]);

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 1000);
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleCert = (e) => {
    let certificate_value = e.target.value;
    setCert(certificate_value);
  };

  const useDebounce = useCallback(debounce(handleCert), []);

  const generateMetadata = (e) => {
    e.preventDefault();

    let metadata = {
      entityId: values.entityID,
      signOnService: values.signOnService,
      logoutService: values.logoutService,
      certificate: certificate,
      nameId: values.nameId,
      authnRequesteNeeded: values.authnRequestNeeded,
      organisationName: values.organisationName,
      organisationDisplayName: values.organisationDisplayName,
      organisationurl: values.organisationUrl,
      tecnicalContactName: values.tecnicalContactName,
      tecnicalContactEmail: values.tecnicalContactEmail,
      supportContactName: values.supportContactName,
      supportContactEmail: values.supportContactEmail,
    };

    if (
      values.entityID === null ||
      values.signOnService === null ||
      cert === null
    ) {
      window.scrollTo(0, 0);
      if (values.entityID === null) {
        document.getElementById("entityIdHelp").innerHTML =
          "This field is required";
      }
      if (values.signOnService === null) {
        document.getElementById("ssisHelp").innerHTML = "This field is required";
      }
      if (cert === null) {
        document.getElementById("certHelp").innerHTML = "This field is required";
      }
    } else {
      formataDataToXml(metadata);
    }
  };
  const formataDataToXml = (metadata) => {
    if (
      metadata.entityId.length < 1 ||
      metadata.signOnService.length < 1 ||
      metadata.certificate.length < 1
    ) {
      return "entity id is required";
    } else {
      let xml = `<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${metadata.entityId}">
            <md:IDPSSODescriptor WantAuthnRequestsSigned="${metadata.authnRequesteNeeded}" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
            <md:KeyDescriptor use="signing">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:X509Data>
            <ds:X509Certificate>${metadata.certificate}</ds:X509Certificate>
            </ds:X509Data>
            </ds:KeyInfo>
            </md:KeyDescriptor>`;
      if (metadata.logoutService != null) {
        xml =
          xml +
          `<md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${metadata.logoutService}"/>`;
      }
      if (metadata.nameId != null) {
        xml = xml + `<md:NameIDFormat>${metadata.nameId}</md:NameIDFormat>`;
      }
      xml =
        xml +
        `<md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${metadata.signOnService}"/></md:IDPSSODescriptor>`;

      if (
        metadata.organisationName != null ||
        metadata.organisationDisplayName != null ||
        metadata.setOrganisationUrl != null
      ) {
        xml = xml + `<md:Organization>`;
        if (metadata.organisationName != null) {
          xml =
            xml +
            `<md:OrganizationName xml:lang="en-US">${metadata.organisationName}</md:OrganizationName>`;
        }
        if (metadata.organisationDisplayName != null) {
          xml =
            xml +
            `<md:OrganizationDisplayName xml:lang="en-US">${metadata.organisationDisplayName}</md:OrganizationDisplayName>`;
        }
        if (metadata.organisationUrl != null) {
          xml =
            xml +
            `<md:OrganizationURL xml:lang="en-US">${metadata.organisationUrl}</md:OrganizationURL>`;
        }
        xml = xml + `</md:Organization>`;
      }
      if (
        metadata.tecnicalContactName != null ||
        metadata.tecnicalContactEmail != null
      ) {
        xml = xml + `<md:ContactPerson contactType="tecnical">`;
        if (metadata.tecnicalContactName != null) {
          xml =
            xml +
            `<md:GivenName>${metadata.tecnicalContactName}</md:GivenName>`;
        }
        if (metadata.tecnicalContactEmail != null) {
          xml =
            xml +
            `<md:EmailAddress>${metadata.tecnicalContactEmail}</md:EmailAddress>`;
        }
        xml = xml + `</md:ContactPerson>`;
      }
      if (
        metadata.supportContactEmail != null ||
        metadata.supportContactName != null
      ) {
        xml = xml + `<md:ContactPerson contactType="support">`;
        if (metadata.supportContactName != null) {
          xml =
            xml + `<md:GivenName>${metadata.supportContactName}</md:GivenName>`;
        }
        if (metadata.supportContactEmail != null) {
          xml =
            xml +
            `<md:EmailAddress>${metadata.supportContactEmail}</md:EmailAddress>`;
        }
        xml = xml + `</md:ContactPerson>`;
      }
      xml = xml + `</md:EntityDescriptor>`;
      setXml(xml);
    }
  };
  return (
    <div className="container-fluid">
      <form>
        <div className="mb-3 col-6 form-group required">
          <label htmlFor="entityId" className="form-label">
            Entity Id
          </label>
          <input
            name="entityID"
            ref={input}
            type="text"
            className="form-control"
            id="entityId"
            placeholder="Entity Id"
            onChange={(e) => {
              handleInputChange(e);
            }}
            required
          />
          <div id="entityIdHelp" className="form-text"></div>
        </div>

        <div className="mb-3 col-6 form-group required">
          <label htmlFor="singleSignInService" className="form-label">
            Single Sign In Service End Point
          </label>
          <input
            name="signOnService"
            ref={input}
            type="text"
            className="form-control"
            id="singleSignInService"
            placeholder="Single Sign In Service"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <div id="ssisHelp" className="form-text"></div>
        </div>

        <div className="mb-3 col-6 form-group">
          <label htmlFor="singleSignOutService" className="form-label">
            Single Sign Out Service End Point
          </label>
          <input
            ref={input}
            name="logoutService"
            type="text"
            className="form-control"
            id="singleSignOutService"
            placeholder="Single logout service"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <div id="ssosHelp" className="form-text"></div>
        </div>

        <div className="mb-3 col-6 form-group required">
          <label htmlFor="certificate" className="form-label">
            SP X.509 cert (same cert for sign/encrypt)
          </label>
          <textarea
            ref={input}
            name="certificate"
            type="text"
            className="form-control"
            id="certificate"
            placeholder="Certificate"
            onChange={useDebounce}
          />
          <div id="certHelp" className="form-text"></div>
        </div>

        <div className="mb-3 col-6 form-group">
          <label htmlFor="nameIdFormat" className="form-label">
            NameId Format
          </label>
          <select
            className="form-select"
            id="nameIdFormat"
            name="nameId"
            onChange={(e) => {
              handleInputChange(e);
            }}
          >
            <option value>
              urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified
            </option>
            <option>
              urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
            </option>
            <option>urn:oasis:names:tc:SAML:1.1:nameid-format:entity</option>
            <option>urn:oasis:names:tc:SAML:1.1:nameid-format:transient</option>
            <option>
              urn:oasis:names:tc:SAML:1.1:nameid-format:persistent
            </option>
            <option>urn:oasis:names:tc:SAML:1.1:nameid-format:encrypted</option>
          </select>
        </div>

        <div className="mb-3 col-6 form-group">
          <label htmlFor="authReq" className="form-label">
            WantAuthnRequestsSigned
          </label>
          <select
            id="authReq"
            className="form-select"
            name="authnRequestNeeded"
            onChange={(e) => {
              handleInputChange(e);
            }}
          >
            <option>True</option>
            <option>False</option>
          </select>
        </div>

        <div className="mt-5 mb-3 col-6 form-group">
          <label
            htmlFor="organisationInfo"
            className="col-form-label-lg text-uppercase"
          >
            Organisation Info <span className="text-lowercase">(optional)</span>
          </label>
        </div>
        <div className="mb-3 col-6 form-group">
          <label htmlFor="organisationName" className="form-label">
            Organisation Name
          </label>
          <input
            name="organisationName"
            ref={input}
            type="text"
            className="form-control"
            id="organisationName"
            placeholder="Organisation Name"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        <div className="mb-3 col-6 form-group">
          <label htmlFor="organisationDisplayName" className="form-label">
            Organisation Display Name
          </label>
          <input
            name="organisationDisplayName"
            ref={input}
            type="text"
            className="form-control"
            id="organisationDisplayName"
            placeholder="organisation display name"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        <div className="mb-3 col-6 form-group">
          <label htmlFor="organisationUrl" className="form-label">
            Organisation Url
          </label>
          <input
            name="organisationUrl"
            ref={input}
            type="text"
            className="form-control"
            id="organisationUrl"
            placeholder="organisation url"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        <div className="mt-5 mb-3 col-6 form-group">
          <label
            htmlFor="technicalContact"
            className="col-form-label-lg text-uppercase"
          >
            Technical Contact<span className="text-lowercase">(optional)</span>
          </label>
        </div>
        <div className="mb-3 col-6 form-group">
          <label htmlFor="tecnicalContactName" className="form-label">
            Given Name
          </label>
          <input
            name="tecnicalContactName"
            ref={input}
            type="text"
            className="form-control"
            id="tecnicalContactName"
            placeholder="Name"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        <div className="mb-3 col-6 form-group">
          <label htmlFor="tecnicalContactEmail" className="form-label">
            Email
          </label>
          <input
            ref={input}
            name="tecnicalContactEmail"
            type="text"
            className="form-control"
            id="tecnicalContactEmail"
            placeholder="Email"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        <div className="mt-5 mb-3 col-6 form-group">
          <label
            htmlFor="supportContact"
            className="col-form-label-lg text-uppercase"
          >
            Support Contact<span className="text-lowercase">(optional)</span>
          </label>
        </div>
        <div className="mb-3 col-6 form-group">
          <label htmlFor="supportContactName" className="form-label">
            Given Name
          </label>
          <input
            name="supportContactName"
            ref={input}
            type="text"
            className="form-control"
            id="supportContactName"
            placeholder="Support Name"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>

        <div className="mb-3 col-6 form-group">
          <label htmlFor="supportContactEmail" className="form-label">
            Email
          </label>
          <input
            name="supportContactEmail"
            ref={input}
            type="text"
            className="form-control"
            id="supportContactEmail"
            placeholder="Email"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        <div className="mt-5 mb-3 col-6 form-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => {
              generateMetadata(e);
            }}
          >
            Build IDP Metadata
          </button>
        </div>
      </form>

      <div>
        {xml != null ? (
          <p>
            <XMLViewer xml={xml} />
          </p>
        ) : null}
      </div>
    </div>
  );
};
export default BuildMetadata;
