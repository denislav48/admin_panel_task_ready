import React from "react";
import Pagination from "react-bootstrap/Pagination";
import "./UsersPagination.css";
function UsersPagination(props) {
  let active = props.page;
  let items = [];

  for (let number = 1; number <= props.pages; number++) {
    items.push(
      <Pagination.Item
        onClick={() => {
          props.change(number);
        }}
        key={number}
        active={number === active}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="paginationPosition">
      <Pagination>{items}</Pagination>
    </div>
  );
}

export default UsersPagination;
