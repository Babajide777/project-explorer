import React from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Image,
} from "react-bootstrap";
import Layout from "./shared/Layout";

const ProjectLayout = ({ dat, dat2 }) => {
  const { name, abstract, authors, tags } = dat;

  let scaledImage = dat2.profilePicture.replace(
    "/upload",
    "/upload/c_scale,h_50,q_auto:best,w_50"
  );

  return (
    <>
      <Container>
        <Row id="project_name">
          <h3>{name}</h3>
        </Row>
        <Row className="bg-light">
          <Col md="1">
            <Image
              src={`${scaledImage}`}
              roundedCircle
              style={{ height: 50 + "px", width: 50 + "px" }}
            />
          </Col>
          <Col id="project_author" md="3">
            <p>Created By</p>
            <p>{`${dat2.firstname} ${dat2.lastname}`}</p>
          </Col>

          <Col md="3">
            <p>Date Created</p>
            <p>{new Date(dat.createdAt).toLocaleDateString()}</p>
          </Col>

          <Col md="3">
            <p>Last Updated</p>
            <p>{new Date(dat.updatedAt).toLocaleDateString()}</p>
          </Col>

          <Col md="2">
            <div className="col-sm">
              <div className="d-flex justify-content-end">
                <a href="#" className=" btn btn-primary">
                  Edit Project
                </a>
              </div>
            </div>
          </Col>
        </Row>
        <br />

        <Row>
          <Col>
            <div id="project_abstract">
              <h5>Project Abstract</h5>
              <p>{abstract}</p>
            </div>

            <div className="mx-auto ">
              <b>Comments</b>
              <Form>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Leave a comment"
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </div>
          </Col>

          <Col>
            <h5>Project Details</h5>

            <Card className="text-center">
              <Card.Header>
                <b>Author(s)</b>
              </Card.Header>
              <Card.Body id="project_authors">
                {authors.map((auz) => {
                  return (
                    <>
                      <Card.Text key={auz}>{auz}</Card.Text>
                    </>
                  );
                })}
              </Card.Body>
              <Card.Footer className="text-muted" id="project_tags">
                <b>{tags}</b>
              </Card.Footer>
            </Card>

            <br />

            <Card>
              <Card.Header className="text-center">
                <b>Project files</b>
              </Card.Header>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>No file uploaded yet</p>
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <br />
    </>
  );
};

const Project = (props) => {
  return (
    <Layout us={props.us}>
      <ProjectLayout {...props} />
    </Layout>
  );
};

export default Project;
