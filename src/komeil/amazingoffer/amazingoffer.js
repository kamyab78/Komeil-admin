import React, {useEffect, useRef, useState} from 'react';
import './amazing.scss'
import {Button, Card, Col, Divider, Input, Modal, Row, Spin, Switch, Table, Tag, Typography,Dropdown,Menu} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {del, get, post, put, responseValidator, upload} from "../../api";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom'
import ProfilePic from "../../assets/image/emptyProfile.png";
import {Config} from '../../util/config'
import {Calendar} from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
const Amazing = function (props) {
    const [productlist,setproductlist]=useState([])
    const searchInput = useRef();
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true)
    const allData = [];
    const history = useHistory()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [idSelected, setIdSelected] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [createamazingModal, setCreateamazingModal] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [imageUploader, setImageUploader] = useState(null)
    const uploadRef = useRef(null)
    const uploadTools = useRef();
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [createTopic, setCreateTopic] = useState(null)
    const [createText, setCreateText] = useState(null)
    const [promote,setPromote]=useState(false)
    const [selectedDay, setSelectedDay] = useState(null);
    const [startdate, setstartdate] = useState(null)
    const [isCalender, setIsCalender] = useState(false)
    const isCalenderRef = useRef()
    const [birthInputShow, setBirthInputShow] = useState()
    const [selectedDay2, setSelectedDay2] = useState(null);
    const [enddate, setenddate] = useState(null)
    const [isCalender2, setIsCalender2] = useState(false)
    const isCalenderRef2 = useRef()
    const [birthInputShow2, setBirthInputShow2] = useState()
    const [idselectedproduct,setidselectedproduct]=useState(0)
    const [nameselectedproduct,setnameselectedproduct]=useState('')
     const {Text, Link} = Typography;
    function getData() {
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/amzoffer?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

                              rep.map((item) => {
                    allData.push({
                        key: item.id,
                        enddate:new Date(item.endDate*1000).toLocaleDateString('fa-fn'),
                        startdate:new Date(item.startDate*1000).toLocaleDateString('fa-fn'),
                        topic:
                            item.productname !== null ? item.productname : "تنظیم نشده است",
                       
                  
                    });
                });
                setUsers(allData);
                })





            })
            .catch(error => console.log('error', error));
            
    }
