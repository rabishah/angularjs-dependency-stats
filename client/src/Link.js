import React from 'react';
import history from './history';

export const Link = (props) => {
    const onClick = (e) => {
        const aNewTab = e.metaKey || e.ctrlKey;
        const anExternalLink = props.href.startsWith('http');

        if (!aNewTab && !anExternalLink) {
            e.preventDefault();
            history.push(props.href);
        }
    };

    return (
        <a href={props.href} onClick={onClick}>
            {props.children}
        </a>
    );
};