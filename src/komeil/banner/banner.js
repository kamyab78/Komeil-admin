import React, {useEffect, useRef, useState} from 'react';
import './banner.scss'
import {Button, Card, Col, Divider, Input, Modal, Row, Table, Tag, Typography,Spin,Menu,Dropdown} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {del, get, responseValidator} from "../../api";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom'
import {Config} from '../../util/config'
import ProfilePic from "../../assets/image/emptyProfile.png";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
const Banner = function (props) {
    const searchInput = useRef();
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState(null);
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [createTopic, setCreateTopic] = useState(null)
    const [createText, setCreateText] = useState(null)
    const [imageUploader, setImageUploader] = useState(null)
    const [loading, setLoading] = useState(true)
    const [createbannerModal, setCreatebannerModal] = useState(false)
    const allData = [];
    const history = useHistory()
    const [isModalOpen, setIsModalOpen] = useState(null)
    const [idSelected, setIdSelected] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const uploadRef = useRef(null)
    const [createLoading, setCreateLoading] = useState(false)
    const [categorylist,setcategorylist] = useState([])
    const [categorynameselected,setcategorynameselected]=useState('')
    const [categoryid,setcategoryid]=useState(0)
    const [type,settype]=useState('')
    const {Text, Link} = Typography;
    function getData(){
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/banner?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

                              rep.map((item) => {
                                allData.push({
                                    key: item.id,
                                    name: item.categoryname === " " ? "تنظیم نشده است" : item.categoryname,
                                    imageurl: item.url ? item.url : "تنظیم نشده است",
                                   
                                    privacy: item.bannertype
                                });
                });
                setUsers(allData);
                })





            })
            .catch(error => console.log('error', error));

    }
    function getcategory(){
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/category?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

            
                setcategorylist(rep);
                })





            })
            .catch(error => console.log('error', error));

    }
    useEffect(() => {
        getData()
        getcategory()
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
    function createHandler() {
        setCreateLoading(true)
      
        const body = {
            "categoryId": categoryid,
            "url": imageUploader,
            "type": type
        
        }
     console.log(body)
     var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            // "Authorization": "Basic " + window.localStorage.getItem('basic')

        },
        body:JSON.stringify(body)


    };

    fetch(Config()['apiUrl'] + "/admin/banner?username="+localStorage.getItem('username'), requestOptions)
        .then(response => {


            setCreateLoading(false);
            response.json().then(rep => {
                console.log(rep)
setCreatebannerModal(false)
        getData()
            })





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
    const columns = [
        {
            title: "عکس",
            dataIndex: "imageurl",
            key: "imageurl",
            render: item => <div className='profile-pic-container'>
                <img src={item} className="profile-pic"/>
            </div>,

        },
        {
            title: "دسته بندی",
            dataIndex: "name",
            key: "name",
            render: text => <span className="gx-link">{text}</span>,
            ...getColumnSearchProps("name"),
        },
        {
            title: "جایگاه ",
            dataIndex: "privacy",
            key: "privacy",
            render: text =>
            // console.log(text),
             <span className="gx-link">{text === 'seventhbanner_aboutus' ? 'بنر هفتم درباره ما':text === 'sixthbanner_aboutus' ? 'بنر ششم درباره ما':text === 'fifthbanner_aboutus' ? 'بنر پنجم درباره ما':text === 'fourthbanner_aboutus' ? 'بنر چهارم درباره ما':text === 'seventhbanner_landing' ? 'بنر هفتم صفحه اول':text === 'sixthbanner_landing' ? 'بنر ششم صفحه اول':text === 'fifthbanner_landing' ? 'بنر پنجم صفحه اول':text === 'fourthbanner_landing' ? 'بنر چهارم صفحه اول':text === 'firstbanner_landing_first' ? 'بنر اول اول صفحه اول':text === 'firstbanner_landing_second' ? 'بنر اول دوم صفحه اول':text === 'secondbanner_blog' ? 'بنر دوم صفحه اخبار':text === 'firstbanner_blog' ? 'بنر اول صفحه اخبار':text === 'firstbanner_landing' ? 'بنر اول صفحه اول':text === 'thirdbanner_landing' ? 'بنر سوم صفحه اول':text === 'thirdbanner_aboutus' ? 'بنر سوم درباره ما':text === 'secondbanner_aboutus' ? 'بنر دوم درباره ما':text === 'fisrtbanner_aboutus' ? 'بنر اول درباره ما':text === 'firstbanner_stock' ? 'بنر اول صفحه بازارچه' : text === 'secondbanner_landing' ? 'بنر دوم صفحه اول' : 'بنر دوم صفحه بازارچه'}</span>,
            filters: [
                {text: "بنر اول اول صفحه اول", value: "firstbanner_landing_first"},
                {text: "بنر سوم صفحه اول", value: "thirdbanner_landing"},
                {text: "بنر اول صفحه بازارچه", value: "firstbanner_stock"},
                {text: "بنر چهارم صفحه اول", value: "fourthbanner_landing"},
                {text: "بنر پنجم صفحه اول", value: "fifthbanner_landing"},
                {text: "بنر ششم صفحه اول", value: "sixthbanner_landing"},
                {text: "بنر هفتم صفحه اول", value: "seventhbanner_landing"},
                {text: "بنر دوم صفحه اول", value: "secondbanner_landing"},
                {text: "بنر دوم صفحه بازارچه", value: "secondbanner_stock"},
                {text: "بنر دوم درباره ما", value: "secondbanner_aboutus"},
                {text: "بنر اول درباره ما", value: "fisrtbanner_aboutus"},
                {text: "بنر سوم درباره ما", value: "thirdbanner_aboutus"},
                {text: "بنر چهارم درباره ما", value: "fourthbanner_aboutus"},
                {text: "بنر پنجم درباره ما", value: "fifthbanner_aboutus"},
                {text: "بنر ششم درباره ما", value: "sixthbanner_aboutus"},
                {text: "بنر هفتم درباره ما", value: "seventhbanner_aboutus"},
                {text: "بنر اول دوم صفحه اول", value: "firstbanner_landing_second"},
                {text: "بنر اول اخبار", value: "firstbanner_blog"},
                {text: "بنر دوم اخبار", value: "secondbanner_blog"}
            ],
            onFilter: (value, record) => record.privacy.indexOf(value) === 0
        }
    ];

    function confirmHandler() {
        setDeleteLoading(true)
        del('/admin/deceased?mobile=admin&id=' + idSelected, {}).then(res => {
            setDeleteLoading(false)
            if (responseValidator(res.status)) {
                toast.success('عملیات با موفقیت انجام شد')
                setIsModalOpen(false)
                getData()
            } else toast.error('خطایی رخ داده است')
        })
    }

function clickonitem(id,name){
setcategorynameselected(name)
setcategoryid(id)
}
    return (
        <div className='banner-page'>
            <Modal closable={false} className='verification-my-modal' footer={[
                <Button onClick={() => setIsModalOpen(false)} key="back">
                    خیر
                </Button>,
                <Button loading={deleteLoading} key="submit" type="primary" onClick={confirmHandler}>
                    بله
                </Button>,

            ]} onCancel={() => setIsModalOpen(false)} visible={isModalOpen}>
                <p>آیا از حذف کردن این صفحه اطمینان دارید ؟</p>
            </Modal>
            <Modal closable={false} className='banner-delete-modal' footer={[
                <Button onClick={() => {
                    setCreatebannerModal(false);
                    setIdSelected(null)
                    setCreateText(null)
                    setCreateTopic(null)
                    setImageUploader(null)
                    
                }} key="back">
                    لغو
                </Button>,
                <Button loading={createLoading} key="submit" type="primary" onClick={createHandler}>
                    {idSelected ? 'تغییر' : 'ایجاد'}
                </Button>,

            ]} onCancel={() => {
                setCreatebannerModal(false);
                setIdSelected(null)
                setCreateText(null)
                setCreateTopic(null)
                setImageUploader(null)
                 
            }} visible={createbannerModal}>

                <div className='create-banner-modal-preview'>
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
             
                    <div className='items my-dropdown'>
                            <label>جایگاه : </label>
                            <Dropdown overlay={(
                                <Menu>
    <Menu.Item>
                                        <div onClick={() => settype('fisrtbanner_aboutus')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر اول درباره ما</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('thirdbanner_aboutus')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر سوم درباره ما</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('firstbanner_landing_first')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر اول اول صفحه اول</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('firstbanner_landing_second')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر اول دوم صفحه اول</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('thirdbanner_landing')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر سوم صفحه اول</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('firstbanner_stock')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر اول صفحه بازارچه</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('secondbanner_landing')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر دوم صفحه اول</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('secondbanner_stock')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر دوم صفحه بازارچه</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('secondbanner_aboutus')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر دوم درباره ما</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('firstbanner_blog')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر اول اخبار</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('secondbanner_blog')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر دوم اخبار</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('fourthbanner_landing')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر چهارم صفحه اول</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('fifthbanner_landing')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر پنجم صفحه اول</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('sixthbanner_landing')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر ششم صفحه اول</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('seventhbanner_landing')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر هفتم صفحه اول</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('fourthbanner_aboutus')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر چهارم درباره ما</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('fifthbanner_aboutus')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر پنجم درباره ما</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('sixthbanner_aboutus')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر ششم درباره ما</h4>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div onClick={() => settype('seventhbanner_aboutus')}
                                             className='one-card-drop-down-selected network'>
                                            <h4>بنر هفتم درباره ما</h4>
                                        </div>
                                    </Menu.Item>
                                </Menu>
                            )} trigger={['click']}>
                                <div className='one-card-drop-down-selected payment'>
                                    <h4>{type === 'firstbanner_landing_first' ? 'بنر اول اول صفحه اول':type === 'firstbanner_landing_second' ? 'بنر اول دوم صفحه اول':type === 'thirdbanner_landing' ? 'بنر سوم صفحه اول':type === 'thirdbanner_aboutus' ? 'بنر سوم درباره ما':type === 'secondbanner_aboutus' ? 'بنر دوم درباره ما':type === 'fisrtbanner_aboutus' ? 'بنر اول درباره ما':type === 'firstbanner_stock' ? 'بنر اول صفحه بازارچه' : type === 'secondbanner_landing' ? 'بنر دوم صفحه اول' : 'بنر دوم صفحه بازارچه'}</h4>
                                    <DownOutlined/>
                                </div>
                            </Dropdown>
                        </div>
                      
                        <div className='items my-dropdown'>
                            <label>دسته بندی : </label>
                            <Dropdown overlay={(
                                <Menu>
                                    {categorylist.map((result)=>(
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
                                    <h4>{categorynameselected}</h4>
                                    <DownOutlined/>
                                </div>
                            </Dropdown>
                        </div>
               
                    

                </div>

            </Modal>

            <Card title={
                  <div className='get_list_page_title'>
            <p>لیست بنر ها</p>
            <span/>
            <Button onClick={setCreatebannerModal} type={"primary"} >ثبت بنر جدید</Button>
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
         
    )
        </div>
    );
};
export default Banner



