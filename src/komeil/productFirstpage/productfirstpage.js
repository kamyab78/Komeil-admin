import React, {useEffect, useRef, useState} from 'react';
import './productfirstpage.scss'
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
const ProductFirstpage = function (props) {
  
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
    const [createproductfirstpageModal, setCreateproductfirstpageModal] = useState(false)
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
    const [dataproduct,setdataproduct]=useState([])
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

        fetch(Config()['apiUrl'] + "/admin/firstpageproduct?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)
setdataproduct(rep)
                              rep.map((item) => {
                    allData.push({
                        key: item.id,
                       
                        topic:
                            item.name !== null ? item.name : "تنظیم نشده است",
                       
                  
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
            title: "عملیات",
            key: "action",
            render: (text) => (
                <span>
          <Text type='danger' onClick={() => {
              console.log(text)
              setDeleteModal(true);
              setIdSelected(text)
          }} style={{cursor: 'pointer'}} className="gx-link"> حذف</Text>
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
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    // "Authorization": "Basic " + window.localStorage.getItem('basic')
    
                }
    
    
            };
    
            fetch(Config()['apiUrl'] + "/admin/firstpageproduct?id="+idSelected.key+"&username="+localStorage.getItem('username'), requestOptions)
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
          
            "productid": idselectedproduct,
          
        
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
    
            fetch(Config()['apiUrl'] + "/admin/firstpageproduct?username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setCreateproductfirstpageModal(false)
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
    return (
        <div className='productfirstpage-list-page'>
            <Modal closable={false} className='productfirstpage-preview-modal' footer={[
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
                {idSelected && <div className='productfirstpage-modal-preview'>
                    <p style={{backgroundColor:idSelected.imageurl,width:'100px', height:'100px'}} />
                    <div className='header'>
                     
                        <h2>  {idSelected.topic}  {idSelected.promote && <Tag color='red'>فعال</Tag> }</h2>
                    </div>
                    <p>{idSelected.text}</p>
                </div>
                }
            </Modal>


            <Modal closable={false} className='productfirstpage-delete-modal' footer={[
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
                {idSelected && <div className='productfirstpage-modal-preview'>
                    <p>از حذف این محصول اطمینان دارید ؟</p>
                </div>
                }
            </Modal>

            <Modal closable={false} className='productfirstpage-delete-modal' footer={[
                <Button onClick={() => {
                    setCreateproductfirstpageModal(false);
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
                setCreateproductfirstpageModal(false);
                setIdSelected(null)
                setCreateText(null)
                setCreateTopic(null)
                setImageUploader(null)
                    setPromote(false)
            }} visible={createproductfirstpageModal}>

                <div className='create-productfirstpage-modal-preview'>
                    <div className='profile-pic'>
                       
                    </div>
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
        //  console.log(option.children.indexOf(input.toLowerCase()))
        option.children.indexOf(input.toLowerCase()) >= 0
    
        //    console.log('inp '+input)
        // console.log(option.children)
       
    
     
      
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
                  
        

                </div>

            </Modal>

            <Card title={
                <div className='get_list_productfirstpage_title'>
                    <p>لیست محصولات صفحه اول</p>
                    <span/>
                    {dataproduct.length<15?(
                        <Button onClick={() => setCreateproductfirstpageModal(true)} type={"primary"}>ثبت محصول جدید</Button>  
                    ):null}
                  
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
export default ProductFirstpage

