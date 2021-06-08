import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Container from "react-bootstrap/Container";
//import CountrySelect from "react-bootstrap-country-select";
import { useParams, Link, useHistory } from "react-router-dom";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import "./AddEditUser.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddEditUser(props) {
  //const [country, setCountry] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState("");
  const [userData, setUserData] = useState({});
  const history = useHistory();
  const { id } = useParams();
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [street, setStreet] = useState("");
  const [postal, setPostal] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const notifyEdit = (name) => toast(`User ${name} edited!`);
  const notifyAdd = (name) => toast(`User ${name} added`);
  const notifyAddUserMissingData = () =>
    toast("Please fill all the missing fields!");

  function selectCountry(val) {
    setCountry(val);
  }

  function selectRegion(val) {
    setRegion(val);
  }

  useEffect(() => {
    fetch(`http://localhost:3001/employees/${id || ""}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setFirstName(data["first_name"]);
        setLastName(data["last_name"]);
        setEmail(data.email);
        setActive(data.active);
        setCountry(data.country);
        setRegion(data.city);
        setPhone(data.phone);
        setPostal(data["postal_code"]);
        setStreet(data["street_address"]);
        setBirthDate(data["date_of_birth"]);
      });
  }, [id]);

  const updateUser = (e) => {
    e.preventDefault();
    const data = userData;
    data["first_name"] = firstName;
    data["last_name"] = lastName;
    data.email = email;
    data.active = active;
    data.phone = phone;
    data["date_of_birth"] = birthDate;
    data.country = country;
    data.city = region;
    data["street_address"] = street;
    data["postal_code"] = postal;
    data["updated_at"] = new Date().toLocaleDateString();

    setUserData(data);
    async function editUser() {
      const response = await fetch(`http://localhost:3001/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(userData),
      });
      return response.json();
    }
    editUser()
      .then((data) => notifyEdit(`${data["first_name"]} ${data["last_name"]}`))
      .then((data) => {
        return new Promise((resolve) => setTimeout(() => resolve(data), 2000));
      })
      .then(() => history.push(`/users`));
  };

  const addUser = (e) => {
    e.preventDefault();
    const data = {};
    data["first_name"] = firstName;
    data["last_name"] = lastName;
    data.email = email;
    data.active = active;
    data.phone = phone;
    data["date_of_birth"] = birthDate;
    data.country = country;
    data.city = region;
    data["street_address"] = street;
    data["postal_code"] = postal;
    data["created_at"] = new Date().toLocaleDateString();

    if (
      !(
        firstName &&
        lastName &&
        email &&
        phone &&
        birthDate &&
        country &&
        region &&
        street &&
        postal
      )
    ) {
      notifyAddUserMissingData();
      return;
    }
    async function add() {
      const response = await fetch(`http://localhost:3001/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    }
    add()
      .then((data) => notifyAdd(data["first_name"]))
      .then((data) => {
        return new Promise((resolve) => setTimeout(() => resolve(data), 1500));
      })
      .then(() => history.push(`/users`));
  };

  return (
    <Container className="containerStyle">
      <ToastContainer />
      <div className="generalInfo">
        <div>
          {id ? (
            <div>
              <h4>{firstName}</h4>
              <h6>{email}</h6>
            </div>
          ) : (
            <h3>Add new user</h3>
          )}
        </div>
      </div>
      <Form>
        <Row className="mt-4">
          <Col>
            <Form.Label size="sm">First name</Form.Label>
            <Form.Control
              size="sm"
              value={firstName || ""}
              onChange={(ev) => {
                setFirstName(ev.target.value);
                console.log(firstName);
              }}
              placeholder="First name"
            />
          </Col>

          <Col>
            <Form.Label size="sm">Last name</Form.Label>
            <Form.Control
              size="sm"
              value={lastName || ""}
              onChange={(ev) => {
                setLastName(ev.target.value);
                console.log(lastName);
              }}
              placeholder="Last name"
            />
          </Col>
        </Row>
        <Form.Group controlId="formBasicEmail" className="mt-3 mb-3">
          <Form.Label size="sm">Email address</Form.Label>
          <Form.Control
            size="sm"
            value={email || ""}
            type="email"
            onChange={(ev) => {
              setEmail(ev.target.value);
              console.log(email);
            }}
            placeholder="Enter email"
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Label size="sm">Birth date</Form.Label>
            <Form.Control
              size="sm"
              value={birthDate}
              onChange={(ev) => setBirthDate(ev.target.value)}
              type="date"
              placeholder="Birth date"
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Form.Label size="sm">Str. address</Form.Label>
            <Form.Control
              size="sm"
              value={street}
              onChange={(ev) => setStreet(ev.target.value)}
              type="text"
              placeholder="Address"
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm="5">
            <Form.Label size="sm">Country/City</Form.Label>
            <br />
            <CountryDropdown
              className="country"
              value={country}
              onChange={(val) => selectCountry(val)}
            />
            <RegionDropdown
              className="country"
              country={country}
              value={region}
              onChange={(val) => selectRegion(val)}
            />
          </Col>
          <Col sm="2">
            <Form.Label size="sm" className="postal">
              Post code
            </Form.Label>
            <Form.Control
              size="sm"
              value={postal}
              onChange={(ev) => setPostal(ev.target.value)}
              type="text"
              pattern="[0-9]*"
            ></Form.Control>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              size="sm"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              type="tel"
              placeholder="Phone"
            />
          </Col>
        </Row>

        <Form.Group controlId="formBasicCheckbox" className="mt-2">
          <Form.Check
            type="checkbox"
            checked={active}
            onChange={(ev) => {
              setActive(ev.target.checked);
              console.log(active);
            }}
            label="Active"
          />
        </Form.Group>

        <Row>
          <Col>
            {id ? (
              <Button
                onClick={(е) => updateUser(е)}
                variant="primary"
                type="submit"
              >
                Edit
              </Button>
            ) : (
              <Button
                onClick={(е) => addUser(е)}
                variant="primary"
                type="submit"
              >
                Add
              </Button>
            )}
            <Link to={"/users"}>
              {"  "}
              <Button variant="secondary">Cancel</Button>
            </Link>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default AddEditUser;
