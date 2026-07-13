import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">
                    <img src="/facflow_icon.png" alt="FacFlow" height="30" className="me-2" />
                    <span className="fw-bold">FacFlow</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">생산현황</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/plans">생산계획</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/productions">생산실적</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/equipments">설비관리</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;