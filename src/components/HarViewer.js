import { useState } from "react";
import { Link } from "react-router-dom";
function HarViewer() {
  const [data, setData] = useState(null);
  const [urls, setUrls] = useState([]);
  const [entry, setEntry] = useState();
  const handleSubmit = (e) => {
    
    const jsonContents = JSON.parse(data); 
    const entries = jsonContents.log.entries.map(entry => entry)
    entries.forEach(entry => {
        setEntry(entry)
        setUrls((oldUrls)=> {
            return[...oldUrls, entry]
        })
    });
  }
  const expandUrl = (url)=> {
      console.log(urls)
  }
    
  const changeHandler = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      setData(e.target.result);
    };
    
  };
    return <div>
        <label htmlFor="formFile" className="form-label">
            Upload a file
          </label>
          <input
            id="formFile"
            className="form-control"
            type="file"
            name="file"
            onChange={(e) => {
              changeHandler(e);
            }}
            accept="har"
          />
          <br></br>
        <button onClick={(e)=>{handleSubmit(e)}} className="btn btn-primary">Check Network Logs</button>
        <div className="col-sm-15">
           {urls.map(url => {
               return <><Link className="col-sm-2" onClick={(url)=>{expandUrl(url)}}>{url.request.url} <br/></Link>
                    <p className="col-sm-2">{url.response.status}</p>
                    <p>GENERAL: 
                        <br/>Method: {url.request.method}
                        <br/> Rrequest Url: {url.request.url}
                        <br/> HTTP version: {url.request.httpVersion}
                    </p>
                    <p>REQUEST HEADERS: <pre>{Object.entries(url.request.headers).map(data=> {
                        return <p className="col-sm-4">{data[1].name} : {data[1].value} </p>
                    })}</pre></p>
                    <p>RESPONSE HEADERS: <pre>{Object.entries(url.response.headers).map(data=> {
                        return <p className="col-sm-4">{data[1].name} : {data[1].value} </p>
                    })}</pre></p>
               </>
           })}
        </div>
    </div>;
  }
  
export default HarViewer
