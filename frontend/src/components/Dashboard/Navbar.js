import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark offset-md-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          {props.heading}
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            {props.btn1 && (
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" href="#">
                  <button className="btn btn-primary" onClick={props.btn1Click}>
                    {props.btn1}
                  </button>
                </Link>
              </li>
            )}
          </ul>
          <form class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              class="btn btn-outline-success"
              type="submit"
              onSubmit={props.onSearch}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
