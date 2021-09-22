import { Link, Route, Switch } from "react-router-dom";
import BuildMetadata from "./BuildMetadata";
import CertificateWithHeader from "./CertificateWithHeader";
import DownloadMetadata from "./DownloadMetadata";
import TestIdp from "./TestIdp";
import UploadMetadata from "./UploadMetadata";
import XmlParser from "./XmlParser";
import Home from "./Home";
import { BrowserRouter as Router } from "react-router-dom";
import lifecycle from "react-pure-lifecycle";
import PasswordHashVerifier from "./PasswordHashVerifier";
import JwtViewer from "./JwtViewer";
import HarViewer from "./HarViewer";

const methods = {
  componentDidMount(props) {
    let header = document.getElementsByClassName("nav-link");
    let fullpath = window.location.href;
    let requiredPath = "/" + fullpath.split("/")[3];
    for (let counter = 0; counter < header.length - 1; counter++) {
      let getToAttribute = header[counter].attributes[1];
      let toValue = getToAttribute.value;
      let value = requiredPath.localeCompare(toValue);
      if (value === 0) {
        header[counter].className = "nav-link active";
      } else {
        header[counter].className = "nav-link";
      }
    }
  },
};

const Sidebar = () => {
  const removeClass = (e) => {
    let elements = document.getElementById("other-list");
    let subelements = document.getElementById("sub-list");
    Object.entries(elements.childNodes).forEach((elem) => {
      elem[1].childNodes[0].className = "nav-link";
    });
    Object.entries(subelements.childNodes).forEach((subelm) => {
      subelm[1].childNodes[0].className = "nav-link";
    });
    e.target.className = "nav-link active";
  };

  return (
    <Router>
      <div className="row h-100">
        <nav
          id="sidebar"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse p-0"
        >
          <ul id="list" className="nav nav-pills flex-column">
            <li className="nav-item sidebar-hover">
              <Link
                onClick={(e) => {
                  removeClass(e);
                }}
                className="nav-link active"
                to="/"
              >
                Home
              </Link>
            </li>
            <div className="accordion accordion-flush" id="accordionExample">
              <div className="accordion-item">
                <p className="accordion-header" id="panelsStayOpen-headingOne">
                  <button className="accordion-button collapsed btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                    Saml Tools{"  "}
                  </button>
                </p>
                <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                  <div id="sub-list" class="accordion-body">
                    <li className="nav-item sidebar-hover">
                      <Link
                        onClick={(e) => {
                          removeClass(e);
                        }}
                        className="nav-link"
                        to="/parse-xml"
                      >
                        Parse Metadata
                      </Link>
                    </li>
                    <li className="nav-item sidebar-hover">
                      <Link
                        onClick={(e) => {
                          removeClass(e);
                        }}
                        className="nav-link"
                        to="/build-metadata"
                      >
                        Build IdP Metadata
                      </Link>
                    </li>
                    <li className="nav-item sidebar-hover">
                      <Link
                        onClick={(e) => {
                          removeClass(e);
                        }}
                        className="nav-link"
                        to="/certificateWithHeader"
                      >
                        Format X.509 Certificate
                      </Link>
                    </li>
                    <li className="nav-item sidebar-hover">
                      <Link
                        onClick={(e) => {
                          removeClass(e);
                        }}
                        className="nav-link"
                        to="/upload-metadata"
                      >
                        Upload IdP Metadata
                      </Link>
                    </li>
                    <li className="nav-item sidebar-hover disabled">
                      <Link
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="nav-link disabled"
                        to="/download-metadata"
                      >
                        Download Metadata(Coming Soon...)
                      </Link>
                    </li>
                    <li className="nav-item sidebar-hover disabled">
                      <Link
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="nav-link"
                        to="/oidc-client"
                      >
                        OIDC Client(Coming Soon...)
                      </Link>
                    </li>
                    <li className="nav-item sidebar-hover">
                    <Link
                      onClick={(e) => {
                        removeClass(e);
                      }}
                      className="nav-link"
                      to="/test-idp"
                    >
                      Test Okta SAML App
                    </Link>
                  </li>
                  <li className="nav-item sidebar-hover disabled">
                      <Link
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="nav-link disabled"
                        to="/download-metadata"
                      >
                        OIDC Client(coming soon)
                      </Link>
                    </li>
                  </div>
              </div>
            </div>
            </div>
            <div id="other-list">
            <li className="nav-item sidebar-hover">
              <Link
                onClick={(e) => {
                  removeClass(e);
                }}
                className="nav-link"
                to="/password-hash-verifier"
              >
                Password Hash Verifier
              </Link>
            </li>
            <li className="nav-item sidebar-hover">
              <Link
                onClick={(e) => {
                  removeClass(e);
                }}
                className="nav-link"
                to="/jwt-viewer"
              >
                JWT viewer
              </Link>
            </li>
            <li className="nav-item sidebar-hover">
              <Link
                onClick={(e) => {
                  removeClass(e);
                }}
                className="nav-link"
                to="/har-viewer"
              >
                Har Viewer
              </Link>
            </li>
            </div>
          </ul>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-2">
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/parse-xml" exact>
              <XmlParser />
            </Route>
            <Route path="/build-metadata" exact>
              <BuildMetadata />
            </Route>
            <Route path="/certificateWithHeader" exact>
              <CertificateWithHeader />
            </Route>
            <Route path="/upload-metadata" exact>
              <UploadMetadata />
            </Route>
            <Route path="/download-metadata" exact>
              <DownloadMetadata />
            </Route>
            <Route path="/test-idp" exact>
              <TestIdp />
            </Route>
            <Route path="/password-hash-verifier" exact>
              <PasswordHashVerifier />
            </Route>
            <Route path="/jwt-viewer" exact>
              <JwtViewer />
            </Route>
            <Route path="/har-viewer" exact>
              <HarViewer />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};
export default lifecycle(methods)(Sidebar);
