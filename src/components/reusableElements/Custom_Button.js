import { Button } from '@material-ui/core'
import React from 'react'

function Custom_Button({ variant, size, label, accessGranted, ...props }) {


    let button;
    if (accessGranted) {
        button = <Button 
        variant={variant} 
        size={size} 
        disabled={props.disabled}
        color={props.color}
        style={props.style}
        onClick = {props.onClick}>{label}</Button>;
    } else {
        button = <span />;
    }

    return (
        <div>
            {button}
        </div>
    );
}

export default Custom_Button