function getproductlist(){
    setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/product?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

                setproductlist(rep);
                })





            })
            .catch(error => console.log('error', error));
}
    useEffect(() => {
        getData()
        getproductlist()
    }, []);
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText("");
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({
                             setSelectedKeys,
                             selectedKeys,
                             confirm,
                             clearFilters
                         }) => (
            <div style={{padding: 8}}>
                <Input
                    ref={searchInput}
                    placeholder={` جستجو ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <div>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        جستجو
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        پاک کردن
                    </Button>
                </div>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : "",
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            )
    });
    const columns = [
 
        {
            title: "نام",
            dataIndex: "topic",
            key: "topic",
            render: text => <span>{text}</span>,
            ...getColumnSearchProps("topic"),
        },

        {
            title: "تاریخ شروع",
            dataIndex: "startdate",
            key: "startdate",
            render: text => <span>{text}</span>,
            ...getColumnSearchProps("startdate"),
        },{
            title: "تاریخ پایان",
            dataIndex: "enddate",
            key: "enddate",
            render: text => <span>{text}</span>,
            ...getColumnSearchProps("topic"),
        }
    ];

    function confirmHandler() {
        setIsModalOpen(false)
        // setDeleteModal(true)
    }

    function deleteHandler() {
        
        setDeleteLoading(true)

   
     
            var requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    // "Authorization": "Basic " + window.localStorage.getItem('basic')
    
                }
    
    
            };
    
            fetch(Config()['apiUrl'] + "/admin/changestateamazing?Id="+idSelected.key, requestOptions)
                .then(response => {
    
                    setDeleteLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setDeleteModal(false)
        getData()
    }
    else{
         toast.error('خطایی رخ داده است')
    }
                 
    
    
    
    
    
                })
                .catch(error => console.log('error', error));
    }

    function createHandler() {
        setCreateLoading(true)
        const body = {
          
            "productItem": idselectedproduct,
            "endDate":enddate,
            "startDate":startdate
        
        }
        if (idSelected) {
            var requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    // "Authorization": "Basic " + window.localStorage.getItem('basic')
    
                },
                body:JSON.stringify(body)
    
    
            };
    
            fetch(Config()['apiUrl'] + "/admin/amazing?Id="+idSelected.key, requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد');
        setIdSelected(null)
        setCreateamazingModal(false)
        setCreateText(null)
        setCreateTopic(null)
        setImageUploader(null)
        setPromote(false)
        getData()
    }
    else{
         toast.error('خطایی رخ داده است')
    }
                 
    
    
    
    
    
                })
                .catch(error => console.log('error', error));
   
        } else {

            var requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    // "Authorization": "Basic " + window.localStorage.getItem('basic')
    
                },
                body:JSON.stringify(body)
    
    
            };
    
            fetch(Config()['apiUrl'] + "/admin/amzoffer?username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setCreateamazingModal(false)
        setCreateText(null)
        setCreateTopic(null)
        setImageUploader(null)
            setPromote(false)
        getData()
    }
    else{
         toast.error('خطایی رخ داده است')
    }
                 
    
    
    
    
    
                })
                .catch(error => console.log('error', error));

        }
        // }
    }

    function changeUploaderHandler(e) {
        setLoadingUpload(true)
         const FILE = e.target.files[0];
        const form = new FormData();
        form.append('file', FILE);
        var requestOptions = {
            method: 'POST',
            headers: {
       
            },
            body:form


        };

        fetch(Config()['apiUrl'] + "/utility/image", requestOptions)
            .then(response => {



                response.json().then(rep => {
                    setLoadingUpload(false)
                    setImageUploader(rep.path)

                })





            })
            .catch(error => console.log('error', error));
    
    }
    function datePickerHandler(e) {
        setSelectedDay(e);
      //  setBirthInputShow(e.year + "/" + e.month + "/" + e.day)


        const JalaliDate = {
            g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
        };

        JalaliDate.jalaliToGregorian = function (j_y, j_m, j_d) {
            j_y = parseInt(j_y);
            j_m = parseInt(j_m);
            j_d = parseInt(j_d);
            var jy = j_y - 979;
            var jm = j_m - 1;
            var jd = j_d - 1;

            var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
            for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

            j_day_no += jd;

            var g_day_no = j_day_no + 79;

            var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
            g_day_no = g_day_no % 146097;

            var leap = true;
            if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
            {
                g_day_no--;
                gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
                g_day_no = g_day_no % 36524;

                if (g_day_no >= 365) g_day_no++;
                else leap = false;
            }

            gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
            g_day_no %= 1461;

            if (g_day_no >= 366) {
                leap = false;

                g_day_no--;
                gy += parseInt(g_day_no / 365);
                g_day_no = g_day_no % 365;
            }

            for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
                g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
            var gm = i + 1;
            var gd = g_day_no + 1;

            gm = gm < 10 ? "0" + gm : gm;
            gd = gd < 10 ? "0" + gd : gd;

            return [gy, gm, gd];
        }

        let jD = JalaliDate.jalaliToGregorian(e.year, e.month, e.day),
            jResult = jD[0] + "/" + jD[1] + "/" + jD[2]
        const unixTime=new Date(jD[0],jD[1]-1,jD[2]).valueOf()/1000;
         setstartdate(unixTime);
           setBirthInputShow(new Date(unixTime*1000).toLocaleDateString('fa'))
        setIsCalender(false);
    }
    function datePickerHandler2(e) {
        setSelectedDay2(e);



        const JalaliDate = {
            g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
        };

        JalaliDate.jalaliToGregorian = function (j_y, j_m, j_d) {
            j_y = parseInt(j_y);
            j_m = parseInt(j_m);
            j_d = parseInt(j_d);
            var jy = j_y - 979;
            var jm = j_m - 1;
            var jd = j_d - 1;

            var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
            for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

            j_day_no += jd;

            var g_day_no = j_day_no + 79;

            var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
            g_day_no = g_day_no % 146097;

            var leap = true;
            if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
            {
                g_day_no--;
                gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
                g_day_no = g_day_no % 36524;

                if (g_day_no >= 365) g_day_no++;
                else leap = false;
            }

            gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
            g_day_no %= 1461;

            if (g_day_no >= 366) {
                leap = false;

                g_day_no--;
                gy += parseInt(g_day_no / 365);
                g_day_no = g_day_no % 365;
            }

            for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
                g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
            var gm = i + 1;
            var gd = g_day_no + 1;

            gm = gm < 10 ? "0" + gm : gm;
            gd = gd < 10 ? "0" + gd : gd;

            return [gy, gm, gd];
        }

        let jD = JalaliDate.jalaliToGregorian(e.year, e.month, e.day),
            jResult = jD[0] + "/" + jD[1] + "/" + jD[2]
        const unixTime=new Date(jD[0],jD[1]-1,jD[2]).valueOf()/1000;
         setenddate(unixTime);
          setBirthInputShow2(new Date(unixTime*1000).toLocaleDateString('fa'))
        setIsCalender2(false);
    }
    function clickonitem(id,name){
setidselectedproduct(id)
setnameselectedproduct(name)
    }
    return (
        <div className='amazing-list-page'>
            <Modal closable={false} className='amazing-preview-modal' footer={[
                <Button onClick={() => {
                    setIsModalOpen(false);
                    setIdSelected(null)
                }} key="back">
                    بستن
                </Button>,
                <Button key="submit" type="primary" onClick={confirmHandler}>
                    تغییر
                </Button>,

            ]} onCancel={() => {
                setIsModalOpen(false);
                setIdSelected(null)
            }} visible={isModalOpen}>
                {idSelected && <div className='amazing-modal-preview'>
                    <p style={{backgroundColor:idSelected.imageurl,width:'100px', height:'100px'}} />
                    <div className='header'>
                     
                        <h2>  {idSelected.topic}  {idSelected.promote && <Tag color='red'>فعال</Tag> }</h2>
                    </div>
                    <p>{idSelected.text}</p>
                </div>
                }
            </Modal>


            <Modal closable={false} className='amazing-delete-modal' footer={[
                <Button onClick={() => {
                    setDeleteModal(false);
                    setIdSelected(null)
                }} key="back">
                    خیر
                </Button>,
                <Button loading={deleteLoading} key="submit" type="primary" onClick={deleteHandler}>
                    بله
                </Button>,

            ]} onCancel={() => {
                setDeleteModal(false);
                setIdSelected(null)
            }} visible={deleteModal}>
                {idSelected && <div className='amazing-modal-preview'>
                    <p>از تغییر وضعیت این خبر اطمینان دارید ؟</p>
                </div>
                }
            </Modal>

            <Modal closable={false} className='amazing-delete-modal' footer={[
                <Button onClick={() => {
                    setCreateamazingModal(false);
                    setIdSelected(null)
                    setCreateText(null)
                    setCreateTopic(null)
                    setImageUploader(null)
                        setPromote(false)
                }} key="back">
                    لغو
                </Button>,
                <Button loading={createLoading} key="submit" type="primary" onClick={createHandler}>
                    {idSelected ? 'تغییر' : 'ایجاد'}
                </Button>,

            ]} onCancel={() => {
                setCreateamazingModal(false);
                setIdSelected(null)
                setCreateText(null)
                setCreateTopic(null)
                setImageUploader(null)
                    setPromote(false)
            }} visible={createamazingModal}>

                <div className='create-amazing-modal-preview'>
                    <div className='profile-pic'>
                       
                    </div>
                    <div className='items my-dropdown'>
                            <label>کالاها : </label>
                            <Dropdown overlay={(
                                <Menu>
                                    {productlist.map((result)=>(
                                        // {console.log(result)}
   <Menu.Item>
                                        <div onClick={() => clickonitem(result.id,result.name)}
                                             className='one-card-drop-down-selected network'>
                                            <h4>{result.name}</h4>
                                        </div>
                                    </Menu.Item>
                                    ))}
 
                               
                     
                                </Menu>
                            )} trigger={['click']}>
                                <div className='one-card-drop-down-selected payment'>
                                    <h4>{nameselectedproduct}</h4>
                                    <DownOutlined/>
                                </div>
                            </Dropdown>
                        </div>
                  
                    <div className='items'>
                            <label>تاریخ شروع</label>
                            <div className='birth'>
                                <Input onClick={() => setIsCalender(true)} value={birthInputShow} readOnly={true}
                                       placeholder='تاریخ شروع'/>
                                <i onClick={() => setIsCalender(!isCalender)} className="icon icon-calendar"/>
                                <div ref={isCalenderRef} className={`my-calender ${isCalender ? 'active' : ''}`}>
                                    <Calendar
                                        colorPrimary={'#157DE1'}
                                        value={selectedDay}
                                        locale="fa"
                                        onChange={datePickerHandler}
                                        shouldHighlightWeekends
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='items'>
                            <label>تاریخ پایان</label>
                            <div className='birth'>
                                <Input onClick={() => setIsCalender2(true)} value={birthInputShow2} readOnly={true}
                                       placeholder='تاریخ پایان'/>
                                <i onClick={() => setIsCalender2(!isCalender2)} className="icon icon-calendar"/>
                                <div ref={isCalenderRef2} className={`my-calender ${isCalender2 ? 'active' : ''}`}>
                                    <Calendar
                                        colorPrimary={'#157DE1'}
                                        value={selectedDay2}
                                        locale="fa"
                                        onChange={datePickerHandler2}
                                        shouldHighlightWeekends
                                    />
                                </div>
                            </div>
                        </div>
                    

                </div>

            </Modal>

            <Card title={
                <div className='get_list_amazing_title'>
                    <p>لیست پیشنهاد ویژه</p>
                    <span/>
                    <Button onClick={() => setCreateamazingModal(true)} type={"primary"}>ثبت پیشنهاد ویژه جدید</Button>
                </div>

            }>
                <Table
                    loading={loading}
                    pagination={8}
                    bordered={true}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={users}
                />
            </Card>
        </div>
    );
};
export default Amazing

