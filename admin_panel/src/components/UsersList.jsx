/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Button,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";

import UsersPagination from "./UsersPagination";
import ModalDialog from "./ModalDialog";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { FcAlphabeticalSortingAz } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UsersList.css";

function UsersList(props) {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isAscending, setIsAscending] = useState(false);
  const [usersPages, setUsersPages] = useState();
  const [page, setPage] = useState(1);

  const history = useHistory();
  //Close the modal
  const handleClose = () => setShow(false);

  //Set the id corresponding to the element that is going to be deleted
  //and show the modal for deletion aproval
  const handleShow = (id) => {
    setSelectedId(id);
    setShow(true);
  };
  const [selectedFile, setSelectedFile] = useState(null);

  const notifyDelete = () => toast("User Deleted!");
  const notifyUploadWarning = () =>
    toast("Please first select a file for upload!");
  const notifyUploadComplete = () => toast("File uploaded!");

  //Pagination Logic

  const usersPerPage = 8;
  function onPageChange(page) {
    setPage(page);
  }

  //If no left users on the page
  if (usersPages === users.length / usersPerPage && page > usersPages) {
    onPageChange(page - 1);
  }

  //Set pages according to all user's count
  useEffect(() => {
    let usersPages = Math.ceil(users.length / usersPerPage);
    if (users.length) {
      setUsersPages(usersPages);
    }
  }, [users]);

  //Get all users
  useEffect(() => {
    fetch("http://localhost:3001/employees")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const deleteUser = () => {
    const newArrayUsers = users.filter((user) => user.id !== selectedId);
    setUsers(newArrayUsers);
    async function deleteID(id) {
      const res = await fetch(`http://localhost:3001/employees/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      return res;
    }
    deleteID(selectedId)
      .then((response) => {
        response.status === 200 ? notifyDelete() : console.log("alabal");
      })
      .catch((err) => console.log(err));
    handleClose();
  };

  const searchByFirstName = (name) => {
    async function searchName() {
      await fetch(`http://localhost:3001/employees?first_name_like=${name}`)
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }
    searchName();
  };

  const sortByFirstName = () => {
    function sort() {
      if (!isAscending) {
        fetch(`http://localhost:3001/employees?_sort=first_name&_order=asc`)
          .then((res) => res.json())
          .then((data) => setUsers(data))
          .then(() => setIsAscending(true));
      } else {
        fetch(`http://localhost:3001/employees?_sort=first_name&_order=desc`)
          .then((res) => res.json())
          .then((data) => setUsers(data))
          .then(() => setIsAscending(false));
      }
    }
    sort();
  };

  //Handlers for file select and upload

  const onChangeHandler = (event) => {
    event.preventDefault();
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };
  const onSubmitClickHandler = () => {
    if (selectedFile) {
      const data = new FormData();
      data.append("file", selectedFile);

      fetch("http://localhost:8000/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => console.log(res))
        .then(() => notifyUploadComplete());
    } else {
      notifyUploadWarning();
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    props.handleLogout("");
    history.push("/");
  };

  const tableContent = (user) => {
    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user["first_name"]}</td>
        <td>{user["last_name"]}</td>
        <td>{user.email}</td>
        <td>{user.phone}</td>
        <td>
          {user.active ? (
            <Badge pill variant="success">
              Active
            </Badge>
          ) : (
            <Badge pill variant="danger">
              Inactive
            </Badge>
          )}
        </td>
        <td>
          <Link to={`/edit/${user.id}`}>
            <Button>Edit</Button>{" "}
          </Link>
          <Button variant="danger" onClick={() => handleShow(user.id)}>
            Delete
          </Button>
        </td>
      </tr>
    );
  };
  return (
    <Container style={{ marginTop: "10px" }}>
      <ToastContainer />
      {ModalDialog(show, handleClose, deleteUser)}
      <Form>
        <Row>
          <Col>
            <Button>
              <input
                type="file"
                name="file"
                onChange={(e) => onChangeHandler(e)}
              />
            </Button>
          </Col>
          <Col>
            <Button onClick={() => onSubmitClickHandler()}>Upload file</Button>
          </Col>

          <Col className="d-flex justify-content-end ">
            <div style={{ marginRight: "15px" }}>
              <Link to="/addUser">
                <Button variant="secondary">Add User</Button>
              </Link>
            </div>
            {/* <Link to="/login"> */}
            <div>
              <Button onClick={() => handleLogout()} variant="secondary">
                Logout
              </Button>
            </div>
            {/* </Link> */}
          </Col>
        </Row>
        <Row className="mt-3 mb-3">
          <Col>
            <Form.Control
              onChange={(ev) => {
                searchByFirstName(ev.target.value);
              }}
              placeholder="Search by first name"
            />
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>
              First Name{" "}
              <FcAlphabeticalSortingAz onClick={() => sortByFirstName()} />{" "}
            </th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Employee Mobile</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            if (page === 1 && index < usersPerPage) {
              return tableContent(user);
            } else if (
              index >= (page - 1) * usersPerPage &&
              index < page * usersPerPage
            ) {
              return tableContent(user);
            }
          })}
        </tbody>
      </Table>
      <UsersPagination change={onPageChange} page={page} pages={usersPages} />
    </Container>
  );
}

export default UsersList;
