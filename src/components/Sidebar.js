import { Link, Route, Switch } from 'react-router-dom'
import './sidebar.css'
import BuildMetadata from './BuildMetadata'
import CertificateWithHeader from './CertificateWithHeader'
import DownloadMetadata from './DownloadMetadata'
import TestIdp from './TestIdp'
import UploadMetadata from './UploadMetadata'
import XmlParser from './XmlParser'
import Home from './Home'
import { BrowserRouter as Router } from 'react-router-dom'

const Sidebar = ()=> {
  
    return <Router>
      <div className='sidebar-header'>
          <li>
            <Link className="btn btn-sidebar" to="/parse-xml">Parse Metadata</Link>
          </li>
          <li>
            <Link className="btn btn-sidebar" to="/build-metadata">Build IDP Metadata</Link>
          </li>
          <li >
            <Link className="btn btn-sidebar" to="/certificateWithHeader">Format X509 Certificate</Link>
          </li>
          <li >
            <Link className="btn btn-sidebar" to="/upload-metadata">Upload IDP Metadata</Link>
          </li>
          <li >
            <Link className="btn btn-sidebar" to="/download-metadata">Download Metadata</Link>
          </li>
          <li >
            <Link className="btn btn-sidebar" to="/test-idp">Test IDP</Link>
          </li>
        </div>
        <div className="components overflow-auto">
        <Switch>
            <Route path="/" exact>
              <Home/>
            </Route>
            <Route path="/parse-xml" exact>
              <XmlParser/>
            </Route>
            <Route path="/build-metadata" exact>
              <BuildMetadata/>
            </Route>
            <Route path="/certificateWithHeader" exact>
              <CertificateWithHeader />
            </Route>
            <Route path="/upload-metadata" exact>
              <UploadMetadata />
            </Route>
            <Route path="/download-metadata" exact>
              < DownloadMetadata />
            </Route>
            <Route path="/test-idp" exact>
              < TestIdp />
            </Route>
          </Switch>
    </div>
    </Router>
}
export default Sidebar;
