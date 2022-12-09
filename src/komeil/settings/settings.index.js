import React, {useEffect, useState} from 'react';
import './settings.style.scss'
import {Button, Card, Input, Switch} from "antd";
import {get, post, responseValidator} from "../../api";
import {toast} from "react-toastify";
import Loading from "../../loading/loading.index";
import { Config } from '../../util/config';


const Setting = function () {
    const [partoneabout, setpartoneabout] = useState('')
    const [parttwoabout, setparttwoabout] = useState('')

    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [descriptionMetatag,setdescriptionMetatag]=useState('')
    const [canonicalMetatag,setcanonicalMetatag]=useState('')
    const [titleMetatag,settitleMetatag]=useState('')
    function getData() {
        setLoading(true)
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/Config?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)
setparttwoabout(rep[0].aboutUsPartTwo)
setpartoneabout(rep[0].aboutUsPartOne)
setdescriptionMetatag(rep[0].descriptionMetatag)
setcanonicalMetatag(rep[0].canonicalMetatag)
settitleMetatag(rep[0].titleMetatag)
                })





            })
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        getData()
    }, [])

    function submitHandler() {
        setSubmitLoading(true)
        const body = {
            "partoneaboutus": partoneabout,
            "parttwoaboutus": parttwoabout,
            "descriptionMetaTag":descriptionMetatag,
            "canonicalMetatag":canonicalMetatag,
            "titleMetatag":titleMetatag
        }
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            },
            body:JSON.stringify(body)


        };

        fetch(Config()['apiUrl'] + "/admin/Config?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)
if(rep.code===200){
    toast.success(rep.message)
}
           
                })





            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className='setting-list-page'>
            <Card loading={loading} title='تنظیمات'>
                <div className='items'>
                    <label>متن اول درباره ما </label>
                    <Input value={partoneabout} onChange={(e) => setpartoneabout(e.target.value)}
                           placeholder='متن خود را وارد کنید'/>
                </div>
                <div className='items'>
                    <label>متن دوم درباره ما</label>
                    <Input value={parttwoabout} onChange={(e) => setparttwoabout(e.target.value)}
                           placeholder='متن خود را وارد کنید'/>
                </div>
                <div className='items'>
                    <label>description landing</label>
                    <Input value={descriptionMetatag} onChange={(e) => setdescriptionMetatag(e.target.value)}
                           placeholder='متن خود را وارد کنید'/>
                </div>
                <div className='items'>
                    <label>canonical landing</label>
                    <Input value={canonicalMetatag} onChange={(e) => setcanonicalMetatag(e.target.value)}
                           placeholder='متن خود را وارد کنید'/>
                </div>
                <div className='items'>
                    <label>title landing</label>
                    <Input value={titleMetatag} onChange={(e) => settitleMetatag(e.target.value)}
                           placeholder='متن خود را وارد کنید'/>
                </div>
                <div className='my-btn'>
                      <Button type='primary' loading={submitLoading} onClick={submitHandler}>تغییر</Button>

                </div>
            </Card>
        </div>
    );
};
export default Setting