const Home = () => {
  return (
    <>
      <div className="card col-8 m-auto mb-3 mt-3">
        <div className="row">
          <div className="col-10 d-flex align-items-center">
            <i className="bi bi-tools circle-icon d-flex ms-4"></i>
            <div className="card-body">
              <h5 className="card-title">Metadata parser</h5>
              <p className="card-text">
                Beautify SAML metadata to find nuances.
              </p>
            </div>
          </div>
          <div className="col-2 d-flex align-items-center">
            <a href="/parse-xml" className="btn btn-primary">
              View Tool
            </a>
          </div>
        </div>
      </div>
      <div className="card col-8 m-auto mb-3">
        <div className="row">
          <div className="col-10 d-flex align-items-center">
            <i className="bi bi-tools circle-icon d-flex ms-4"></i>
            <div className="card-body">
              <h5 className="card-title">Metadata builder</h5>
              <p className="card-text">
                Build SAML metadata with a simple form.
              </p>
            </div>
          </div>
          <div className="col-2 d-flex align-items-center">
            <a href="/build-metadata" className="btn btn-primary">
              View Tool
            </a>
          </div>
        </div>
      </div>
      <div className="card col-8 m-auto mb-3">
        <div className="row">
          <div className="col-10 d-flex align-items-center">
            <i className="bi bi-tools circle-icon d-flex ms-4"></i>
            <div className="card-body">
              <h5 className="card-title">Format certificate</h5>
              <p className="card-text">
                Helper tool to format X509 certificate to different styles.
              </p>
            </div>
          </div>
          <div className="col-2 d-flex align-items-center">
            <a href="/certificateWithHeader" className="btn btn-primary">
              View Tool
            </a>
          </div>
        </div>
      </div>
      <div className="card col-8 m-auto mb-3">
        <div className="row">
          <div className="col-10 d-flex align-items-center">
            <i className="bi bi-tools circle-icon d-flex ms-4"></i>
            <div className="card-body">
              <h5 className="card-title">Test Okta IDP</h5>
              <p className="card-text">
                Test your Okta tenent by adding okta-tools as a service
                provider.
              </p>
            </div>
          </div>
          <div className="col-2 d-flex align-items-center">
            <a href="/test-idp" className="btn btn-primary">
              View Tool
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
