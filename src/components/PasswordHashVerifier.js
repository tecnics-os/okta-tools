import { useState } from "react";

const initialValues = {
  hash_type: "sha1",
  password: null,
  hashedpassword: null,
};

const PasswordHashVerifier = () => {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState(null);
  const [hashedPassword, setHashedPassword] = useState("aafdc23870ecbcd3d557b6423a8982134e17927e");
  const { REACT_APP_BACKEND_URL } = process.env;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    if (e.target.value === 'sha1') {
      setHashedPassword("aafdc23870ecbcd3d557b6423a8982134e17927e");
    }
    if (e.target.value === 'sha224') {
      setHashedPassword("749c542d6544666a76eb695b8aeeb379e0d9108fe3a1988f7b234cd2");
    }
    if (e.target.value === 'sha256') {
      setHashedPassword("9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c");
    }
    if (e.target.value === 'sha512') {
      setHashedPassword("fd37ca5ca8763ae077a5e9740212319591603c42a08a60dcc91d12e7e457b024f6bdfdc10cdc1383e1602ff2092b4bc1bb8cac9306a9965eb352435f5dfe8bb0");
    }
    if (e.target.value === 'sha3_224') {
      setHashedPassword("635f1505477aa5324f0d94db8dd873e41f0fc4a3bf7995759f872a85");
    }
    if (e.target.value === 'sha3_256') {
      setHashedPassword("cab2029413d0d52c2dc4ba60003b5f737ee6e211bd61db76a2af5415e8adbde7");
    }
    if (e.target.value === 'sha3_384') {
      setHashedPassword("3f7cb0545775e1ad58573c8497731b5dc403f59c68081835cb9c820c3fc2087475e91aeafe2e367cd5c8edfeddc1e428");
    }
    if (e.target.value === 'sha3_512') {
      setHashedPassword("c913c9134bc98f58fdc9fbf8a891c6dfb38b40f91afc02c957045567ff5bb754ebd7cd5a963d0e9093ce24ce6520b845d97f1666323dce736598e1a27a90bcd3");
    }
    if (e.target.value === 'bcrypt') {
      setHashedPassword("$2b$10$mG8o2k5C3Rrhq2vuSkHxPerZ7YXFABdDVOSrDkwfKsIEmB9OZZyG.");
    }
  };
  const successMessage = "Success, its a valid password hash!";
  const failureMessage = "Failure, please enter a valid password hash!";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null)
    console.log(values)
    let password_elem = document.getElementById('password-help')
    let hash_elem = document.getElementById('hash-help')
    hash_elem.innerHTML = "";
    password_elem.innerHTML = "";
    if (values.password === "" || values.password === null || values.hashedpassword === "" || values.hashedpassword === null) {
      if (values.password === null || values.password === "") {
        password_elem.innerHTML = '<p style="color:red;">Please enter a valid password!</p>';
      }
      if (values.hashedpassword === null || values.hashedpassword === "") {
        hash_elem.innerHTML = '<p style="color:red;">Please enter a valid hashed password!</p>';
      }
    } else {
      document.getElementById('password-help').innerHTML = ""
      document.getElementById('hash-help').innerHTML = ""

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
    }
  }
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
            <div className="form-text" id="password-help"></div>
            <p class="help_text_style">Sample Password: pass123</p>
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
            <div className="form-text" id="hash-help"></div>
            <p class="help_text_style">Hashed Sample Password: {hashedPassword}</p>
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
          <div className="mb-6 col-14 form-group">
            <>
              {
                status !== null ?
                  (status.status === 1 ? <div className="alert alert-success">{successMessage}</div> : <div className="alert alert-danger">{failureMessage}</div>)
                  : null
              }
            </>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default PasswordHashVerifier;
