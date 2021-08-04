import { useEffect, useRef, useState } from "react";
import "../App.css";
const XmlParser = () => {
  const file = useRef("")
  const url = useRef("")
  const [resp, setResp] = useState({
    entityID: null,
    certificate: null,
    acsUrls: null,
    singleLogoutService: null,
    singleSignonService: null,
  });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    console.log(resp);
  }, [resp]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    file.current.value = null
    url.current.value = null
    if (data === undefined || data == null) {
      alert("Please upload a valid url or file");
    } else {
      await fetch("http://127.0.0.1:5000/api", {
        method: "POST",
        mode: "cors",
        body: data,
      })
        .then((res) => {
          if(res.status === 500){
            throw new Error('Please check the url/data entered. Encountered 500 Error')
          }else if(res.status === 200){
            return res.json()
          }else if(res.status === 404){
            throw new Error("404 error")
          }
        })
        .then((json) =>
          setResp({
            entityID: json.entityId,
            certificates: json.certificate,
            acsUrls: json.acsUrls,
            singleLogoutService: json.singleLogoutService,
            singleSignonService: json.singleSignonService,
          })
        )
        .catch((error)=>{
          setError(error.message);
        })
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
    <form>
      <div id="xml-parser" className="form-group col-sm-12">
        <div>
          <label>Upload File</label>
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
      
          <legend>(OR)</legend>
          <div className="col-sm-4">
            <p>
              PASTE URL HERE:{" "}
              <input
                id="url"
                className="form-control"
                ref={url}
                onChange={(e) => {
                  handleUrl(e);
                }}
              />
            </p>
          </div>
          <br/>
          <br/>
          <br/>
          <br/>
          <div className="col-sm-4">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                handleSubmission(e);
              }}
            >
              Submit
            </button>
          </div>
          <br />
          <hr/>
          <div>
            <div>
              {resp.entityID != null ? (
                <div>
                  {" "}
                  <strong  className="col-sm-3">Entity Id:</strong> <p className="col-sm-8">{resp.entityID}{" "}</p>
                </div>
              ) : null}
            </div>
            <div>
              {resp.singleLogoutService != null
                ? resp.singleLogoutService.map((url) => {
                    return (
                      <p key={url.index}>
                          <strong className="col-sm-3">Single Logout Url:</strong>
                        {" "}
                        <p className="col-sm-8">{url.Url} <br />{" "}</p>
                        <b>
                          <p className="col-sm-3">Single logout Binding:</p>
                        </b>{" "}
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
                        <b>
                          <p className="col-sm-3">Acs url: </p>
                        </b>
                        <p className="col-sm-8">{acsUrl.url}{" "}</p>
                        <br/>
                        <b>
                          <p className="col-sm-3"> Acs url binding: </p>
                        </b>
                        <p className="col-sm-8">{acsUrl.binding}</p>
                      </p>
                    );
                  })
                : null}
            </div>
          
            <div className="signon">
              {" "}
              {resp.singleSignonService != null
                ? resp.singleSignonService.map((signon) => {
                    return (
                      <p key={signon.index} >
                        <br/>
                        <br/>
                        <b>
                          <strong className="col-sm-3">Single sign on url: </strong>
                        </b>{" "}
                        <p className="col-sm-8">{signon.url}</p>
                        <br />{" "}
                        <br/>
                        <b>
                          <p className="col-sm-3">Single sign on Binding: </p>
                        </b>
                        <p className="col-sm-8">{signon.binding}{" "}</p>
                        
                        
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
                      <br/>
                      <br/>
                      <b className="col-sm-3">
                        CERTIFICATE
                      </b>{" "}
                      <br /> <p className="col-sm-8">{cert.content}</p>
                    </p>
                  );
                })
              : null}
              {error !== null ? <span>{error}</span>: null}
          </div>
        </div>
      </div>
    </form>
  );
};
export default XmlParser;
