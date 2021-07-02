import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'antd/dist/antd.css';
import Login from "./login/login.index";
import Sidebar from "./components/sidebar/sidebar.index";
import './komeil.style.scss'
import Header from "./components/header/header.index";
import NewsList from "./newsList/newsList.index";
import Setting from "./settings/settings.index";
import Product from './product/product'
import Brand from './brand/brand'
import Color from './color/color'
import Category from './category/category'
import Banner from './banner/banner'
import User from './usersList/usersList.index'
import Transport from './transport/transport'
import Amazingoffer from './amazingoffer/amazingoffer'
import Order from './order/order'
import Ticket from './ticket/ticket'
const Komeil = function () {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false)



    function sidebarStatus() {
        setSidebarIsOpen(!sidebarIsOpen)
    }

    return (
        <Router>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {localStorage.getItem('isLogin') !== 'true' &&
            <Switch>
                <Route path='/login'>
                    <Login/>
                </Route>
                <Route path='*'>
                    <Redirect to='/login'/>
                </Route>
            </Switch>}
            {localStorage.getItem('isLogin') === 'true' &&
            <Switch>
                <Route path='/dashboard'>
                    <div className='komeil-main-page'>
                        <Sidebar isBlackClick={sidebarStatus} status={sidebarIsOpen}/>
                        <div className='komeil-main-content'>
                            <Header hamburgerCLick={sidebarStatus}/>
                            <div className='new-content'>
                                <Switch>
                                
                                   
                                    <Route path='/dashboard/news'>
                                        <NewsList/>
                                    </Route>
                                    <Route path='/dashboard/banner'>
                                        <Banner/>
                                    </Route>
                                    <Route path='/dashboard/users'>
                                        <User/>
                                    </Route>
                                    <Route path='/dashboard/transport'>
                                        <Transport/>
                                    </Route>
                                    <Route path='/dashboard/amazingoffer'>
                                        <Amazingoffer/>
                                    </Route>
                                    <Route path='/dashboard/order'>
                                        <Order/>
                                    </Route>
                                    <Route path='/dashboard/ticket'>
                                        <Ticket/>
                                    </Route>
                                   
                                    <Route path='/dashboard/product'>
                                        <Product/>
                                    </Route>
                                   
                                    <Route path='/dashboard/brand'>
                                        <Brand/>
                                    </Route>
                                    <Route path='/dashboard/color'>
                                        <Color/>
                                    </Route>
                                    <Route path='/dashboard/category'>
                                        <Category/>
                                    </Route>
                                    <Route path='/dashboard/setting'>
                                        <Setting/>
                                    </Route>
                                    <Route path='*'>
                                        <Redirect to={'/dashboard/news'}/>
                                    </Route>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </Route>
                <Route path='*'>
                    <Redirect to='/dashboard/news'/>
                </Route>
            </Switch>
            }

        </Router>
    );
};
export default Komeil
