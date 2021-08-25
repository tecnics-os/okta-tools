import { useState } from "react";

const initialValues = {
  encoded_token: null,
};

const JwtViewer = () => {
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
  const handleSubmit = (e) => {
    if (values.encoded_token !== null) {
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
    } else {
      alert("Please enter the token");
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
            {payload !== undefined ? (
              <pre>
                <code>{JSON.stringify(payload, "\n", 4)}</code>
              </pre>
            ) : null}
          </div>
        </fieldset>
      </form>
    </div>
  );
};
export default JwtViewer;
