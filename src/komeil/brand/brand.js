import React, {useEffect, useRef, useState} from 'react';
import './brand.scss'
import {Button, Card, Col, Divider, Input, Modal, Row, Spin,  Table, Tag, Typography} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {del, get, post, put, responseValidator, upload} from "../../api";
import Switch from '@material-ui/core/Switch';
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom'
import ProfilePic from "../../assets/image/emptyProfile.png";
import {Config} from '../../util/config'
const Brand = function (props) {
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
    const [createbrandModal, setCreatebrandModal] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [imageUploader, setImageUploader] = useState(null)
    const uploadRef = useRef(null)
    const uploadTools = useRef();
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [createTopic, setCreateTopic] = useState(null)
    const [createText, setCreateText] = useState(null)
    const [promote,setPromote]=useState(false)
    const [vip,setvip]=useState(false)
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

        fetch(Config()['apiUrl'] + "/admin/brand?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                

                              rep.map((item) => {
                    allData.push({
                        key: item.id,
                       
                        text:
                            item.description !== null ? item.description : "تنظیم نشده است",
                        topic:
                            item.title !== null ? item.title : "تنظیم نشده است",
                        imageurl: item.imageUrl ? item.imageUrl : "تنظیم نشده است",
                        vip: item.vip ,
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
            title: "عکس",
            dataIndex: "imageurl",
            key: "imageurl",
            render: item =>
            <div className='profile-pic-container'>
                <img src={item} className="profile-pic"/>
            </div>,

        },
        {
            title: "موضوع",
            dataIndex: "topic",
            key: "topic",
            render: text => <span>{text}</span>,
            ...getColumnSearchProps("topic"),
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
            title: "ویژه",
            dataIndex: "vip",
            key: "vip",

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
          <Text
              onClick={() => {
                  setIsModalOpen(true);
                  setIdSelected(text)
              }}
              style={{cursor: 'pointer'}}
              className="gx-link"
          >
            نمایش
          </Text>
          <Divider type="vertical"/>
          <Text type='warning' onClick={() => {
              setCreateTopic(text.topic)
              setCreateText(text.text)
              setImageUploader(text.imageurl)
              setIdSelected(text)
              setvip(text.vip)
              setCreatebrandModal(true)
              setPromote(text.promote)
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
    
            fetch(Config()['apiUrl'] + "/admin/changestatebrand?id="+idSelected.key+"&username="+localStorage.getItem('username'), requestOptions)
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
            "title": createTopic,
            "vip":vip
        
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
    
            fetch(Config()['apiUrl'] + "/admin/brand?id="+idSelected.key+"&username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد');
        setIdSelected(null)
        setCreatebrandModal(false)
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
    
            fetch(Config()['apiUrl'] + "/admin/brand?username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setCreatebrandModal(false)
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
    const handleChange = (event) => {
        setvip(event.target.checked);
      };
    return (
        <div className='brand-list-page'>
            <Modal closable={false} className='brand-preview-modal' footer={[
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
                {idSelected && <div className='brand-modal-preview'>
                    <img src={idSelected.imageurl} alt='brand'/>
                    <div className='header'>
                        
                        <h2>  {idSelected.topic}  {idSelected.promote && <Tag color='red'>فعال</Tag> }</h2>
                    </div>
                    <p>{idSelected.text}</p>
                </div>
                }
            </Modal>


            <Modal closable={false} className='brand-delete-modal' footer={[
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
                {idSelected && <div className='brand-modal-preview'>
                    <p>از تغییر وضعیت این برند اطمینان دارید ؟</p>
                </div>
                }
            </Modal>

            <Modal closable={false} className='brand-delete-modal' footer={[
                <Button onClick={() => {
                    setCreatebrandModal(false);
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
                setCreatebrandModal(false);
                setIdSelected(null)
                setCreateText(null)
                setCreateTopic(null)
                setImageUploader(null)
                    setPromote(false)
            }} visible={createbrandModal}>

                <div className='create-brand-modal-preview'>
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
                    
                    <Switch
        checked={vip}
        onChange={handleChange}
        name="vip"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
                </div>

            </Modal>

            <Card title={
                <div className='get_list_brand_title'>
                    <p>لیست برند</p>
                    <span/>
                    <Button onClick={() => setCreatebrandModal(true)} type={"primary"}>ثبت برند جدید</Button>
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
export default Brand

