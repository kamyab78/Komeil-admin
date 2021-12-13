import React, {useEffect, useRef, useState} from 'react';
import './productitemColor.scss'
import {Button, Card, Col, Divider, Input, Modal, Row, Spin, Switch, Table, Tag, Typography,Dropdown,Menu,Select} from "antd";
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
const { Option } = Select;
const Productitemcolor = function (props) {
  
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
    const [createProductitemcolorModal, setCreateProductitemcolorModal] = useState(false)
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
    const [angleRadiationidlist,setangleRadiationidlist]=useState([])
    const [idselectedproduct,setidselectedproduct]=useState(0)
    const [idselect,setidselect]=useState(0)
    const [number,setnumber]=useState(0)
    const [nameselectedproduct,setnameselectedproduct]=useState('')
    const [dataproduct,setdataproduct]=useState([])
    const [colornameselected,setcolornameselected]=useState([])
    const [colorlist,setcolorlist]=useState([])
    
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

        fetch(Config()['apiUrl'] + "/admin/Productitemcolor?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)
setdataproduct(rep)
                              rep.map((item) => {
                    allData.push({
                        key: item.id,
                       number:item.number,
                       color:item.color.name,
                        topic:
                            item.productItem.name !== null ? item.productItem.name : "تنظیم نشده است",
                            promote: item.enable 
                       
                  
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
        getcolor()
    }, []);
    function getcolor(){
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')
    
            }
    
    
        };
    
        fetch(Config()['apiUrl'] + "/admin/color?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {
    
    
                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)
    
            
                setcolorlist(rep);
                })
    
    
    
    
    
            })
            .catch(error => console.log('error', error));
    }
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
            title: "تعداد",
            dataIndex: "number",
            key: "number",
            render: text => <span>{text}</span>,
            ...getColumnSearchProps("number"),
        },
        {
            title: "رنگ نور",
            dataIndex: "color",
            key: "color",
            render: text => <span>{text}</span>,
            ...getColumnSearchProps("color"),
        },
        {
            title: "وضعیت",
            dataIndex: "promote",
            key: "promote",
            render: status => {
             
                let color;
                if (status) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status ? 'فعال' : 'غیر فعال'}
                    </Tag>
                );
            },
            filters: [
                {text: "غیر فعال", value: false},
                {text: "فعال", value: true},
            ],
            onFilter: (value, record) => record.promote.valueOf() === value

        },
        {
            title: "عملیات",
            key: "action",
            render: (text) => (
                <span>
           <Text type='warning' onClick={() => {
              setCreateTopic(text.topic)
              setCreateText(text.text)
             setnumber(text.number)
              setIdSelected(text)
              console.log(text)
              setCreateProductitemcolorModal(true)
              
          }} style={{cursor: 'pointer'}}
                className="gx-link">
            ویرایش
          </Text>
          <Divider type="vertical"/>
          <Text type='danger' onClick={() => {
              setDeleteModal(true);
              setIdSelected(text)
          }} style={{cursor: 'pointer'}} className="gx-link"> تغییر وضعیت</Text>
          </span>
         )}
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
    
            fetch(Config()['apiUrl'] + "/admin/changestateProductitemcolor?id="+idSelected.key+"&username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setDeleteLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setDeleteModal(false)
        window.location.reload()

        // getData()
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
            "id":idselect ,
  "num": number,
  "productid": idselectedproduct
           
          
        
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
    
            fetch(Config()['apiUrl'] + "/admin/Productitemcolor?username="+localStorage.getItem('username')+"&id="+idSelected.key, requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setCreateProductitemcolorModal(false)
        setCreateText(null)
        setCreateTopic(null)
        setImageUploader(null)
            setPromote(false)
            window.location.reload()
        // getData()
    }
    else{
         toast.error('خطایی رخ داده است')
    }
                 
    
    
    
    
    
                })
                .catch(error => console.log('error', error));
        }
        else{
                 var requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    // "Authorization": "Basic " + window.localStorage.getItem('basic')
    
                },
                body:JSON.stringify(body)
    
    
            };
    
            fetch(Config()['apiUrl'] + "/admin/Productitemcolor?username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setCreateProductitemcolorModal(false)
        setCreateText(null)
        setCreateTopic(null)
        setImageUploader(null)
            setPromote(false)
            window.location.reload()
        // getData()
    }
    else{
         toast.error('خطایی رخ داده است')
    }
                 
    
    
    
    
    
                })
                .catch(error => console.log('error', error));
        }
       

        
        // }
    }

   
    function clickonitem(id,name){

setnameselectedproduct(name)
    }
    function onChange(value) {
        console.log(`selected ${value}`);
        setidselectedproduct(value)
      }
      function onSearch(val) {
        // console.log('search:', val);
      }

