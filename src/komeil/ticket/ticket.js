import React, {useEffect, useRef, useState} from 'react';
import './ticket.scss'
import {Button, Card, Col, Divider, Input, Modal, Row, Spin, Switch, Table, Tag, Typography} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {del, get, post, put, responseValidator, upload} from "../../api";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom'
import ProfilePic from "../../assets/image/emptyProfile.png";
import {Config} from '../../util/config'
const Ticket = function (props) {
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
    const [contentmessage,setcontentmessage]=useState('')
    const [mobile,setmobile]=useState('')
    const [createticketModal, setCreateticketModal] = useState(false)
    const [userid,setuserid]=useState('')
    const [ticketlist,setticketlist]=useState([])
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

        fetch(Config()['apiUrl'] + "/admin/ticket?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

                              rep.map((item) => {
                    allData.push({
                        key: item.id,
                        fname:
                            item.user.firstName !== null ? item.user.firstName : "تنظیم نشده است",
                        lname:
                            item.user.lastName !== null ? item.user.lastName : "تنظیم نشده است",
                        mobile:
                            item.user.mobile !== null ? item.user.mobile : "تنظیم نشده است",
                        count:
                            item.count !== null ? item.count : "تنظیم نشده است",
                       
                     
                    });
                });
                setUsers(allData);
                })





            })
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        //   localStorage.clear()
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
            title: "نام",
            dataIndex: "fname",
            key: "fname",
            render: text => <span>{text}</span>,
            ...getColumnSearchProps("fname"),
        },

        {
            title: "نام خانوادگی",
            dataIndex: "lname",
            key: "lname",

            render: text => (
                <>
                    <span>
                        {text}
                    </span>
                </>
            )
        },
        {
            title: "موبایل",
            dataIndex: "mobile",
            key: "mobile",
            render: text => (
                <>
                    <span>
                        {text}
                    </span>
                </>
            )
        },
          {
            title: "تعداد تیکت",
            dataIndex: "count",
            key: "count",
            render: text => (
                <>
                    <span>
                        {text}
                    </span>
                </>
            )

        },
        {
            title: "عمیات ها",
            key: "action",
            render: (text) => (
             
                <span>
          <Text
              onClick={() => {
                   getticketuserlist(text.mobile)
                  setIsModalOpen(true);
                  setIdSelected(text)
                 
              }}
              style={{cursor: 'pointer'}}
              className="gx-link"
          >
            نمایش
          </Text>
     
        </span>
            )
        }
    ];
function getticketuserlist(mobile){
   setmobile(mobile)
    var requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            // "Authorization": "Basic " + window.localStorage.getItem('basic')

        }


    };

    fetch(Config()['apiUrl'] + "/admin/detailticket?mobile="+mobile+"&username="+localStorage.getItem('username'), requestOptions)
        .then(response => {

           console.log(response)
if(response.status===200){
    response.json().then(rep => {
        console.log(rep)
         setticketlist(rep)
    })
}
         





        })
        .catch(error => console.log('error', error));
}
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
    
            fetch(Config()['apiUrl'] + "/admin/changestateblog?id="+idSelected.key, requestOptions)
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
            "topic": createTopic
        
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
    
            fetch(Config()['apiUrl'] + "/admin/blog?id="+idSelected.key, requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد');
        setIdSelected(null)
        setCreateticketModal(false)
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
    
            fetch(Config()['apiUrl'] + "/admin/blog?username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setCreateticketModal(false)
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
function sendticket(){
    const body ={
        "content": contentmessage,
        "mobile": mobile  
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

    fetch(Config()['apiUrl'] + "/admin/ticket?username="+localStorage.getItem('username'), requestOptions)
        .then(response => {
if(response.status===200){
toast.success('عملیات با موفقیت انجام شد')
getticketuserlist(mobile)
}
else{
 toast.error('خطایی رخ داده است')
}
         





        })
        .catch(error => console.log('error', error));
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
        <div className='ticket-list-page'>
            <Modal closable={false} className='ticket-preview-modal' footer={[
                <Button onClick={() => {
                    setIsModalOpen(false);
                    setIdSelected(null)
                }} key="back">
                    بستن
                </Button>,
             

            ]} onCancel={() => {
                setIsModalOpen(false);
                setIdSelected(null)
            }} visible={isModalOpen}>
    <div className='div-chat-content'>            
          {ticketlist.map((index)=>(
<>
    {index.ticketStatus==="Question"?(
            <div className='questionbox'><h6>{index.content}</h6></div>
    ):(<div className='answerbox'><h6>{index.content}</h6></div>)}

</>
          ))}
  </div>        
          <div className='div-input-btn'>
<input value={contentmessage} onChange={(e)=>setcontentmessage(e.target.value)}></input>
<button onClick={()=>sendticket()}>ارسال</button>
          </div>
            </Modal>


            <Modal closable={false} className='ticket-delete-modal' footer={[
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
                {idSelected && <div className='ticket-modal-preview'>
                    <p>از تغییر وضعیت این خبر اطمینان دارید ؟</p>
                </div>
                }
            </Modal>

            <Modal closable={false} className='ticket-delete-modal' footer={[
                <Button onClick={() => {
                    setCreateticketModal(false);
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
                setCreateticketModal(false);
                setIdSelected(null)
                setCreateText(null)
                setCreateTopic(null)
                setImageUploader(null)
                    setPromote(false)
            }} visible={createticketModal}>

                <div className='create-ticket-modal-preview'>
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
                        <label>موضوع</label>
                        <Input value={createTopic} onChange={(e) => setCreateTopic(e.target.value)}
                               placeholder='موضوع'/>
                    </div>
                    <div className='items'>
                        <label>متن</label>
                        <Input.TextArea value={createText} onChange={e => setCreateText(e.target.value)}
                                        placeholder='متن'/>
                    </div>
                    

                </div>

            </Modal>

            <Card title={
                <div className='get_list_ticket_title'>
                    <p>لیست اخبار</p>
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
export default Ticket

