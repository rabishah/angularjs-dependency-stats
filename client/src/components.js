import React from 'react';
import styled from 'styled-components';
import _Panel from './Panel';

export const Panel = _Panel;

export const Caption = styled.i`
font-style: italic;
`;

export const Card = styled.div`
background-color: #f4f6f8;
padding: 10px;
display: flex;
flex-direction: column;
align-items: center;
`;

export const CardTitle = styled.div`
text-decoration: underline;
padding: 0 10px 10px 10px;
font-size: 16px;
font-weight: bold;
`;

export const CardValue = styled.div`
font-size: 32px;
`;

export const Title = styled.h1`
    font-size: 28px;
    line-height: 32px;
    font-weight: 500;
`;

export const Monospace = styled.span`
    font-family:monospace;
`;

export const SearchInput = styled.input`
    width: 100%;
    font-size: 18px;
    border: 0px;
    padding: 10px;
    outline: none;
`;