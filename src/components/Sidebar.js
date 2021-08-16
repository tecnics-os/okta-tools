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

const methods = {
  componentDidMount(props) {
    let header = document.getElementsByClassName("btn");
    let fullpath = window.location.href;
    let requiredPath = "/" + fullpath.split("/")[3];
    for (let counter = 0; counter < header.length - 1; counter++) {
      let getToAttribute = header[counter].attributes[1];
      let toValue = getToAttribute.value;
      let value = requiredPath.localeCompare(toValue);
      if (value === 0) {
        header[counter].className = "btn btn-sidebar current";
      }
    }
  },
};
const Sidebar = () => {
  document.body.addEventListener("click", function (e) {
    if (e.target.className === "nav-link") {
      document
        .getElementsByClassName("nav-link active")[0]
        .classList.remove("active");
      e.target.classList.add("active");
    }
  });
  // const removeClass = (e) => {
  //   let elements = document.getElementById("links");
  //   Object.entries(elements.childNodes).forEach((elem) => {
  //     elem[1].childNodes[0].className = "btn btn-sidebar";
  //   });
  //   e.target.className = "btn btn-sidebar current";
  // };

  return (
    <Router>
      <div className="row" style={{ height: "100%" }}>
        <nav
          id="sidebar"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse p-0"
        >
          <ul className="nav nav-pills flex-column">
            <li className="nav-item sidebar-hover">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item sidebar-hover">
              <Link className="nav-link" to="/parse-xml">
                Parse Metadata
              </Link>
            </li>
            <li className="nav-item sidebar-hover">
              <Link className="nav-link" to="/build-metadata">
                Build IDP Metadata
              </Link>
            </li>
            <li className="nav-item sidebar-hover">
              <Link className="nav-link" to="/certificateWithHeader">
                Format X509 Certificate
              </Link>
            </li>
            <li className="nav-item sidebar-hover">
              <Link className="nav-link" to="/upload-metadata">
                Upload IDP Metadata
              </Link>
            </li>
            <li className="nav-item sidebar-hover">
              <Link className="nav-link" to="/download-metadata">
                Download Metadata
              </Link>
            </li>
            <li className="nav-item sidebar-hover">
              <Link className="nav-link" to="/test-idp">
                Test IDP
              </Link>
            </li>
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
          </Switch>
        </main>
      </div>
    </Router>
  );
};
export default lifecycle(methods)(Sidebar);
