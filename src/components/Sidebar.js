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
import lifecycle from 'react-pure-lifecycle'

const methods = {
  componentDidMount(props){
    let header = document.getElementsByClassName("btn");
    let fullpath = window.location.href;
    let requiredPath = "/" + fullpath.split("/")[3]
    for(let counter = 0; counter < (header.length - 1); counter ++) {
      let getToAttribute = header[counter].attributes[1]
      let toValue = getToAttribute.value
      let value = requiredPath.localeCompare(toValue)
      if(value === 0){
        header[counter].className = "btn btn-sidebar current"
      }
    }
  }
}
const Sidebar = ()=> {
    const removeClass = ((e)=> { 
      let elements = document.getElementById("links")
      Object.entries(elements.childNodes).forEach((elem) => {
        elem[1].childNodes[0].className = "btn btn-sidebar"
      });
      e.target.className = "btn btn-sidebar current"
      
    })

    return <Router>
      <div id="links" className='sidebar-header'>
          <li>
            <Link onClick={(e)=>{removeClass(e)}} className="btn btn-sidebar" to="/parse-xml">Parse Metadata</Link>
          </li>
          <li>
            <Link onClick={(e)=>{removeClass(e)}} className="btn btn-sidebar" to="/build-metadata">Build IDP Metadata</Link>
          </li>
          <li >
            <Link onClick={(e)=>{removeClass(e)}} className="btn btn-sidebar" to="/certificateWithHeader">Format X509 Certificate</Link>
          </li>
          <li >
            <Link onClick={(e)=>{removeClass(e)}} className="btn btn-sidebar" to="/upload-metadata">Upload IDP Metadata</Link>
          </li>
          <li >
            <Link onClick={(e)=>{removeClass(e)}} className="btn btn-sidebar" to="/download-metadata">Download Metadata</Link>
          </li>
          <li >
            <Link onClick={(e)=>{removeClass(e)}} className="btn btn-sidebar" to="/test-idp">Test IDP</Link>
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
export default lifecycle(methods)(Sidebar);
