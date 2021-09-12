import React from "react";
import {
  Button,
  Form,
  FormControl,
  Image,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
} from "react-bootstrap";

const Header = (props) => {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand href="/">Project Explorer</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search Projects"
              className="mr-sm-2"
            />
            <Button variant="outline-light">Search</Button>
          </Form>
          <Nav className="mr-auto">
            <Nav.Link href="/projects/submit">Submit Project</Nav.Link>
          </Nav>
          <Nav id="every">
            {props.us ? (
              <>
                <Nav.Link id="logout" href="/logout">
                  Logout
                </Nav.Link>
                <NavDropdown
                  title={`Hi ${props.us.firstname}`}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href={`/editprofile/${props.us._id}`}>
                    Edit Profile
                  </NavDropdown.Item>
                </NavDropdown>
                <NavItem>
                  <Image
                    src={`${props.us.profilePicture}`}
                    roundedCircle
                    style={{ height: 50 + "px", width: 50 + "px" }}
                  />
                </NavItem>
              </>
            ) : (
              <>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <br />
    </>
  );
};

export default Header;
