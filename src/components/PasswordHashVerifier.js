import { useState } from "react";

const initialValues = {
  hash_type: "bcrypt",
  password: null,
  hashedpassword: null,
};

const PasswordHashVerifier = () => {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState();
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
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setStatus(data));
  };

  return (
    <div className="container-fluid">
      <form>
        <fieldset>
          <legend>This tool helps you to verify the password with hash</legend>
          <div className="mb-3 col-6">
            <label htmlFor="hash_type" className="form-label">
              Please select the algorithm type of hashing:
            </label>
            <select
              className="form-control form-select"
              id="hash_type"
              name="hash_type"
              onChange={(e) => {
                handleInputChange(e);
              }}
            >
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
          <div className="mb-3 col-6">
            <label htmlFor="password" className="form-label">
              Enter the password
            </label>
            <input
              id="password"
              name="password"
              className="form-control"
              onChange={(e) => {
                handleInputChange(e);
              }}
              placeholder="Enter the password"
            />
          </div>

          <div className="mb-3 col-6">
            <label htmlFor="password" className="form-label">
              Enter the hash
            </label>
            <textarea
              name="hashedpassword"
              className="form-control"
              onChange={(e) => {
                handleInputChange(e);
              }}
              placeholder="Enter the hashed password"
            />
          </div>
          <div className="mb-3 col-6 form-group">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Verify
            </button>
          </div>
          <div className="mb-3 col-6 form-group">
            {status !== undefined ? (
              <div className="col-sm-3 btn-primary">status.status</div>
            ) : null}
          </div>
        </fieldset>
      </form>
    </div>
  );
};
export default PasswordHashVerifier;