function clickoncoloritem(id,name){
    setcolornameselected(name)
    setidselect(id)
}

    return (
        <div className='Productitemcolor-list-page'>
            <Modal closable={false} className='Productitemcolor-preview-modal' footer={[
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
                {idSelected && <div className='Productitemcolor-modal-preview'>
                    <p style={{backgroundColor:idSelected.imageurl,width:'100px', height:'100px'}} />
                    <div className='header'>
                     
                        <h2>  {idSelected.topic}  {idSelected.promote && <Tag color='red'>فعال</Tag> }</h2>
                    </div>
                    <p>{idSelected.text}</p>
                </div>
                }
            </Modal>


            <Modal closable={false} className='Productitemcolor-delete-modal' footer={[
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
                {idSelected && <div className='Productitemcolor-modal-preview'>
                    <p>از تغییر وضعیت اطمینان دارید ؟</p>
                </div>
                }
            </Modal>

            <Modal closable={false} className='Productitemcolor-delete-modal' footer={[
                <Button onClick={() => {
                    setCreateProductitemcolorModal(false);
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
                setCreateProductitemcolorModal(false);
                setIdSelected(null)
                setCreateText(null)
                setCreateTopic(null)
                setImageUploader(null)
                    setPromote(false)
            }} visible={createProductitemcolorModal}>

                <div className='create-Productitemcolor-modal-preview'>
            
                    <div className='items my-dropdown'>
                            <label>کالاها : </label>
                            <Select
    showSearch
    style={{ width: 200 }}
    placeholder="Select a person"
    optionFilterProp="children"
    onChange={onChange}
    onSearch={onSearch}
    filterOption={(input, option) =>
        //    console.log('inp '+input)
        // console.log(option.children)
        option.children.indexOf(input.toLowerCase()) >= 0
    
     
      
    }
  >
       {productlist.map((result)=>(
           <Option value={result.id}>{result.name}</Option>
       ))}
    
   
  </Select>

                            {/* <Dropdown overlay={(
                                <Menu style={{overflow:'scroll',height:'300px'}}>
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
                      */}
                        </div>
                        <div className='items my-dropdown'>
                            <label>رنگ نور : </label>
                            <Dropdown  overlay={(
                                <Menu >
                                    {colorlist.map((result)=>(
                                        // {console.log(result)}
   <Menu.Item>
                                        <div onClick={() => clickoncoloritem(result.id,result.name)}
                                             className='one-card-drop-down-selected network'>
                                            <h4>{result.name}</h4>
                                        </div>
                                    </Menu.Item>
                                    ))}
 
                               
                     
                                </Menu>
                            )} trigger={['click']}>
                                <div className='one-card-drop-down-selected payment'>
                                    <h4>{colornameselected}</h4>
                                    <DownOutlined/>
                                </div>

          
                            </Dropdown>
                        </div>
                        <div className='items'>
                        <label>تعداد</label>
                        <Input value={number} onChange={(e) => setnumber(e.target.value)}
                               placeholder='تعداد'/>
                    </div>
        

                </div>

            </Modal>

            <Card title={
                <div className='get_list_Productitemcolor_title'>
                    <p>لیست محصولات ورنگ نور</p>
                    <span/>
                    {/* {dataproduct.length<15?( */}
                        <Button onClick={() => setCreateProductitemcolorModal(true)} type={"primary"}>ثبت محصول با رنگ نور جدید</Button>  
                    {/* ):null} */}
                  
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
export default Productitemcolor

