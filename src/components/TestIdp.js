import { useState } from "react"

const TestIdp = ()=> {
    const [entityid, setEntityid] = useState("");
    const [signOnUrl, setSignOnUrl] = useState({
        data: null
    });
    const { REACT_APP_BACKEND_URL } = process.env;

    const validateEntityId = (e)=> {
        e.preventDefault();
        if(entityid.length > 1) {
            fetch(`${REACT_APP_BACKEND_URL}/validateEntityId`, {
                method: 'POST',
                type: 'CORS',
                body: entityid
            })
            .then(res => res.json())
            .then(data => setSignOnUrl({
                "data": data.signOnUrl
            }))
        } else {
            alert("Please enter entity Id first")
        }
    }

    const handleEntityid = (e)=> {
        setEntityid(e.target.value);
    }
    return <form>
        <div className="col-sm-4">
        <label>Entity Id </label>
        <input className="form-control"  onChange={e=>{handleEntityid(e)} }></input>
        <br/>
        <div className="text-center">
            <button id="submit" className="btn btn-primary" onClick={(e)=>{validateEntityId(e)}}>Submit</button>
        </div>
        {signOnUrl.data != null ? (signOnUrl.data.length > 1 ?  window.location.href = signOnUrl.data: <span className="col-sm-16"><br/>Entered entity id did not match. Please upload metadata First</span> ): null}
        </div>
    </form>
}

export default TestIdp
