import { useState } from "react";

const initialValues = {
    "password": null,
    "hashedpassword": null
}

const PasswordHashVerifier = ()=> {

    const [values, setValues] = useState(initialValues);
    const [status, setStatus] = useState()
    const { REACT_APP_BACKEND_URL } = process.env;
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
    };
    const handleSubmit = async (e)=> {
        await fetch(`${REACT_APP_BACKEND_URL}/verifyPasswordHash`, {
            method: "POST",
            type: "CORS",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then(res=> res.json())
        .then(data => setStatus(data))
    }
    
    return(
        <div className="container-fluid">
            <div className="col-sm-14">
                This tool helps you to verify the password with bcrypt hash
            </div>
            <hr/>
            <div className="col-sm-14">
                <label className="col-sm-2">Enter the password: </label>
                <input name="password" className="col-sm-5" onChange={(e)=> {handleInputChange(e)}} placeholder="Enter the password"/>
            </div>
            <br/>
            <div className="col-sm-14">
                <label className="col-sm-2">Enter the Bcrypt hash: </label>
                <textarea name="hashedpassword" className="col-sm-5" onChange={(e)=>{handleInputChange(e)}} placeholder="Enter the hashed password"/>
            </div>
            <div>
                <button className="btn btn-info" onClick= {(e)=> {handleSubmit(e)}}>Verify</button>
            </div>
            <br/>
            <div>
                {status !== undefined ? <div className="col-sm-3 btn-primary">{status.status}</div> : null}
            </div>
        </div>
    )
}
export default PasswordHashVerifier