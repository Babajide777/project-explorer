import React from "react";
import { Alert, Button, Form } from "react-bootstrap";
import Layout from "./shared/Layout";

const BuildForm = ({ us, programs, graduationYears, err }) => {
  const { _id, email } = us;
  let showAlert = false;
  err.length > 0 ? (showAlert = true) : (showAlert = false);

  return (
    <>
      <div className="mx-auto w-50 p-3 mw-60">
        <h2>Continue your signup</h2>
        <Form
          id="updateForm"
          method="POST"
          action="/continuesignup?_method=PUT"
        >
          <br />
          <Alert
            className="alert alert-danger"
            variant="danger"
            show={showAlert}
          >
            {err}
          </Alert>

          <Form.Group>
            <Form.Label>Matric Number</Form.Label>
            <Form.Control name="matricNumber" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Program</Form.Label>
            <Form.Control as="select" name="program">
              <option>Select Option</option>
              {programs.map((prog) => (
                <option key={prog}>{prog}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Graduation Year</Form.Label>
            <Form.Control as="select" name="graduationYear">
              <option>Select Option</option>
              {graduationYears.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              type="text"
              name="id"
              defaultValue={`${_id}`}
              style={{ display: "none" }}
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="email"
              name="email"
              defaultValue={`${email}`}
              style={{ display: "none" }}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Complete SignUp
          </Button>
        </Form>
      </div>
    </>
  );
};

const ContinueSignUp = (props) => {
  return (
    <Layout us={props.us}>
      <BuildForm {...props} />
    </Layout>
  );
};

export default ContinueSignUp;
