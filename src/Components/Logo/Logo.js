import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'
import './Logo.css'

const Logo = () => {
    return(
        <div className="ma4 mt0">
            <Tilt>
                <div className="Tilt">
                    <h1><img style={{paddingTop: '20px'}} src={brain} alt="logo"></img></h1>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;