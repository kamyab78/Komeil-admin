import React, {useEffect, useState} from 'react';
import './dashboard.style.scss'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {Card} from "antd";
import {get, responseValidator} from "../../api";
import Loading from "../../loading/loading.index";


const Dashboard = function () {
    const [data, setData] = useState(null)
    const [userCount, setUserount] = useState(null)
    const [pageCount, setPageCOunt] = useState(null)

    const CustomTooltip = ({active, payload, label}) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <h4 className="label">{`تعداد : ${payload[0].value}`}</h4>
                </div>
            );
        }

        return null;
    };

    useEffect(() => {
        get('/admin/statistic?mobile=admin').then(res => {
            if (responseValidator(res.status)) {
                setData(res.data)
                const _data = res.data.userCountDetail;
                const userCount = []
                _data.map((item, index) => {
                    userCount.push({
                        count: item,
                        name: index === 0 ? 'امروز' : index === 1 ? 'دیروز' : `${index} روز قبل‍`
                    })
                })

                userCount.reverse()
                setUserount(userCount)

                const _data2 = res.data.pageCountDetail;
                const pageCount = []
                _data2.map((item, index) => {
                    pageCount.push({
                        count: item,
                        name: index === 0 ? 'امروز' : index === 1 ? 'دیروز' : `${index} روز قبل‍`
                    })
                })
                pageCount.reverse()
                setPageCOunt(pageCount)
            }


        })
    }, [])

    if (!data)
        return <Loading/>
    return (
        <div className='komeil-dashboard-page'>
            <div className='row'>
                <Card className='items'>
                    <h2>تعداد کل اعضا : </h2>
                    <p>{data.userCont} نفر</p>
                    <span/>
                    <div className='chart-responsive'>
                        <ResponsiveContainer>

                            <AreaChart
                                data={userCount}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                                <XAxis dataKey="name"/>
                                <defs>

                                    <linearGradient id="color4" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="5%" stopColor="#4ECDE4" stopOpacity={0.9}/>
                                        <stop offset="95%" stopColor="#06BB8A" stopOpacity={0.9}/>
                                    </linearGradient>
                                </defs>
                                <YAxis allowDecimals={false}/>
                                <Tooltip content={<CustomTooltip/>}/>
                                <Area fillOpacity={0.3} type="monotone" dataKey="count" fill="#8884d8"
                                      stroke="#8884d8"/>
                            </AreaChart>
                        </ResponsiveContainer>

                    </div>
                    <label>تعداد افراد عضو شده در یک هفته ی گذشته</label>
                </Card>
                <Card className='items'>
                    <h2>تعداد کل صفحات : </h2>
                    <p>{data.pageCount} عدد </p>
                    <span/>
                    <div className='chart-responsive'>
                        <ResponsiveContainer>
                            <AreaChart
                                data={pageCount}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                                  <XAxis dataKey="name"/>
                                <defs>
                                    <linearGradient id="color3" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="5%" stopColor="#163469" stopOpacity={0.9}/>
                                        <stop offset="95%" stopColor="#FE9E15" stopOpacity={0.9}/>
                                    </linearGradient>
                                </defs>
                                <YAxis allowDecimals={false}/>
                                <Tooltip content={<CustomTooltip/>}/>
                                <Area fillOpacity={0.3} type="monotone" dataKey="count" stroke="#478f7d"
                                      fill="#5bb39d"/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
 <label>تعداد صفحات ایجاد شده در یک هفته ی گذشته</label>
                </Card>
            </div>
            <div className='row'>
                <Card className='items'>
                    <h2>تعداد خرید ها : </h2>
                    <p>{data.purchaseCount} عدد</p>
                </Card>
                <Card className='items'>
                    <h2>مبلغ خرید ها : </h2>
                    <p>{data.purchaseAmount} تومان</p>
                </Card>
            </div>


        </div>
    );
};
export default Dashboard
