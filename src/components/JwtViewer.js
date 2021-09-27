import { useState } from "react";

const initialValues = {
  encoded_token: null,
};

const JwtViewer = () => {
  const [values, setValues] = useState(initialValues);
  const [payload, setPayload] = useState(null);
  const { REACT_APP_BACKEND_URL } = process.env;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setPayload(null);
    if(values.encoded_token === null || values.encoded_token === "") {
      alert("Please enter the token.")
    } else {
      fetch(`${REACT_APP_BACKEND_URL}/decodeJwtToken`, {
        method: "POST",
        type: "CORS",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setPayload(data));
    }
  };

  return (
    <div className="container-fluid">
      <form>
        <fieldset>
          <legend>This tool helps to decrypt the JWT token</legend>
          <div className="mb-3 col-6">
            <label htmlFor="jwt-token" className="form-label">
              JWT Encoded token
            </label>
            <textarea
              className="form-control"
              placeholder="JWT Encoded token..."
              onChange={(e) => {
                handleInputChange(e);
              }}
              id="jwt-token"
              rows="10"
              name="encoded_token"
            ></textarea>
          </div>
          <div className="mb-3 col-6 form-group">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Decode
            </button>
          </div>
          <div className="mb-3 col-6" id="results">
            {payload !== null ? (
              <pre>                
                {payload.error === null 
                ? <div>
                    <div class="border-style">
                      <label>HEADER: <span class="text-line">Algorithm and Token Type</span></label>
                      <p class="jwt-header">{JSON.stringify(payload.header, "\n", 5)}</p>
                    </div>
                    <div class="border-style">
                      <label>PAYLOAD: <span class="text-line">Data</span></label>
                      <p class="jwt-payload">{JSON.stringify(payload.payload, "\n", 5)}</p>
                    </div>
                  </div> 
                : <p class="alert alert-danger">{payload.error}</p>}
              </pre>
            ) : null}
          </div>
        </fieldset>
      </form>
    </div>
  );
};
export default JwtViewer;
