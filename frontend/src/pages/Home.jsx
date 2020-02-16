import React from 'react';
import logo from '../bufficorn.png';

export default (props) => {
    return <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Default Account: <code>{props.state.defaultAccount}</code>
    </header>;
}