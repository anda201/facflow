import React from 'react';
import Card from '../components/common/Card';
import { getDashboard } from '../api';
import { useState, useEffect } from 'react';

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    
    useEffect(() => {
        const fetchDashboard = async () => {
            const data = await getDashboard();
            setDashboard(data);

        };
        fetchDashboard();
    }, []);

    return (
        <div>
            <h1>Dash board</h1>
            {/* 로딩 처리 필요
                {dashboard && (
                <div>
                    <h2>Achievement Rate</h2>
                    <p>{dashboard.achievementRate}</p>
                </div>
            )} */}
            <Card/> 
        </div>
    );
};

export default Dashboard;