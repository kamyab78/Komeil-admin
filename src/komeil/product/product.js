import React, {useEffect, useRef, useState} from 'react';
import './product.scss'
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
const Product = function (props) {
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
    const [createproductModal, setCreateproductModal] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [imageUploader, setImageUploader] = useState(null)
    const [imageUploader1, setImageUploader1] = useState(null)
    const [imageUploader2, setImageUploader2] = useState(null)
    const [imageUploader3, setImageUploader3] = useState(null)
    const uploadRef = useRef(null)
    const uploadRef1 = useRef(null)
    const uploadRef2 = useRef(null)
    const uploadRef3 = useRef(null)
   
    const uploadTools = useRef();
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [createTopic, setCreateTopic] = useState(null)
    const [createText, setCreateText] = useState(null)
    const [promote,setPromote]=useState(false)
    const [discount,setdiscount]=useState(0)
    const [netprice,setnetprice]=useState(0)
    const [stock,setstock]=useState(0)
    const [rate,setrate]=useState(0)
    const [category,setcategoey]=useState('')
    const [categorylist,setcategorylist] = useState([])
    const [brandlist,setbrandlist]=useState([])
    const [brandid,setbrandid]=useState(0)
    const [brandname,setbrandname]=useState('')
    const [categorynameselected,setcategorynameselected]=useState('')
    const [categoryid,setcategoryid]=useState(0)
    const [colorsselected,setcolorsselected]=useState([])
    const [listnameforshow,setlistnameforshow]=useState([])
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

        fetch(Config()['apiUrl'] + "/admin/product?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

                              rep.map((item) => {
                    allData.push({
                        key: item.id,
                        created_at: item.created_at === " " ? "تنظیم نشده است" : item.created_at,
                        text:
                            item.description !== null ? item.description : "تنظیم نشده است",
                        topic:
                            item.name !== null ? item.name : "تنظیم نشده است",
                        imageurl: item.imageUrl ? item.imageUrl : "تنظیم نشده است",
                        discount:item.discount,
                        netprice:item.netPrice,
                        stock:item.stock,
                        rate:item.rate,
                        category:item.categoryname?item.categoryname:"تنظیم نشده است",
                        brand:item.brandname?item.brandname:"تنظیم نشده است",
                        promote: item.enable ,
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
    function getbrand(){
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
                    console.log(rep)

            
                setbrandlist(rep);
                })





            })
            .catch(error => console.log('error', error));
    }
    const handleChangeMultiple = (event) => {
        const { options } = event.target.value;
     
        const value = [];
        // for (let i = 0, l = options.length; i < l; i += 1) {
        //   if (options[i].selected) {
        //     value.push(options[i].value);
        //   }
        // }

        var arrayname=listnameforshow
        var arrayid=colorsselected
        var txt = event.target.value
        console.log(arrayname)
        const split = txt.split(",")
  
    
        if(arrayid.includes(split[0])){
console.log('inclue')
        }
        else{
arrayid.push(split[0])
arrayname.push(split[1])
 setlistnameforshow(arrayname)
        setcolorsselected(arrayid);
     
        toast.success(' رنگ '+split[1]+' انتخاب شد ')
       
        }
      
       
      };
    useEffect(() => {
        getData()
        getcategory()
        getbrand()
        getcolor()
    }, []);
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText("");
    };
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
            render: item => <div className='profile-pic-container'>
                <img src={item} className="profile-pic"/>
            </div>,

        },
        {
            title: "نام",
            dataIndex: "topic",
            key: "topic",
            render: text => <span>{text}</span>,
            ...getColumnSearchProps("topic"),
        },

        {
            title: "توضیحات",
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
            title: "برند",
            dataIndex: "brand",
            key: "brand",

            render: text => (
                <>
                    <span>
                        {text}
                    </span>
                </>
            )
        }, 
        {
            title: "دسته بندی",
            dataIndex: "category",
            key: "category",

            render: text => (
                <>
                    <span>
                        {text}
                    </span>
                </>
            )
        },
        {
            title: "امتیاز",
            dataIndex: "rate",
            key: "rate",

            render: text => (
                <>
                    <span>
                        {text}
                    </span>
                </>
            )
        },
        {
            title: "موجودی",
            dataIndex: "stock",
            key: "stock",

            render: text => (
                <>
                    <span>
                        {text}
                    </span>
                </>
            )
        },
        {
            title: "تخفیف",
            dataIndex: "discount",
            key: "discount",

            render: text => (
                <>
                    <span>
                        {text}
                    </span>
                </>
            )
        },
        {
            title: "قیمت",
            dataIndex: "netprice",
            key: "netprice",

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
              setnetprice(text.netprice)
              setcategoey(text.category)
              setrate(text.rate)
              setdiscount(text.discount)
              setIdSelected(text)
              setCreateproductModal(true)
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
    
            fetch(Config()['apiUrl'] + "/admin/changestateproduct?id="+idSelected.key+"&username="+localStorage.getItem('username'), requestOptions)
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
        var addimage=[]
        if(imageUploader1!==null)
        addimage.push(imageUploader1)
        if(imageUploader2!==null)
        addimage.push(imageUploader2)
        if(imageUploader3!==null)
        addimage.push(imageUploader3)
        const body = {
            "description": createText,
            "imageUrl": imageUploader,
            "name": createTopic,
            "categoryId":categoryid,
            "discount":discount,
            "stock":stock,
            "netPrice":netprice,
            "brandId":brandid,
            "colorid":colorsselected,
            "additinoalimage":addimage,
            "rate":rate


        
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
            fetch(Config()['apiUrl'] + "/admin/product?Id="+idSelected.key+"&username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد');
        setIdSelected(null)
        setCreateproductModal(false)
        setCreateText(null)
        setCreateTopic(null)
        setImageUploader(null)
        setnetprice(null)
        setstock(null)
        setcategoryid(null)
        setrate(null)
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
    
            fetch(Config()['apiUrl'] + "/admin/product?username="+localStorage.getItem('username'), requestOptions)
                .then(response => {
    
                    setCreateLoading(false)
    if(response.status===200){
        toast.success('عملیات با موفقیت انجام شد')
        setCreateproductModal(false)
        setCreateText(null)
        setCreateTopic(null)
        setImageUploader(null)
        setnetprice(null)
        setstock(null)
        setcategoryid(null)
        setrate(null)
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
    function changeUploaderHandler1(e) {
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
                    setImageUploader1(rep.path)

                })





            })
            .catch(error => console.log('error', error));
    
    }
    function changeUploaderHandler2(e) {
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
                    setImageUploader2(rep.path)

                })





            })
            .catch(error => console.log('error', error));
    
    }
    function changeUploaderHandler3(e) {
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
                    setImageUploader3(rep.path)

                })





            })
            .catch(error => console.log('error', error));
    
    }
    function clickonitem(id,name){
        setcategorynameselected(name)
        setcategoryid(id)
        }
        function clickonitembrand(id,name){
            setbrandid(id)
            setbrandname(name)
        }
    return (
        <div className='product-list-page'>
            <Modal closable={false} className='product-preview-modal' footer={[
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
                {idSelected && <div className='product-modal-preview'>
                    <img src={idSelected.imageurl} alt='product'/>
                    <div className='header'>
                        <h4>امتیاز {idSelected.rate} </h4>
                        <h4>قیمت {idSelected.netprice} </h4>
                        <h4>تخفیف {idSelected.discount} </h4>
                        <h4>دسته بندی: {idSelected.category} </h4>
                        <h2>  {idSelected.topic}  {idSelected.promote && <Tag color='red'>فعال</Tag> }</h2>
                    </div>
                    <p>توضیحات: {idSelected.text} </p>
                </div>
                }
            </Modal>


            <Modal closable={false} className='product-delete-modal' footer={[
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
                {idSelected && <div className='product-modal-preview'>
                    <p>از تغییر وضعیت این خبر اطمینان دارید ؟</p>
                </div>
                }
            </Modal>

            <Modal closable={false} className='product-delete-modal' footer={[
                <Button onClick={() => {
                    setCreateproductModal(false);
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
                setCreateproductModal(false);
                setIdSelected(null)
                setCreateText(null)
                setCreateTopic(null)
                setImageUploader(null)
                    setPromote(false)
            }} visible={createproductModal}>

                <div className='create-product-modal-preview'>
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
                    <div className='addimage' >
                    <div className='profile-pic1'>
                        <img src={imageUploader1 ? imageUploader1 : ProfilePic} alt='profile-pic'/>
                        <input accept="image/*" onChange={changeUploaderHandler1} ref={uploadRef1} className='uploader' type='file'/>
                        <div onClick={() => uploadRef1.current.click()} className='change-mode'>
                            <p>تعویض</p>
                        </div>
                        {loadingUpload &&
                        <div onClick={() => uploadRef1.current.click()} style={{display: 'flex'}}
                             className='change-mode'>
                            <Spin/>
                        </div>}
                    </div>
                    <div className='profile-pic1'>
                        <img src={imageUploader2 ? imageUploader2 : ProfilePic} alt='profile-pic'/>
                        <input accept="image/*" onChange={changeUploaderHandler2} ref={uploadRef2} className='uploader' type='file'/>
                        <div onClick={() => uploadRef2.current.click()} className='change-mode'>
                            <p>تعویض</p>
                        </div>
                        {loadingUpload &&
                        <div onClick={() => uploadRef2.current.click()} style={{display: 'flex'}}
                             className='change-mode'>
                            <Spin/>
                        </div>}
                    </div>
                    <div className='profile-pic1'>
                        <img src={imageUploader3 ? imageUploader3 : ProfilePic} alt='profile-pic'/>
                        <input accept="image/*" onChange={changeUploaderHandler3} ref={uploadRef3} className='uploader' type='file'/>
                        <div onClick={() => uploadRef3.current.click()} className='change-mode'>
                            <p>تعویض</p>
                        </div>
                        {loadingUpload &&
                        <div onClick={() => uploadRef3.current.click()} style={{display: 'flex'}}
                             className='change-mode'>
                            <Spin/>
                        </div>}
                    </div>
                    </div>
                    <div className='items'>
                        <label>نام</label>
                        <Input value={createTopic} onChange={(e) => setCreateTopic(e.target.value)}
                               placeholder='نام'/>
                    </div>
                    <div className='items'>
                        <label>قیمت</label>
                        <Input value={netprice} onChange={(e) => setnetprice(e.target.value)}
                               placeholder='قیمت'/>
                    </div>
                    <div className='items'>
                        <label>تخفیف</label>
                        <Input value={discount} onChange={(e) => setdiscount(e.target.value)}
                               placeholder='تخفیف'/>
                    </div>
                    <div className='items'>
                        <label>امتیاز</label>
                        <Input value={rate} onChange={(e) => setrate(e.target.value)}
                               placeholder='امتیاز'/>
                    </div>
                    <div className='items'>
                        <label>موجودی</label>
                        <Input value={stock} onChange={(e) => setstock(e.target.value)}
                               placeholder='موجودی'/>
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
                        <div className='items my-dropdown'>
                            <label>برند : </label>
                            <Dropdown overlay={(
                                <Menu>
                                    {brandlist.map((result)=>(
                                        // {console.log(result)}
   <Menu.Item>
                                        <div onClick={() => clickonitembrand(result.id,result.title)}
                                             className='one-card-drop-down-selected network'>
                                            <h4>{result.title}</h4>
                                        </div>
                                    </Menu.Item>
                                    ))}
 
                               
                     
                                </Menu>
                            )} trigger={['click']}>
                                <div className='one-card-drop-down-selected payment'>
                                    <h4>{brandname}</h4>
                                    <DownOutlined/>
                                </div>
                            </Dropdown>
                        </div>
                    <div className='items my-dropdown'>
                        <label>رنگ ها</label>
                        <FormControl>
                        <Select
          labelId="demo-mutiple-name-label"
          id="demo-mutiple-name"
         
          value={colorsselected}
          onChange={handleChangeMultiple}
        
          MenuProps={MenuProps}
      
        >
          {colorlist.map((name) => (
            <MenuItem key={name.id} value={name.id+','+name.name} >
              {name.name}
            </MenuItem>
          ))}
        </Select>
        {listnameforshow.map((name) => (
            <h6 >
              {name}
            </h6>
          ))}
     
    
        </FormControl>
                    </div>
                    <div className='items'>
                        <label>توضیحات</label>
                        <Input.TextArea value={createText} onChange={e => setCreateText(e.target.value)}
                                        placeholder='متن'/>
                    </div>
                    

                </div>

            </Modal>

            <Card title={
                <div className='get_list_product_title'>
                    <p>لیست کالاها</p>
                    <span/>
                    <Button onClick={() => setCreateproductModal(true)} type={"primary"}>ساخت کالا جدید</Button>
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
export default Product
