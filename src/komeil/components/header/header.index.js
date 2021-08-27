import React from 'react';
import './header.style.scss'
import {Link, useHistory} from 'react-router-dom'

const Header = function (props) {

    const histoy = useHistory()

    function openHandler() {
        //   while (true)
        props.hamburgerCLick(true)
    }

    return (
        <div className='komeil-main-header'>
            <Link to={'/dashboard'}>
                <h1>کمیل</h1>
            </Link>
            <span/>
            <i onClick={openHandler} className="material-icons">
                menu
            </i>
        </div>
    );
};
export default Header
