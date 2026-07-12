import React from 'react';
import { useState, useEffect } from 'react';
import { getProduction } from '../api';

    
const Productions = () => {
    const [productions, setProductions] = useState(null);
    useEffect(() => {
        const fetchProductions = async () => {
            const data = await getProduction();
            setProductions(data);
        };
        fetchProductions();
    }, []);

    return (
        <div>
            <h1>Productions</h1>
        </div>
    );
};

export default Productions;