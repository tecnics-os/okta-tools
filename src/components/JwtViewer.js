import { useEffect, useState } from "react";

const initialValues = {
    "encoded_token": null,
    "secret": null,
    "algoritm": "HS256",
    "publickey": null,
    "privatekey": null
}

const JwtViewer = ()=> {

    const [values, setValues] = useState(initialValues);
    const [payload, setPayload] = useState();
    const { REACT_APP_BACKEND_URL } = process.env;
    useEffect(()=> {
        if(values.encoded_token !== null) {
            fetch(`${REACT_APP_BACKEND_URL}/decodeJwtToken`, {
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
        
    }, [values, REACT_APP_BACKEND_URL])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTimeout(setValues({
            ...values,
            [name]: value,
          }), 2000)
    };


    return (
        <div>
            <div>
                <div className="col-sm-20">
                    <label className="col-sm-3">JWT Encoded token: </label>
                    <br/>
                    <textarea rows='10' name="encoded_token" onChange={(e)=> {handleInputChange(e)}} className="col-sm-5"></textarea>
                </div>
                
                <div id="addkeys" style={{display: "None"}}>
                    <div>
                        <label className="col-sm-3">Public key </label>
                        <textarea name="publickey" onChange={(e)=> {handleInputChange(e)}}></textarea>
                    </div>
                    <div>
                        <label className="col-sm-3">private key </label>
                        <textarea name="privatekey" onChange={(e)=> {handleInputChange(e)}}></textarea>
                    </div>
                </div>
                
            </div>
            
            <hr/>
            <div className="col-sm-12" id="results">
                {payload !== undefined ? <div className="col-sm-5">
                    <pre className="col-sm-10">{JSON.stringify(payload, "\n", 4)}</pre>
                </div>: null}
            </div>
        
        </div>
    )
}
export default JwtViewer