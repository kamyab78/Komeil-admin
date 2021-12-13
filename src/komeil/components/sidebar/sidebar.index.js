import React, {useEffect, useState} from 'react';
import './sidebar.style.scss'
import ProfilePic from '../../../assets/image/emptyProfile2.png'
import {NavLink, useHistory} from 'react-router-dom'

const Sidebar = function (props) {
    const history = useHistory()
    const [status, setStatus] = useState(false)
    useEffect(() => {
        setStatus(props.status)
    }, [props.status])

    function onBlackCLickHandler() {
        props.isBlackClick()
    }

    return (
        <React.Fragment>
            <div className={`komeil-sidebar ${status ? 'active' : ''}`}>
                <div className='profile'>
                    <h3>پنل مدیریت</h3>
                    <img src={ProfilePic} alt='Profile-pic'/>
                </div>
                <NavLink  onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/statistic'} className='items'>
                    <p>امار</p>
                    <i className="material-icons">
                        list_alt
                    </i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/users'} className='items'>
                    <p>مدیریت کاربران</p>
                    <i className="material-icons">
                        group
                    </i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/product'} className='items'>
                    <p>مدیرت کالاها</p>
                    <i className="material-icons">
                        leaderboard
                    </i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/amazingoffer'} className='items'>
                    <p>مدیرت پیشنهاد ویژه</p>
                    <i className="material-icons">
                        local_offer
                    </i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/productitemColor'} className='items'>
                    <p>مدیریت محصول-رنگ  </p>
                    <i className="material-icons">
                    palette
                    </i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/news'} className='items'>
                    <p>مدیریت اخبار</p>
                    <i className="material-icons">
                        notification_important
                    </i>
                </NavLink>
                 <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/category'} className='items'>
                    <p>مدیریت دسته بندی</p>
                    <i className="material-icons">
                        account_balance
                    </i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/filter'} className='items'>
                    <p>فیلتر ها</p>
                    <i className="material-icons">
                        report
                    </i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/transport'} className='items'>
                    <p>مدیریت نحوه ارسال ها</p>
                    <i className="material-icons-outlined">
list
</i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/order'} className='items'>
                    <p>لیست سفارش ها</p>
                    <i className="material-icons-outlined">
local_shipping
</i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/brand'} className='items'>
                    <p>برند</p>
                    <i className="material-icons-outlined">
                    branding_watermark
</i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/color'} className='items'>
                    <p>رنگ</p>
                    <i className="material-icons-outlined">
                    palette
</i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/banner'} className='items'>
                    <p>بنر</p>
                    <i className="material-icons-outlined">
ad_units
</i>
                </NavLink>
                <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/ticket'} className='items'>
                    <p>پیام ها</p>
                    <i className="material-icons">
                        mail
                    </i>
                </NavLink>
                  <NavLink onClick={onBlackCLickHandler} activeClassName="active" to={'/dashboard/setting'} className='items'>
                    <p>تنظیمات</p>
                    <i className="material-icons">
                        settings
                    </i>
                </NavLink>

                <span className='spacer'/>
                <div onClick={() => {
                    localStorage.setItem('isLogin', 'false')
                    setTimeout(() => {
                        window.location.replace('/login')
                    }, 1000)
                }} className='items'>
                    <p>خروج</p>
                    <i className="material-icons">
                        logout
                    </i>
                </div>

            </div>
            <div onClick={onBlackCLickHandler} className={`komeil-sidebar-black ${status ? 'active' : ''}`}/>
        </React.Fragment>
    );
};
export default Sidebar
