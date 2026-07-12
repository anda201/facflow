import React from 'react';
import { useState, useEffect } from 'react';
import { getEquipment } from '../api';

const Equipments = () => {
    const [equipments, setEquipments] = useState(null);
    useEffect(() => {
        const fetchEquipments = async () => {
            const data = await getEquipment();
            setEquipments(data);
        };
        fetchEquipments();
    }, []);

    return (
        <div>
            <h1>Equipments</h1>
        </div>
    );
};

export default Equipments;