import { useState } from "react";

const initialValues = {
    "encoded_token": null
}

const JwtViewer = () => {

    const [values, setValues] = useState(initialValues);
    const [payload, setPayload] = useState();
    const { REACT_APP_BACKEND_URL } = process.env;

    const handleInputChange = (
        (e) => {
            const { name, value } = e.target;
            setValues({
                ...values,
                [name]: value,
            })
        }
    );
    const handleSubmit = ((e) => {
        if (values.encoded_token !== null) {
            fetch(`${REACT_APP_BACKEND_URL}/decodeJwtToken`, {
                method: "POST",
                type: "CORS",
                body: JSON.stringify(values),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            })
            .then(res => res.json())
            .then(data => setPayload(data))
        }else{
            alert("Please enter the token")
        }
    })

    return (
        <div>
            <div>
                <b>This tool helps to decrypt the JWT token</b>
                <br />
                <div className="col-sm-20">
                    <label className="col-sm-3">JWT Encoded token: </label>
                    <br />
                    <textarea placeholder="JWT Encoded token...." onChange={(e) => { handleInputChange(e) }} id="jwt-token" rows='10' name="encoded_token" className="col-sm-5"></textarea>
                </div>
                <button className="btn btn-primary" onClick={(e) => { handleSubmit(e) }}>Decode</button>
            </div>

            <hr />
            <div className="col-sm-12" id="results">
                {payload !== undefined ? <div className="col-sm-5">
                    <pre className="col-sm-10">{JSON.stringify(payload, "\n", 4)}</pre>
                </div> : null}
            </div>

        </div>
    )
}
export default JwtViewer