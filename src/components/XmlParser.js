import { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";
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
    metadata_error: null,
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

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
                <div className="col-sm-1">
                  <i className="bi bi-question-circle"></i>
                </div>
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
                          <label className="col-sm-2 col-form-label">
                            {url.Url}
                          </label>
                        </div>
                        <div className="col-sm-1">
                          <i className="bi bi-question-circle"></i>
                        </div>
                      </div>
                      <div key={url.index} className="row mb-2">
                        <label className="col-sm-2 col-form-label">
                          Single Logout Binding
                        </label>
                        <div className="col-sm-9">
                          <label className="col-sm-2 col-form-label">
                            {url.Binding}
                          </label>
                        </div>
                        <div className="col-sm-1">
                          <i className="bi bi-question-circle"></i>
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
                          <label className="col-sm-2 col-form-label">
                            {acsUrl.url}
                          </label>
                        </div>
                        <div className="col-sm-1">
                          <i className="bi bi-question-circle"></i>
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
                        <div className="col-sm-1">
                          <i className="bi bi-question-circle"></i>
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
                          <label className="col-sm-2 col-form-label">
                            {signon.url}
                          </label>
                        </div>
                        <div className="col-sm-1">
                          <i className="bi bi-question-circle"></i>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <label className="col-sm-2 col-form-label">
                          Single sign on Binding
                        </label>
                        <div className="col-sm-9">
                          <label className="col-sm-2 col-form-label">
                            {signon.binding}
                          </label>
                        </div>
                        <div className="col-sm-1">
                          <i className="bi bi-question-circle"></i>
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
                        <label className="col-sm-2 col-form-label">
                          {cert.content}
                        </label>
                      </div>
                      <div className="col-sm-1">
                        <i className="bi bi-question-circle"></i>
                      </div>
                    </div>
                  );
                })
              : null}

            <div className="col-sm-6">
              {typeof resp.error === "object" && resp.error !== null ? (
                <>
                  <div className="alert alert-danger" role="alert">
                    {resp.error.entityID_error}
                  </div>
                  <div className="alert alert-danger" role="alert">
                    {resp.error.certificate_error}
                  </div>
                  <div className="alert alert-danger" role="alert">
                    {resp.error.sso_error}
                  </div>
                  <div className="alert alert-danger" role="alert">
                    {resp.error.acs_error}
                  </div>
                </>
              ) : (
                <div>{resp.error}</div>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
};
export default XmlParser;

//Previous code

// <div id="values">
//   <div>
//     {resp.entityID != null ? (
//       <div className="row mb-3">
//         <label className="col-sm-2 col-form-label">Entity Id</label>
//         <div className="col-sm-10">
//           {resp.entityID.map((res) => {
//             return (
//               <label className="col-sm-2 col-form-label" key={res.index}>
//                 {res.content}
//               </label>
//             );
//           })}
//         </div>
//       </div>
//     ) : null}
//   </div>

//   <div>
//     {resp.singleLogoutService != null
//       ? resp.singleLogoutService.map((url) => {
//           return (
//             <div key={url.index}>
//               <strong className="col-sm-3">Single Logout Url:</strong>
//               <p className="col-sm-8">{url.Url}</p>

//               <strong className="col-sm-3">
//                 Single logout Binding:
//               </strong>
//               <p className="col-sm-8">{url.Binding}</p>
//             </div>
//           );
//         })
//       : null}
//   </div>

//   <div>
//     {resp.acsUrls != null
//       ? resp.acsUrls.map((acsUrl) => {
//           return (
//             <div key={acsUrl.index}>
//               <strong className="col-sm-3">Acs url: </strong>
//               <p className="col-sm-8">{acsUrl.url} </p>
//               <strong className="col-sm-3"> Acs url binding: </strong>
//               <p className="col-sm-8">{acsUrl.binding}</p>
//             </div>
//           );
//         })
//       : null}
//   </div>

//   <div className="signon">
//     {resp.singleSignonService != null
//       ? resp.singleSignonService.map((signon) => {
//           return (
//             <div key={signon.index}>
//               <strong className="col-sm-3">Single sign on url: </strong>
//               <p className="col-sm-8">{signon.url}</p>

//               <strong className="col-sm-3">
//                 Single sign on Binding:
//               </strong>
//               <p className="col-sm-8">{signon.binding} </p>
//             </div>
//           );
//         })
//       : null}
//   </div>

//   <div className="certificate">
//     {resp.certificates != null
//       ? resp.certificates.map((cert) => {
//           return (
//             <div key={cert.index}>
//               <strong className="col-sm-3">CERTIFICATE</strong>
//               <p className="col-sm-8">{cert.content}</p>
//             </div>
//           );
//         })
//       : null}
//   </div>
//   <div className="col-sm-9">
//     {typeof resp.error === "object" && resp.error !== null ? (
//       <span>
//         {resp.error.entityID_error} <br />
//         {resp.error.certificate_error} <br /> {resp.error.sso_error}
//         <br /> {resp.error.acs_error}
//       </span>
//     ) : (
//       <span>{resp.error}</span>
//     )}
//   </div>
// </div>
