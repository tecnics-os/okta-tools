import { useEffect, useRef, useState } from "react";

import "../App.css";

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
    metadata_error: null
  });
  const [data, setData] = useState(null);

  useEffect(() => {

  }, [resp]);

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
      metadata_error: null
    })
    
    if (data === undefined || data == null) {
      alert("Please upload a valid url or file");
    } else {
      await fetch(`${REACT_APP_BACKEND_URL}/parseMetadata`, {
        method: "POST",
        mode: "cors",
        body: data,
      })
      .then((res) => res.json())
      .then((json) =>
        setResp({
          entityID: json.metadata.entityId,
          certificates: json.metadata.certificate,
          acsUrls: json.metadata.acsUrls,
          singleLogoutService: json.metadata.singleLogoutService,
          singleSignonService: json.metadata.singleSignonService,
          error: json.error,
          metadata_error: json.metadata.error
        })
      )
      console.log(resp)
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
    <form id="form">
      <div id="xml-parser" className="form-group col-sm-12">
        <div className="col-sm-6">
          <label>Upload a file</label>
          <input
            type="file"
            name="file"
            ref={file}
            onChange={(e) => {
              changeHandler(e);
            }}
            accept="xml"
          />
          <br />
          <legend>OR</legend>

            <strong>Paste URL here: </strong>
            <input
              id="url"
              className="form-control"
              ref={url}
              onChange={(e) => {
                handleUrl(e);
              }}
            />
          <br/>
            <button
              className="btn btn-primary"
              onClick={(e) => {
                handleSubmission(e);
              }}
            >
              Submit
            </button>

          <br />
          <hr />
          
          <div id="values">
            <div>
              {resp.entityID != null ? (
                <div>
                  {" "}
                  <strong className="col-sm-3">Entity Id:</strong>
                  <p className="col-sm-8">{resp.entityID.map(res => {
                    return <p>{res.content}</p>})} </p>
                </div>
              ) : null}
            </div>
            
            <div>
              {resp.singleLogoutService != null
                ? resp.singleLogoutService.map((url) => {
                    return (
                      <p key={url.index}>
                        <strong className="col-sm-3">Single Logout Url:</strong>
                        <p className="col-sm-8">{url.Url}</p>

                        <strong className="col-sm-3">
                          Single logout Binding:
                        </strong>
                        <p className="col-sm-8">{url.Binding}</p>
                      </p>
                    );
                  })
                : null}
            </div>

            <div>
              {resp.acsUrls != null
                ? resp.acsUrls.map((acsUrl) => {
                    return (
                      <p key={acsUrl.index}>
                        <strong className="col-sm-3">Acs url: </strong>
                        <p className="col-sm-8">{acsUrl.url} </p>
                        <strong className="col-sm-3"> Acs url binding: </strong>
                        <p className="col-sm-8">{acsUrl.binding}</p>
                      </p>
                    );
                  })
                : null}
            </div>

            <div className="signon">
              {resp.singleSignonService != null
                ? resp.singleSignonService.map((signon) => {
                    return (
                      <p key={signon.index}>

                        <strong className="col-sm-3">
                          Single sign on url:{" "}
                        </strong>
                        <p className="col-sm-8">{signon.url}</p>

                        <strong className="col-sm-3">
                          Single sign on Binding:{" "}
                        </strong>
                        <p className="col-sm-8">{signon.binding} </p>

                      </p>

                    );
                  })
                : null}{" "}
            </div>
          </div>

          <div className="certificate">
            {resp.certificates != null
              ? resp.certificates.map((cert) => {
                  return (
                    <p key={cert.index}>
                      <strong className="col-sm-3">CERTIFICATE</strong>{" "}
                      <p className="col-sm-8">{cert.content}</p>
                    </p>
                  );
                })
              : null}
          </div>
          <div className="col-sm-9">
            { typeof resp.error === 'object' && resp.error !== null ? <span>{resp.error.entityID_error} <br/> {resp.error.certificate_error} <br/> {resp.error.sso_error} <br/> {resp.error.acs_error} </span> : <span>{resp.error}</span> }
          </div>
        </div>
      </div>
    </form>
  );
};
export default XmlParser;
