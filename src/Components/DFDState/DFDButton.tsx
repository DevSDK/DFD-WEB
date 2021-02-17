import React from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IProps {
    toggle: boolean,
    onClick: any,
    text: string

}

const DFDButton: React.FC<IProps> = (props) => {
    var color = "black"
    if (props.toggle) {
        color = "cyan"
    }
    return (
        <button style={{ color: color }} className="Dfd-Buttons" onClick={props.onClick}>{props.text}</button>
    );
};

export default DFDButton;