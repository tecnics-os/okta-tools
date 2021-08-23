import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UrlDataViewer from "./UrlDataViewer";
function HarViewer() {
  const [data, setData] = useState(null);
  const [urls, setUrls] = useState([]);
  const [entry, setEntry] = useState();
  const [currentUrl, setCurrentUrl] = useState(null);
  
  const handleSubmit = (e) => {
    if(data === null) {
      alert("Please upload a file first.")
    }else{
      const jsonContents = JSON.parse(data);
      const entries = jsonContents.log.entries.map(entry => entry)
      entries.forEach(entry => {
        setEntry(entry)
        setUrls((oldUrls) => {
          return [...oldUrls, entry]
        })
      });
    } 
  }

  const passUrl = (url) => {
    setCurrentUrl(null);
    setCurrentUrl(url);
  }


  const changeHandler = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      setData(e.target.result);
    };

  };
  return <div id="har-viewer">
    <div>
      <label htmlFor="formFile" className="form-label">
        Upload a file
      </label>
      <input
        id="formFile"
        className="form-control col-sm-6"
        type="file"
        name="file"
        onChange={(e) => {
          changeHandler(e);
        }}
        accept="har"
      />
      <br></br>
      <button onClick={(e) => { handleSubmit(e) }} className="btn btn-primary">Check Network Logs</button>
    </div>
    <div>
      <br />
    </div>
    <div className="row">
      <div className="col-sm-5 overflow-scroll">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Network urls</h5>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Network Url</th>
                  <th scope="col">Status code</th>
                  <th scope="col">Server Ip address</th>
                </tr>
              </thead>
              <tbody>

                {urls.map(url => {
                  return <tr>
                    <td>{url.startedDateTime}</td>
                    <td>
                      <Link className="card-text col-sm-2" value={url} onClick={() => { passUrl(url) }}>{url.request.url}</Link>
                    </td>
                    <td>
                      <p className="col-sm-2">{url.response.status}</p>
                    </td>
                    <td>
                      <p className="col-sm-2">{url.serverIPAddress}</p>
                    </td>
                  </tr>
                })}
              </tbody>
            </table>

          </div>
        </div>
      </div>
      <div class="col-sm-7 overflow-scroll">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Har file logs</h5>
            <div className="card-text">
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="request-tab" data-bs-toggle="tab" data-bs-target="#request" type="button" role="tab" aria-controls="request" aria-selected="false">Request</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="response-tab" data-bs-toggle="tab" data-bs-target="#response" type="button" role="tab" aria-controls="response" aria-selected="false">Reponse</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="response-content-tab" data-bs-toggle="tab" data-bs-target="#response-content" type="button" role="tab" aria-controls="response-content" aria-selected="false">Reponse content</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="cookies-tab" data-bs-toggle="tab" data-bs-target="#cookies" type="button" role="tab" aria-controls="cookies" aria-selected="false">Cookies</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="timings-tab" data-bs-toggle="tab" data-bs-target="#timings" type="button" role="tab" aria-controls="timings" aria-selected="false">Timings</button>
                </li>
              </ul>
              <div class="tab-content" id="myTabContent">
                {currentUrl !== null ? <>
                  <div class="tab-pane fade" id="request" role="tabpanel" aria-labelledby="request-tab">
                    <br /> <b>Method: </b> {currentUrl.request.method}
                    <br /> <b>Request Url: </b> {currentUrl.request.url}
                    <br /> <b>HTTP version: </b> {currentUrl.request.httpVersion}
                    <br /><b>Request Headers: </b>
                    <pre>{Object.entries(currentUrl.request.headers).map(data => {
                      return <p className="col-sm-4"><b>{data[1].name}  </b> : {data[1].value} </p>
                    })}</pre>
                    <br/> <b>Headers size: </b> {currentUrl.request.headersSize}
                    <br/> <b>Body size: </b> {currentUrl.request.bodySize}
                    <br/> <b>Query strings: </b> <p>{currentUrl.request.queryString.length !== 0 ? <pre>{Object.entries(currentUrl.request.queryString).map(data => {
                      return <p className="col-sm-4"><b>{data[1].name}</b> : {data[1].value} </p>
                    })}</pre> : <p>No parameters available</p>}</p>
                  </div>
                  <div class="tab-pane fade" id="response" role="tabpanel" aria-labelledby="response-tab">
                    <b>Status: </b> {currentUrl.response.status}
                    {" "}{currentUrl.response.statusText}
                    <br/><b>Response Headers: </b>
                    <pre>{Object.entries(currentUrl.response.headers).map(data => {
                      return <p className="col-sm-4"><b>{data[1].name}</b> : {data[1].value} </p>
                    })}</pre>
                    <b>Cache: </b> {currentUrl.cache.name} : {currentUrl.cache.value}
                    <br/>
                    <b>Headers size: </b> {currentUrl.response.headersSize}
                    <br/> <b>Body size: </b> {currentUrl.response.bodySize}
                    <br/> <b>Redirect url: </b> {currentUrl.response.redirectURL}
                  </div>
                  <div class="tab-pane fade" id="response-content" role="tabpanel" aria-labelledby="response-content-tab">
                    <b>Response content: </b><br />
                    <p>{currentUrl.response.content.text}</p>
                  </div>
                  <div class="tab-pane fade" id="cookies" role="tabpanel" aria-labelledby="cookies-tab">
                    <b>Cookies: </b><br />
                    <b>Cookies requested: </b>
                    <p>{currentUrl.request.cookies.length !== 0 ? <pre>{Object.entries(currentUrl.request.cookies).map(data => {
                      return <p className="col-sm-4"><b>{data[1].name}</b> : {data[1].value} </p>
                    })}</pre> : <p>No cookies available</p>}</p>
                    <b>Cookies sent: </b>
                    <p>{currentUrl.response.cookies.length !== 0 ? <pre>{Object.entries(currentUrl.response.cookies).map(cookie => {
                      return <p className="col-sm-4"><b>{cookie[1].name}</b> : {cookie[1].value} </p>
                    })}</pre> : <p>No Cookies available</p>}</p>

                  </div>
                  <div class="tab-pane fade" id="timings" role="tabpanel" aria-labelledby="timings-tab">
                    <b>Timings </b><br />
                    <pre>{Object.entries(currentUrl.timings).map(timing_details => {
                      return <p className="col-sm-4"><b>{timing_details[0]}</b> : {timing_details[1]} </p>
                    })}</pre>

                  </div>
                </> : null}

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
}

export default HarViewer
