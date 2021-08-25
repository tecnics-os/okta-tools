import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UrlDataViewer from "./UrlDataViewer";
function HarViewer() {
  const [data, setData] = useState(null);
  const [urls, setUrls] = useState([]);
  const [entry, setEntry] = useState();
  const [currentUrl, setCurrentUrl] = useState(null);
  const [anyNetworkUrlClick, setAnyNetworkUrlClick] = useState(false);

  const handleSubmit = (e) => {
    if (data === null) {
      alert("Please upload a file first.");
    } else {
      let resultsElement = document.getElementById("har-results");
      let errorElement = document.getElementById("error")
      let jsonContents = null;
      try {
        errorElement.innerHTML = ""
        jsonContents = JSON.parse(data);
        const entries = jsonContents.log.entries.map((entry) => entry);
        entries.forEach((entry) => {
          setEntry(entry);
          setUrls((oldUrls) => {
            return [...oldUrls, entry];
          });
        });
        resultsElement.style.display = "block";
      } catch (err) {
        if (err) {
          errorElement.innerHTML =
            "Unable to parse the file. Please upload a har file";
        }
      }
    }
  };

  const passUrl = (url) => {
    setCurrentUrl(null);
    setCurrentUrl(url);
    setAnyNetworkUrlClick(true);
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
    <div id="har-viewer">
      <div>
        <label htmlFor="formFile" className="form-label">
          Upload a file
        </label>
        <input
          id="formFile"
          className="form-control col-sm-6"
          type="file"
          name="file"
          accept=".har"
          onChange={(e) => {
            changeHandler(e);
          }}
        />
        <br></br>
        <button
          onClick={(e) => {
            handleSubmit(e);
          }}
          className="btn btn-primary"
        >
          Check Network Logs
        </button>
      </div>
      <div>
        <br />
      </div>

      <div  id="har-results">
        <div className="row">
        <div className="col-5">
          <div className="card overflow-auto h-500-px">
            <div className="card-body table-responsive">
              <h5 className="card-title">Network urls</h5>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Network Url</th>
                    <th scope="col">Status code</th>
                    <th scope="col">Server Ip address</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => {
                    return (
                      <tr className="fs-14-px">
                        <td scope="row">
                          <div className="date-time-width">
                            {url.startedDateTime}
                          </div>
                        </td>
                        <td>
                          <Link
                            className="card-text"
                            value={url}
                            onClick={() => {
                              passUrl(url);
                            }}
                          >
                            <div className="request-url-width">
                              {url.request.url}
                            </div>
                          </Link>
                        </td>
                        <td>
                          <div className="response-width">
                            {url.response.status}
                          </div>
                        </td>
                        <td>
                          <div className="ip-width">{url.serverIPAddress}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-7">
          <div class="card overflow-auto h-500-px">
            <div class="card-body">
              <h5 class="card-title">Har file logs</h5>
              <div className="card-text">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                    {anyNetworkUrlClick ? (
                      <a
                        class="nav-link active"
                        id="request-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#request"
                        type="button"
                        role="tab"
                        aria-controls="request"
                        aria-selected="false"
                      >
                        Request
                      </a>
                    ) : (
                      <button
                        class="nav-link"
                        id="request-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#request"
                        type="button"
                        role="tab"
                        aria-controls="request"
                        aria-selected="false"
                      >
                        Request
                      </button>
                    )}
                  </li>

                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      id="response-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#response"
                      type="button"
                      role="tab"
                      aria-controls="response"
                      aria-selected="false"
                    >
                      Response
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      id="response-content-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#response-content"
                      type="button"
                      role="tab"
                      aria-controls="response-content"
                      aria-selected="false"
                    >
                      Response content
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      id="cookies-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#cookies"
                      type="button"
                      role="tab"
                      aria-controls="cookies"
                      aria-selected="false"
                    >
                      Cookies
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      id="timings-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#timings"
                      type="button"
                      role="tab"
                      aria-controls="timings"
                      aria-selected="false"
                    >
                      Timings
                    </button>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  {currentUrl !== null ? (
                    <>
                      <div
                        class="tab-pane active"
                        id="request"
                        role="tabpanel"
                        aria-labelledby="request-tab"
                      >
                        <br /> <b>Method: </b> {currentUrl.request.method}
                        <br /> <b>Request Url: </b> {currentUrl.request.url}
                        <br /> <b>HTTP version: </b>
                        {currentUrl.request.httpVersion}
                        <br />
                        <b>Request Headers: </b>
                        <pre>
                          {Object.entries(currentUrl.request.headers).map(
                            (data) => {
                              return (
                                <p className="col-sm-4">
                                  <b>{data[1].name} </b> : {data[1].value}
                                </p>
                              );
                            }
                          )}
                        </pre>
                        <br /> <b>Headers size: </b>
                        {currentUrl.request.headersSize}
                        <br /> <b>Body size: </b> {currentUrl.request.bodySize}
                        <br /> <b>Query strings: </b>
                        <p>
                          {currentUrl.request.queryString.length !== 0 ? (
                            <pre>
                              {Object.entries(
                                currentUrl.request.queryString
                              ).map((data) => {
                                return (
                                  <p className="col-sm-4">
                                    <b>{data[1].name}</b> : {data[1].value}
                                  </p>
                                );
                              })}
                            </pre>
                          ) : (
                            <p>No parameters available</p>
                          )}
                        </p>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="response"
                        role="tabpanel"
                        aria-labelledby="response-tab"
                      >
                        <b>Status: </b> {currentUrl.response.status}{" "}
                        {currentUrl.response.statusText}
                        <br />
                        <b>Response Headers: </b>
                        <pre>
                          {Object.entries(currentUrl.response.headers).map(
                            (data) => {
                              return (
                                <p className="col-sm-4">
                                  <b>{data[1].name}</b> : {data[1].value}
                                </p>
                              );
                            }
                          )}
                        </pre>
                        <b>Cache: </b> {currentUrl.cache.name} :
                        {currentUrl.cache.value}
                        <br />
                        <b>Headers size: </b> {currentUrl.response.headersSize}
                        <br /> <b>Body size: </b> {currentUrl.response.bodySize}
                        <br /> <b>Redirect url: </b>
                        {currentUrl.response.redirectURL}
                      </div>
                      <div
                        class="tab-pane fade"
                        id="response-content"
                        role="tabpanel"
                        aria-labelledby="response-content-tab"
                      >
                        <b>Response content: </b>
                        <br />
                        <p>{currentUrl.response.content.text}</p>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="cookies"
                        role="tabpanel"
                        aria-labelledby="cookies-tab"
                      >
                        <b>Cookies: </b>
                        <br />
                        <b>Cookies requested: </b>
                        <p>
                          {currentUrl.request.cookies.length !== 0 ? (
                            <pre>
                              {Object.entries(currentUrl.request.cookies).map(
                                (data) => {
                                  return (
                                    <p className="col-sm-4">
                                      <b>{data[1].name}</b> : {data[1].value}
                                    </p>
                                  );
                                }
                              )}
                            </pre>
                          ) : (
                            <p>No cookies available</p>
                          )}
                        </p>
                        <b>Cookies sent: </b>
                        <p>
                          {currentUrl.response.cookies.length !== 0 ? (
                            <pre>
                              {Object.entries(currentUrl.response.cookies).map(
                                (cookie) => {
                                  return (
                                    <p className="col-sm-4">
                                      <b>{cookie[1].name}</b> :{cookie[1].value}
                                    </p>
                                  );
                                }
                              )}
                            </pre>
                          ) : (
                            <p>No Cookies available</p>
                          )}
                        </p>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="timings"
                        role="tabpanel"
                        aria-labelledby="timings-tab"
                      >
                        <b>Timings </b>
                        <br />
                        <pre>
                          {Object.entries(currentUrl.timings).map(
                            (timing_details) => {
                              return (
                                <p className="col-sm-4">
                                  <b>{timing_details[0]}</b> :
                                  {timing_details[1]}
                                </p>
                              );
                            }
                          )}
                        </pre>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div id="error"></div>
    </div>
  );
}

export default HarViewer;