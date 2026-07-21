import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
    { to: '/dashboard', label: '생산현황' },
    { to: '/plans', label: '생산계획' },
    { to: '/productions', label: '생산실적' },
    { to: '/equipments', label: '설비관리' },
];

const Navbar = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark layout-navbar">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">
                    <img src="/facflow_icon.png" alt="FacFlow" height="30" className="me-2" />
                    <span className="fw-bold">FacFlow</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    aria-controls="navbarNav"
                    aria-expanded={expanded}
                    aria-label="Toggle navigation"
                    onClick={() => setExpanded((v) => !v)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse${expanded ? ' show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav">
                        {NAV_LINKS.map(({ to, label }) => (
                            <li className="nav-item" key={to}>
                                <Link
                                    className="nav-link"
                                    to={to}
                                    onClick={() => setExpanded(false)}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;