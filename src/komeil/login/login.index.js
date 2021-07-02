import React, {useState} from 'react';
import './login.style.scss'
import {Button, Input} from "antd";
import {post, responseValidator} from "../../api";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom';
import {Config} from '../../util/config'
const Login = function () {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()

    function submitHandler() {
   const body ={
       "username":username,
       "password":password
   }
        setIsLoading(true)
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            },
            body:JSON.stringify(body)


        };

        fetch(Config()['apiUrl'] + "/admin/login", requestOptions)
            .then(response => {
                setIsLoading(false)
console.log(response)
if(response.status===200){
    response.json().then(rep=>{
        if(rep.code===200){
             localStorage.setItem('isLogin', 'true')
             localStorage.setItem('username',username)
    history.push('/dashboard/statistic');
    window.location.replace('/dashboard/statistic')
        }
        else{
            toast.error(rep.message)
        }
      
    })
 
}
else{
     toast.error('خطایی رخ داده است')
}
             





            })
            .catch(error => console.log('error', error));
        // post('/admin/login', {
        //     mobile: username,
        //     password
        // }).then(res => {
        //         setIsLoading(false)
        //         if (responseValidator(res.status)) {
        //             localStorage.setItem('isLogin', 'true')
        //             setTimeout(() => {
        //                 history.push('/dashboard/statistic');
        //                 window.location.replace('/dashboard/statistic')
        //             }, 1000)
        //         } else
        //             toast.error('نام کاربری یا رمز عبور صحیح نمی باشد')
        //     }
        // )
    }

    return (
        <div className='tarhim-login-page'>
            <div className='content'>
                <h1>مدیریت کمیل</h1>
                <p> لطفا با نام کاربری و رمز عبور مدیریت وارد شوید</p>
                <Input onChange={(e) => setUsername(e.target.value)} value={username} className='my-input'
                       placeholder='نام کاربری'/>
                <Input onPressEnter={submitHandler} onChange={e => setPassword(e.target.value)} value={password}
                       className='my-input'
                       placeholder='رمز عبور' type='password'/>
                <Button loading={isLoading} onClick={submitHandler} className='my-btn' type={"primary"}>ورود</Button>
            </div>
        </div>
    );
};
export default Login
