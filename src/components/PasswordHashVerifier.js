import { useState } from "react";

const initialValues = {
  hash_type: "sha1",
  password: null,
  hashedpassword: null,
};

const PasswordHashVerifier = () => {
  const [examplePassword, setExample] = useState("b2e98ad6f6eb8508dd6a14cfa704bad7f05f6fb1");
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState(null);
  const { REACT_APP_BACKEND_URL } = process.env;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    if(e.target.value === "bcrypt") {
      setExample("$2a$04$jpWkdTB8Fx0BQlg5kdhi5eal7zh5obxOhXlyP3WtDNjeYF4r1jDDm");
    }
    else if(e.target.value === "sha256") {
      setExample("008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601");
    }
    else if(e.target.value === "sha224") {
      setExample("c9a2f5d2d923b4ce105ee3e1943ff5bff91ecd4c15960054752eb2f0");
    }
    else if(e.target.value === "sha512") {
      setExample("804f50ddbaab7f28c933a95c162d019acbf96afde56dba10e4c7dfcfe453dec4bacf5e78b1ddbdc1695a793bcb5d7d409425db4cc3370e71c4965e4ef992e8c4");
    }
    else if(e.target.value === "sha3_224") {
      setExample("96dc79212c6415df2536c4a4ed4905c3b0a25e803cb609375eb0a6ae");
    }
    else if(e.target.value === "sha3_256") {
      setExample("5464c64a7c1c8f0a05a8cd2382415898d3a2c5e7b2fc1c22cf30ac230b7801ab");
    }
    else if(e.target.value === "sha3_384") {
      setExample("c75121bf587b6ce29d05dbff92c5a85eb4eb9264fb4edd69b07c9a19e589ba24088dff4a5ce2be8c7b34361c54d58db0");
    }
    else if(e.target.value === "sha3_512") {
      setExample("bcc03f9763a44e3f3123441603395c2267c019f44d1a82e2915416804c9f8889ed2b543404ae4c6d22b7b8bf829ab8c60b02c593058191d274e5425234e7d5cc");
    }
    else if(e.target.value === "sha1")
    {
      setExample("b2e98ad6f6eb8508dd6a14cfa704bad7f05f6fb1");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null)
    console.log(values)
    let password_elem = document.getElementById('password-help')
    let hash_elem = document.getElementById('hash-help')
    hash_elem.innerHTML = "";
    password_elem.innerHTML = ""
    if(values.password === "" || values.password === null || values.hashedpassword === "" || values.hashedpassword === null){
      if(values.password === null || values.password === ""){
        password_elem.innerHTML = "This field is required"
      }
      if(values.hashedpassword === null || values.hashedpassword === "") {
        hash_elem.innerHTML = "This field is required"
      }
    }else{
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
            <p className="example-message">Example Password:Password123</p>
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
            <p className="example-message">Example hash: {examplePassword}</p>

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
            {status !== null ? (
              (status.status === "success, Its a valid password hash" ? <div className="alert alert-success">{status.status}</div> : <div className="alert alert-danger">{status.status}</div> )
            ) : null}
          </div>
        </fieldset>
      </form>
    </div>
  );
};
export default PasswordHashVerifier;
