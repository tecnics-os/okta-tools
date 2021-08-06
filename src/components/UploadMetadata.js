import { useRef, useState } from "react"
import XMLViewer from 'react-xml-viewer'
const UploadMetadata = ()=> {
    const [postData, setPostData] = useState();
    const [xml, setXml] = useState();
    const input = useRef();
    const handleUrl = (e)=> {
        setPostData(e.target.value)
    }
    const handleFile = (e)=> {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file)
        reader.onload = (e) => {
            setPostData(e.target.result);
        }
    }
    const handleSubmission = async (e) => {
        e.preventDefault();
        if(postData === undefined) {
            alert("Please upload a file or enter url")
        }else{
            await fetch('http://127.0.0.1:5000/uploadmetadata', {
                method: 'POST',
                type: 'CORS',
                body: postData,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
              })
              .then(res => res.json())
              .then(data => setXml(data))
        }
        input.current.value=null
    }
    return <form>
    <div className="form-group">
        <div className="col-xs-4">
            <label>Enter the URL where your metadata is hosted(preferably the entityID):</label>
            <br/>
            <input ref = {input} className="form-control" onChange={(e)=>{handleUrl(e)}}></input>
        <div/>
        <div>
        <legend>OR</legend>
        <label>Select a metadata file from disk that you would like to upload directly.</label>
        <input ref={input} type="file" name="file" onChange ={(e)=>{handleFile(e)}} ></input>
        <br/>
        <button className="btn btn-primary" onClick={(e)=>{handleSubmission(e)}}>Fetch</button>

        <div>
            {xml !== undefined ? <div className="wrap-xml"> Metadata uploaded successfully. <br/> Here is the copy of it <br/> <p className="col-sm-8"> <XMLViewer  xml={xml.content}/> </p>
            </div> : null }
        </div>

    </div>
    </div>
    </div>
    </form>
}

export default UploadMetadata
