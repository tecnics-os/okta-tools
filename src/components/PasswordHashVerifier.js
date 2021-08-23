import { useState } from "react";

const initialValues = {
    "hash_type": "bcrypt",
    "password": null,
    "hashedpassword": null
}

const PasswordHashVerifier = () => {

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
    
    const handleSubmit = async (e) => {

        await fetch(`${REACT_APP_BACKEND_URL}/verifyPasswordHash`, {
            method: "POST",
            type: "CORS",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => setStatus(data))
    }

    return (
        <div className="container-fluid">
            <div className="col-sm-14">
                This tool helps you to verify the password with hash
            </div>
            <hr />
            <div>
                <label className="col-sm-6">Please select the algorithm type of hashing: {" "} </label>
                <div className="col-sm-3">
                    <select className="form-control col-sm-5" name="hash_type" onChange={(e) => { handleInputChange(e) }}>
                        <option>sha1</option>
                        <option>sha224</option>
                        <option>sha256</option>
                        <option>sha512</option>
                        <option>sha3_224</option>
                        <option>sha3_256</option>
                        <option>sha3_384</option>
                        <option>sha3_512</option>
                        <option>bcrypt</option>

                    </select>

                </div>
            </div>
            <br/>
            <div className="col-sm-14">
                <label className="col-sm-2">Enter the password: </label>
                <input name="password" className="col-sm-5" onChange={(e) => { handleInputChange(e) }} placeholder="Enter the password" />
            </div>
            <br />
            <div className="col-sm-14">
                <label className="col-sm-2">Enter the hash: </label>
                <textarea name="hashedpassword" className="col-sm-5" onChange={(e) => { handleInputChange(e) }} placeholder="Enter the hashed password" />
            </div>
            <div>
                <button className="btn btn-info" onClick={(e) => { handleSubmit(e) }}>Verify</button>
            </div>
            <br />
            <div>
                {status !== undefined ? <div className="col-sm-3 btn-primary">{status.status}</div> : null}
            </div>
        </div>
    )
}
export default PasswordHashVerifier