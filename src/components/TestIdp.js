import { useState } from "react";

const TestIdp = () => {
  const [entityid, setEntityid] = useState("");
  const [signOnUrl, setSignOnUrl] = useState({
    data: null,
  });
  const { REACT_APP_BACKEND_URL } = process.env;

  const validateEntityId = (e) => {
    e.preventDefault();
    if (entityid.length > 1) {
      fetch(`${REACT_APP_BACKEND_URL}/validateEntityId`, {
        method: "POST",
        type: "CORS",
        body: entityid,
      })
        .then((res) => res.json())
        .then((data) =>
          setSignOnUrl({
            data: data.signOnUrl,
          })
        );
    } else {
      alert("Please enter entity Id first");
    }
  };

  const handleEntityid = (e) => {
    setEntityid(e.target.value);
  };
  return (
    <form>
      <div className="mb-3 col-6">
        <label htmlFor="formFile" className="form-label">
          Entity Id
        </label>
        <input
          id="formFile"
          className="form-control"
          onChange={(e) => {
            handleEntityid(e);
          }}
        ></input>
        <br />
        <button
          id="submit"
          className="btn btn-primary"
          onClick={(e) => {
            validateEntityId(e);
          }}
        >
          Submit
        </button>

        {signOnUrl.data != null ? (
          signOnUrl.data.length > 1 ? (
            (window.location.href = signOnUrl.data)
          ) : (
            <div className="mt-3 alert alert-danger" role="alert">
              Entered entity id did not match. Please upload metadata first.
            </div>
          )
        ) : null}
      </div>
    </form>
  );
};

export default TestIdp;
