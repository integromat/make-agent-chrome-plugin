import React from "react";

function Form() {
  return (
    <>
      <div className="form">
        <form>
          <div className="form-group">
            <label htmlFor="exampleFormControlInput1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="name@example.com"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default Form;
