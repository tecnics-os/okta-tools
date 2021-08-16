import { useRef, useState } from "react";
import XMLViewer from "react-xml-viewer";
import Loader from "react-loader-spinner";

const UploadMetadata = () => {
  const [postData, setPostData] = useState();
  const [xml, setXml] = useState({
    content: undefined,
    error: undefined,
  });
  const input = useRef();
  const [loading, setLoading] = useState(false);
  const { REACT_APP_BACKEND_URL } = process.env;
  const handleUrl = (e) => {
    setPostData(e.target.value);
  };
  const handleFile = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      setPostData(e.target.result);
    };
  };
  const handleSubmission = async (e) => {
    e.preventDefault();
    if (postData === undefined) {
      alert("Please upload a file or enter the url");
    } else {
      setLoading(true);
      await fetch(`${REACT_APP_BACKEND_URL}/uploadMetadata`, {
        method: "POST",
        type: "CORS",
        body: postData,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) =>
          setXml({
            content: data.content,
            error: data.error,
          })
        );
      setLoading(false);
    }
    input.current.value = null;
  };
  return (
    <form>
      <div className="mb-3 col-6">
        <label htmlFor="formFile" className="form-label">
          Enter the URL where your metadata is hosted
        </label>
        <input
          id="formFile"
          ref={input}
          className="form-control"
          onChange={(e) => {
            handleUrl(e);
          }}
        ></input>
        <p className="text-uppercase text-primary fs-5 my-3">Or</p>

        <label htmlFor="url" className="form-label">
          Select a metadata file from disk that you would like to upload
          directly
        </label>
        <input
          id="url"
          className="form-control"
          ref={input}
          type="file"
          name="file"
          onChange={(e) => {
            handleFile(e);
          }}
        ></input>
      </div>
      <div className="mb-3 col-6">
        <button
          className="btn btn-primary"
          onClick={(e) => {
            handleSubmission(e);
          }}
        >
          Fetch
        </button>
      </div>
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
        <div className="mb-3 col-6">
          {xml.error === "" ? (
            <>
              <div className="alert alert-success" role="alert">
                Metadata uploaded successfully.
              </div>
              <div className="wrap-xml">
                Here is the copy of it
                <p>
                  <XMLViewer xml={xml.content} />
                </p>
              </div>
            </>
          ) : (
            <div className="mb-3 col-6">{xml.error}</div>
          )}
        </div>
      )}
    </form>
  );
};

export default UploadMetadata;
