import { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";
import "../App.css";
import HelpPopper from "./HelpPopper";
import { IoIosHelpCircle } from "react-icons/io";
import DownloadLink from "react-download-link";

const XmlParser = () => {
  const file = useRef("");
  const url = useRef("");
  const { REACT_APP_BACKEND_URL } = process.env;
  const [resp, setResp] = useState({
    entityID: null,
    certificate: null,
    acsUrls: null,
    singleLogoutService: null,
    singleSignonService: null,
    error: null,
    metadata_error: null,
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [signOnShow, setSignOnShow] = useState(false);

  useEffect(() => {}, [resp]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    file.current.value = null;
    url.current.value = null;
    setResp({
      entityID: null,
      certificates: null,
      acsUrls: null,
      singleLogoutService: null,
      singleSignonService: null,
      error: null,
      metadata_error: null,
    });

    if (data === undefined || data == null) {
      alert("Please upload a valid url or file");
    } else {
      setLoading(true);
      await fetch(`${REACT_APP_BACKEND_URL}/parseMetadata`, {
        method: "POST",
        mode: "cors",
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((json) =>
          setResp({
            entityID: json.metadata.entityId,
            certificates: json.metadata.certificate,
            acsUrls: json.metadata.acsUrls,
            singleLogoutService: json.metadata.singleLogoutService,
            singleSignonService: json.metadata.singleSignonService,
            error: json.error,
            metadata_error: json.metadata.error,
          })
        );
      setLoading(false);
    }
  };
  const handleUrl = (e) => {
    setData(e.target.value);
  };
  const changeHandler = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      setData(e.target.result);
    };
  };

  return (
    <div>
      <form>
        <div className="mb-3 col-6">
          <label htmlFor="formFile" className="form-label">
            Upload a file
          </label>
          <input
            id="formFile"
            className="form-control"
            type="file"
            name="file"
            ref={file}
            onChange={(e) => {
              changeHandler(e);
            }}
            accept="xml"
          />

          <p className="text-uppercase text-primary fs-5 my-3">Or</p>
          <label htmlFor="url" className="form-label">
            Paste URL here
          </label>
          <input
            id="url"
            className="form-control"
            ref={url}
            onChange={(e) => {
              handleUrl(e);
            }}
          />
          <br />
          <button
            className="btn btn-primary"
            onClick={(e) => {
              handleSubmission(e);
            }}
          >
            Submit
          </button>
        </div>
      </form>
      {loading === true ? (
        <div className="mb-3 col-6 text-center">
          <p>
            <Loader
              type="Circles"
              color="#00297A"
              height={50}
              width={50}
              timeout={3000}
            />
          </p>
        </div>
      ) : (
        <>
          <form id="values">
            {resp.entityID != null ? (
              <div className="row mb-2">
                <label className="col-sm-2 col-form-label">Entity Id</label>
                <div className="col-sm-9">
                  {resp.entityID.map((res) => {
                    return (
                      <label
                        className="col-sm-2 col-form-label"
                        key={res.index}
                      >
                        {res.content}
                      </label>
                    );
                  })}
                </div>
                <div className="col-auto" onMouseEnter={() => setIsShown(true)}
                      onMouseLeave={() => setIsShown(false)} ><IoIosHelpCircle></IoIosHelpCircle></div>
                      <br></br>
                      {isShown && (
                            <div className="row-auto"><HelpPopper image="/images/entityId.png"></HelpPopper></div>         
                          )} 
              </div>
            ) : null}

            {resp.singleLogoutService != null
              ? resp.singleLogoutService.map((url) => {
                  return (
                    <>
                      <div key={url.index} className="row mb-2">
                        <label className="col-sm-2 col-form-label">
                          Single Logout Url
                        </label>
                        <div className="col-sm-9">
                          <label className="col-sm-8 col-form-label">
                            {url.Url}
                          </label>
                        </div>
                        
                      </div>
                      <div key={url.index} className="row mb-2">
                        <label className="col-sm-2 col-form-label">
                          Single Logout Binding
                        </label>
                        <div className="col-sm-9">
                          <label className="col-sm-8 col-form-label">
                            {url.Binding}
                          </label>
                        </div>
                        
                      </div>
                    </>
                  );
                })
              : null}
            {resp.acsUrls != null
              ? resp.acsUrls.map((acsUrl) => {
                  return (
                    <>
                      <div key={acsUrl.index} className="row mb-2">
                        <label className="col-sm-2 col-form-label">
                          Acs url
                        </label>
                        <div className="col-sm-9">
                          <label className="col-sm-8 col-form-label">
                            {acsUrl.url}
                          </label>
                        </div>
                        
                      </div>
                      <div className="row mb-2">
                        <label className="col-sm-2 col-form-label">
                          Acs Url Binding
                        </label>
                        <div className="col-sm-9">
                          <label className="col-sm-2 col-form-label">
                            {acsUrl.binding}
                          </label>
                        </div>
                        
                      </div>
                    </>
                  );
                })
              : null}

            {resp.singleSignonService != null
              ? resp.singleSignonService.map((signon) => {
                  return (
                    <>
                      <div key={signon.index} className="row mb-2">
                        <label className="col-sm-2 col-form-label">
                          Single sign on url
                        </label>
                        <div className="col-sm-9">
                          <label className="col-sm-8 col-form-label">
                            {signon.url}
                          </label>
                        </div>
                        <div className="col-auto" onMouseEnter={() => setSignOnShow(true)}
                      onMouseLeave={() => setSignOnShow(false)} ><IoIosHelpCircle></IoIosHelpCircle></div>
                      <br></br>
                      {signOnShow && (
                            <div className="row-auto"><HelpPopper image="/images/SingleSignOn.png"></HelpPopper>
                            </div>         
                          )}  
                      </div>
                      <div className="row mb-2">
                        <label className="col-sm-2 col-form-label">
                          Single sign on Binding
                        </label>
                        <div className="col-sm-9">
                          <label className="col-sm-8 col-form-label">
                            {signon.binding}
                          </label>
                        </div>  
                        
                      </div>
                    </>
                  );
                })
              : null}

            {resp.certificates != null
              ? resp.certificates.map((cert) => {
                  return (
                    <div key={cert.index} className="row mb-2">
                      <label className="col-sm-2 col-form-label">
                        Certificate
                      </label>
                      <div className="col-sm-9">
                        <label className="col-sm-8 col-form-label">
                          {cert.content}
                        </label>
                      </div>
                      <DownloadLink
                              className="btn btn-primary"
                              label="download"
                              style={{ textDecoration: 'none' }}
                              filename="certificate.crt"
                              exportFile={()=>"".concat(cert.content)}
                          />
                    </div>
                  );
                })
              : null}

            <div className="col-sm-6">
              {typeof resp.error === "object" && resp.error !== null ? (
                <>
                  {resp.error.entityID_error !== "" ? <div className="alert alert-danger" role="alert">
                    {resp.error.entityID_error}
                  </div>:  null}
                  {resp.error.certificate_error !== "" ? <div className="alert alert-danger" role="alert">
                    {resp.error.certificate_error}
                  </div>: null}
                  {resp.error.sso_error !== undefined && resp.error.sso_error !== "" ? <div className="alert alert-danger" role="alert">
                    {resp.error.sso_error}
                  </div>: null}
                  {resp.error.acs_error !== "" && resp.error.acs_error !== undefined ? <div className="alert alert-danger" role="alert">
                    {resp.error.acs_error}
                  </div>: null}
                </>
              ) : (
                <div>{resp.error !== "" ? <>{resp.error}</>: null}</div>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
};
export default XmlParser;