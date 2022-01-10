import React, {useEffect, useRef, useState} from 'react';
import './discount.scss'
import {Button, Card, Col, Divider, Input, Modal, Row, Spin, Switch, Table, Tag, Typography,Menu,Dropdown} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {del, get, post, put, responseValidator, upload} from "../../api";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom'
import ProfilePic from "../../assets/image/emptyProfile.png";
import {Config} from '../../util/config'
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { Editor } from '@tinymce/tinymce-react';
const Discount = function (props) {
    const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const editorRef = useRef(null);
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
    const [creatediscountModal, setCreatediscountModal] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [hashcode, sethashcode] = useState(null)
    const [value, setvalue] = useState(null)
    const [type, settype] = useState(null)
    const[Promote,setPromote]=useState(null)

    const [discountnameselected,setdiscountnameselected]=useState('')
    const [discounttype,setdiscounttype]=useState(0)

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

        fetch(Config()['apiUrl'] + "/admin/discount?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

                              rep.map((item) => {
                    allData.push({
                        key: item.id,
                        value: item.value === " " ? "تنظیم نشده است" : item.value,
                        hashcode:item.hashcode !== null ? item.hashcode : "تنظیم نشده است",
                        type:item.discountType !== null ? item.discountType : "تنظیم نشده است",
                        promote: item.enable ,
                    });
                });
              
                setUsers(allData);
                })





            })
            .catch(error => console.log('error', error));
    }
   
  
  
    useEffect(() => {
        getData()
      
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
            title: "مقدار",
            dataIndex: "value",
            key: "value",
            render: text => <span>{text.toLocaleString()}</span>,
            ...getColumnSearchProps("value"),
        },

        {
            title: "کد",
            dataIndex: "hashcode",
            key: "hashcode",

            render: text => <span>{text}</span>,
            ...getColumnSearchProps("hashcode"),
        }, 
        {
            title: "مدل",
            dataIndex: "type",
            key: "type",

            render: text => (
                <>
                    <span>
                        {text}
                    </span>
                </>
            )
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
            title: "عمیات ها",
            key: "action",
            render: (text) => (
                <span>
         
          <Divider type="vertical"/>
          <Text type='warning' onClick={() => {
         
              setIdSelected(text)
              setCreatediscountModal(true)
              setvalue(text.value)
              sethashcode(text.hashcode)
         
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
            )
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
    
            fetch(Config()['apiUrl'] + "/admin/changestatediscount?id="+idSelected.key+"&username="+localStorage.getItem('username'), requestOptions)
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
    function getStyles(name, personName, theme) {
        return {
          fontWeight:
            personName.indexOf(name) === -1
              ? theme.typography.fontWeightRegular
              : theme.typography.fontWeightMedium,
        };
      }
    function createHandler() {
        setCreateLoading(true)
        const body = {
            "discountType": discounttype,
            "value": value,
            "hashcode": hashcode,
           
        
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
    console.log(body)
            fetch(Config()['apiUrl'] + "/admin/discount?Id="+idSelected.key+"&username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد');
        setIdSelected(null)
        setCreatediscountModal(false)
        setvalue(null)
        sethashcode(null)
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
    
            fetch(Config()['apiUrl'] + "/admin/discount?username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setCreatediscountModal(false)
        setvalue(null)
        sethashcode(null)
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


    function clickonitem(id,name){
        setdiscountnameselected(name)
        setdiscounttype(id)
        }
       function createCode(){
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/generateHashCode", requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)
 sethashcode(rep.hashcode)
                
              
                
                })





            })
            .catch(error => console.log('error', error));
       }
    return (
        <div className='discount-list-page'>
       

            <Modal closable={false} className='discount-delete-modal' footer={[
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
                {idSelected && <div className='discount-modal-preview'>
                    <p>از تغییر وضعیت این کد اطمینان دارید ؟</p>
                </div>
                }
            </Modal>

            <Modal closable={false} className='discount-delete-modal' footer={[
                <Button onClick={() => {
                    setCreatediscountModal(false);
                    setIdSelected(null)
                    setvalue(null)
                    sethashcode(null)
                  
                        setPromote(false)
                        
                }} key="back">
                    لغو
                </Button>,
                <Button loading={createLoading} key="submit" type="primary" onClick={createHandler}>
                    {idSelected ? 'تغییر' : 'ایجاد'}
                </Button>,

            ]} onCancel={() => {
                setCreatediscountModal(false);
                setIdSelected(null)
                setvalue(null)
                sethashcode(null)
              
                    setPromote(false)
            }} visible={creatediscountModal}>

                <div className='create-discount-modal-preview'>
            
                    <div className='items'>
                        <label>مقدار (برای نقدی به ریال وارد شود)</label>
                        <Input value={value} onChange={(e) => setvalue(e.target.value)}
                               placeholder='مقدار'/>
                    </div>
                    <div className='items'>
                        <label>قیمت</label>
                        <Input disabled={true} value={hashcode} 
                              />
                               <button onClick={createCode}>تولید کد تخفیف</button>
                    </div>
      
                    
                    <div className='items my-dropdown'>
                            <label>دسته بندی : </label>
                            <Dropdown overlay={(
                                <Menu>
                                   
                                       
   <Menu.Item>
                                        <div onClick={() => clickonitem("CASH","نقد")}
                                             className='one-card-drop-down-selected network'>
                                            <h4>نقد</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => clickonitem("PERCENT","درصد")}
                                             className='one-card-drop-down-selected network'>
                                            <h4>درصد</h4>
                                        </div>
                                    </Menu.Item>
 
                               
                     
                                </Menu>
                            )} trigger={['click']}>
                                <div className='one-card-drop-down-selected payment'>
                                    <h4>{discountnameselected}</h4>
                                    <DownOutlined/>
                                </div>
                            </Dropdown>
                        </div>
         

                </div>

            </Modal>

            <Card title={
                <div className='get_list_discount_title'>
                    <p>لیست تخفیفات</p>
                    <span/>
                    <Button onClick={() => setCreatediscountModal(true)} type={"primary"}>ثبت کد جدید</Button>
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
export default Discount

