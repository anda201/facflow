import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
    background-color: var(--white-a-40);
    border-radius: 12px;
    border-color: var(--gray-200);
    color: var(--gray-900);
    font-weight: 600;
    box-shadow: 0 0px 8px rgba(0, 0, 0, 0.1);
`

const Card = () => {
    return(
        <CardContainer className="card flex-1 border-1 px-4 py-3">
            <div className="fs-5 " >오늘의 생산량</div>
        </CardContainer>
    );
};

export default Card;