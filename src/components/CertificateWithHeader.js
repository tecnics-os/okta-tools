import { useState } from "react";
import "../App.css";
import fileDownload from "js-file-download";
const CertificateWithHeader = () => {
  const [certificate, setCertificate] = useState();
  const [certificateWithHeader, setCertificateWithHeader] = useState();
  const { REACT_APP_BACKEND_URL } = process.env;
  const handleCertificate = (e) => {
    setCertificate(e.target.value);
  };
  const formatCertificate = (e) => {
    e.preventDefault();
    if (certificate === null || certificate === undefined) {
      alert("Please enter a valid certificate");
    } else {
      fetch(`${REACT_APP_BACKEND_URL}/certificateWithHeader`, {
        method: "POST",
        body: certificate,
      })
        .then((res) => res.json())
        .then((data) => {
          setCertificateWithHeader(data);
        });
    }
  };
  const handleCertificateSave = () => {
    let fileName = `certificate.pem`;
    fileDownload(certificateWithHeader.certificate, fileName);
  };
  return (
    <form>
      <div className="mb-3 col-6 form-group">
        <textarea
          style={{ height: "400px" }}
          id="certificate-text-area"
          className="form-control"
          onChange={(e) => {
            handleCertificate(e);
          }}
        ></textarea>
      </div>
      <div className="mb-3 col-6 form-group">
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => {
            formatCertificate(e);
          }}
        >
          Format certificate
        </button>
      </div>
      {certificateWithHeader != null ? (
        <>
          <div className="mb-3 col-6 form-group">
            <label htmlFor="supportContactName" className="form-label">
              {certificateWithHeader.certificate}
            </label>
          </div>
          <div className="mb-3 col-6 form-group">
            <button className="btn btn-primary" onClick={handleCertificateSave}>
              Download certificate
            </button>
          </div>
        </>
      ) : null}
    </form>
  );
};
export default CertificateWithHeader;
