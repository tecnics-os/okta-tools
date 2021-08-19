import { useState } from "react";
import ReactJson from "react-json-view";
import JSONViewer from 'react-json-viewer';

const initialValues = {
    "encoded_token": null,
    "secret": null,
    "algoritm": "HS256"
}

const JwtViewer = ()=> {

    const [values, setValues] = useState(initialValues);
    const [payload, setPayload] = useState();
    const { REACT_APP_BACKEND_URL } = process.env;
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
    };
    const handleSubmit = async (e)=> {
        await fetch(`${REACT_APP_BACKEND_URL}/decodeJwtToken`, {
            method: "POST",
            type: "CORS",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            
        })
        .then(res=> res.json())
        .then(data => setPayload(data))
        
    }

    return (
        <div>
            <div className="col-sm-20">
                <label className="col-sm-3">JWT Encoded token: </label>
                <textarea name="encoded_token" onChange={(e)=> {handleInputChange(e)}} className="col-sm-5"></textarea>
            </div>
            <br/>
            <div className="col-sm-20">
                <label className="col-sm-3">Secret key</label>
                <input name="secret" onChange={(e)=> {handleInputChange(e)}} className="col-sm-5"></input>
            </div>
            <br/>
            <div>
                <select name="algoritm" onChange={(e)=> {handleInputChange(e)}}>
                    <option>HS256</option>
                    <option>HS384</option>
                    <option>HS512</option>

                    <option>PS256</option>
                    <option>PS384</option>

                    <option>RS256</option>
                    <option>RS384</option>
                    <option>RS512</option>

                    <option>ES256</option>
                    <option>ES384</option>
                    <option>ES512</option>
                      
                </select>
            </div>
            <div>
                <button onClick={(e)=> {handleSubmit(e)}} className="col-sm-4 btn btn-info">decode</button>
            </div>
            <hr/>
            <div className="col-sm-12">
                {payload !== undefined ? <div className="col-sm-5">
                    <pre className="col-sm-5">{JSON.stringify(payload, "\n", 4)}</pre>
                </div>: null}
            </div>
        
        </div>
    )
}
export default JwtViewer