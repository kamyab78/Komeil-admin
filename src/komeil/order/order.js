import React, {useEffect, useRef, useState} from 'react';
import './order.scss'
import {Button, Card, Col, Divider, Input, Modal, Row, Spin, Switch, Table, Tag, Typography} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {del, get, post, put, responseValidator, upload} from "../../api";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom'
import ProfilePic from "../../assets/image/emptyProfile.png";
import {Config} from '../../util/config'
const Order = function (props) {
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
    const [createorderModal, setCreateorderModal] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [imageUploader, setImageUploader] = useState(null)
    const uploadRef = useRef(null)
    const uploadTools = useRef();
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [createTopic, setCreateTopic] = useState(null)
    const [createText, setCreateText] = useState(null)
    const [promote,setPromote]=useState(false)
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

        fetch(Config()['apiUrl'] + "/admin/orders?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

                              rep.map((item) => {
                                    var productname=[]
                                  for(var i=0;i<item.productItems.length;i++){
                                    productname.push(item.productItems[i].ProductName)
                                
                                  }
                                
                    allData.push({
                        key: item.id,
                       
                        text:
                            item.description !== null ? item.description : "تنظیم نشده است",
                        address:
                             "تنظیم نشده است",
                            
                       product: productname,
                        promote: item.orderListStatus ,
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
            title: "آدرس",
            dataIndex: "address",
            key: "address",
            render: text => <span>{text}</span>,
            ...getColumnSearchProps("address"),

        },
        {
            title: "محصولات",
            dataIndex: "product",
            key: "product",
            render: text =>{
                console.log(text)
                     return(
                <>
          
            {text.map(tag => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))}
           </>
            )
            }
       
          
                // <Tag color='green' key={text}>{text}</Tag>
           
            ,
        
        },

        {
            title: "متن",
            dataIndex: "text",
            key: "text",

            render: text => (
                <>
                    <span>
                        {text.length > 80 ? text.substr(0, 80) + '...' : text}
                    </span>
                </>
            )
        },
          {
            title: "وضعیت",
            dataIndex: "promote",
            key: "promote",
            render: status => (
             
                <>
                <span>
                    {status}
                </span>
            </>
            )
   
        },
        {
            title: "عمیات ها",
            key: "action",
            render: (text) => (
                <span>

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
    
            fetch(Config()['apiUrl'] + "/admin/changestateorder?id="+idSelected.key, requestOptions)
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
            "description": createText,
            "imageurl": imageUploader,
            "title": createTopic
        
        }
     console.log(body)
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
    
            fetch(Config()['apiUrl'] + "/admin/order?id="+idSelected.key, requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد');
        setIdSelected(null)
        setCreateorderModal(false)
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
    
            fetch(Config()['apiUrl'] + "/admin/order", requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setCreateorderModal(false)
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

    return (
        <div className='order-list-page'>
            <Modal closable={false} className='order-preview-modal' footer={[
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
                {idSelected && <div className='order-modal-preview'>
                    <img src={idSelected.imageurl} alt='order'/>
                    <div className='header'>
                        
                        <h2>  {idSelected.topic}  {idSelected.promote && <Tag color='red'>فعال</Tag> }</h2>
                    </div>
                    <p>{idSelected.text}</p>
                </div>
                }
            </Modal>


            <Modal closable={false} className='order-delete-modal' footer={[
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
                {idSelected && <div className='order-modal-preview'>
                    <p>از تغییر وضعیت این برند اطمینان دارید ؟</p>
                </div>
                }
            </Modal>

            <Modal closable={false} className='order-delete-modal' footer={[
                <Button onClick={() => {
                    setCreateorderModal(false);
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
                setCreateorderModal(false);
                setIdSelected(null)
                setCreateText(null)
                setCreateTopic(null)
                setImageUploader(null)
                    setPromote(false)
            }} visible={createorderModal}>

                <div className='create-order-modal-preview'>
                    <div className='profile-pic'>
                        <img src={imageUploader ? imageUploader : ProfilePic} alt='profile-pic'/>
                        <input accept="image/*" onChange={changeUploaderHandler} ref={uploadRef} className='uploader' type='file'/>
                        <div onClick={() => uploadRef.current.click()} className='change-mode'>
                            <p>تعویض</p>
                        </div>
                        {loadingUpload &&
                        <div onClick={() => uploadRef.current.click()} style={{display: 'flex'}}
                             className='change-mode'>
                            <Spin/>
                        </div>}
                    </div>
                    <div className='items'>
                        <label>عنوان</label>
                        <Input value={createTopic} onChange={(e) => setCreateTopic(e.target.value)}
                               placeholder='عنوان'/>
                    </div>
                    <div className='items'>
                        <label>توضیح</label>
                        <Input.TextArea value={createText} onChange={e => setCreateText(e.target.value)}
                                        placeholder='توضیح'/>
                    </div>
                    

                </div>

            </Modal>

            <Card title={
                <div className='get_list_order_title'>
                    <p>لیست سفارش ها</p>
                    <span/>
                   
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
export default Order

