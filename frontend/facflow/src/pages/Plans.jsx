import React from 'react';
import { useState, useEffect } from 'react';
import { getPlan } from '../api';

const Plans = () => {
    const [plans, setPlans] = useState(null);
    useEffect(() => {
        const fetchPlans = async () => {
            const data = await getPlan();
            setPlans(data);
            console.log(data);
        };
        fetchPlans();
    }, []);

    return (
        <div>
        <h1>Plans</h1>
            <p>
                This is the plans page.
            </p>
        </div>  
    );
};

export default Plans;