import React, { useEffect, useRef, useState } from 'react';
import './addproduct.scss'
import { Card, Col, Divider, Input, Modal, Row, Spin, Switch, Table, Tag, Menu, Dropdown } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { del, get, post, put, responseValidator, upload } from "../../api";
import { toast } from "react-toastify";
import { useHistory } from 'react-router-dom'
import ProfilePic from "../../assets/image/emptyProfile.png";
import { Config } from '../../util/config'
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Editor } from '@tinymce/tinymce-react';
// import { RichTextEditor } from '@mantine/rte';
import JoditEditor from "jodit-react";

const steps = [
    'اطلاعات کلی',
    'رنگ ',
  
];
const Addproduct = function (props) {
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
    const log = () => {
      if (editorRef.current) {
        console.log(editorRef.current.getContent());
        setCreateText(editorRef.current.getContent())
        toast.success('با موفقیت تولید شد')
      }
    };
    const editor = useRef(null)

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
    const [createaddproductModal, setCreateaddproductModal] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [imageUploader, setImageUploader] = useState(null)
    const [imageUploader1, setImageUploader1] = useState(null)
    const [imageUploader2, setImageUploader2] = useState(null)
    const [imageUploader3, setImageUploader3] = useState(null)
    const uploadRef = useRef(null)
    const uploadRef1 = useRef(null)
    const uploadRef2 = useRef(null)
    const uploadRef3 = useRef(null)
    const [idproduct,setidproduct]=useState(0)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [createTopic, setCreateTopic] = useState(null)
    const [createText, setCreateText] = useState(null)
    const [discount, setdiscount] = useState(0)
    const [netprice, setnetprice] = useState(0)
    const [stock, setstock] = useState(0)
    const [rate, setrate] = useState(0)
    const [categorylist, setcategorylist] = useState([])
    const [brandlist, setbrandlist] = useState([])
    const [brandid, setbrandid] = useState(0)
    const [brandname, setbrandname] = useState('')
    const [categorynameselected, setcategorynameselected] = useState('')
    const [categoryid, setcategoryid] = useState(0)
    const [colorsselected, setcolorsselected] = useState([])
    const [listnameforshow, setlistnameforshow] = useState([])
    const [colorlist, setcolorlist] = useState([])
    const [voltage, setvoltage] = useState('')
    const [protection, setprotection] = useState('')
    const [power, setpower] = useState('')
    const [lightTemperature, setlightTemperature] = useState('')
    const [lightFlux, setlightFlux] = useState('')
    const [installionType, setinstallionType] = useState('')
    const [bodycoloridlist, setbodycoloridlist] = useState([])
    const [angleRadiationidlist, setangleRadiationidlist] = useState([])
    const [listcolobodyselected, setlistcolobodyselected] = useState([])
    const [listcolobodyselectedname, setlistcolobodyselectedname] = useState([])
    const [listangleselected, setlistangleselected] = useState([])
    const [listangleselectedname, setlistangleselectedname] = useState([])
    const [amper, setamper] = useState('')
    const [bodyMaterial, setbodyMaterial] = useState('')
    const [activeStep, setActiveStep] = React.useState(0);

    const [productWidth,setproductWidth]=useState('')
    const [productLength,setproductLength]=useState('')
    const [productHeight,setproductHeigth]=useState('')
    const [boxWidth,setboxWidth]=useState('')
    const [boxLength,setboxLength]=useState('')
    const [boxHeight,setboxHeigth]=useState('')
    const [weight,setweight]=useState('')
    const [listColorState,setlistColorState]=useState([1])
    const [idcolorselected,setidcolorselected]=useState(0)
    const[colornameselected,setcolornameselected]=useState('')
    const [arraycolor,setarraycolor]=useState([])
    const [ colorcount,setcolorcount]=useState(0)

    const [listColorbodyState,setlistColorbodyState]=useState([1])
    const [idcolorbodyselected,setidcolorbodyselected]=useState(0)
    const[colorbodynameselected,setcolorbodynameselected]=useState('')
    const [arraycolorbody,setarraycolorbody]=useState([])
    const [ colorbodycount,setcolorbodycount]=useState(0)


    const [listangleState,setlistangleState]=useState([1])
    const [idangleselected,setidangleselected]=useState(0)
    const[anglenameselected,setanglenameselected]=useState('')
    const [arrayangle,setarrayangle]=useState([])
    const [anglecount,setanglecount]=useState(0)
    const [material,setmaterial]=useState('')
    const [count,setcount]=useState('')


    const { Text, Link } = Typography;

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

        fetch(Config()['apiUrl'] + "/admin/addproduct?username=" + localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

                    rep.map((item, i) => {
                        allData.push({
                            numrow: ++i,
                            key: item.id,
                            created_at: item.created_at === " " ? "تنظیم نشده است" : item.created_at,
                            text:
                                item.description !== null ? item.description : "تنظیم نشده است",
                            topic:
                                item.name !== null ? item.name : "تنظیم نشده است",
                            imageurl: item.imageUrl ? item.imageUrl : "تنظیم نشده است",
                            discount: item.discount,
                            netprice: item.netPrice,
                            stock: item.stock,
                            rate: item.rate,
                            category: item.categoryname ? item.categoryname : "تنظیم نشده است",
                            brand: item.brandname ? item.brandname : "تنظیم نشده است",

                            voltage: item.voltage ? item.voltage : "تنظیم نشده است",
                            protection: item.protection ? item.protection : "تنظیم نشده است",
                            power: item.power ? item.power : "تنظیم نشده است",
                            lightTemperature: item.lightTemperature ? item.lightTemperature : "تنظیم نشده است",
                            lightFlux: item.lightFlux ? item.lightFlux : "تنظیم نشده است",
                            installionType: item.installionType ? item.installionType : "تنظیم نشده است",
                            amper: item.amper ? item.amper : "تنظیم نشده است",
                            bodyMaterial: item.bodyMaterial ? item.bodyMaterial : "تنظیم نشده است",
                            hash: item.hash,

                            promote: item.enable,
                        });
                    });

                    setUsers(allData);
                })





            })
            .catch(error => console.log('error', error));
    }
    function getcategory() {
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/category?username=" + localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)


                    setcategorylist(rep);
                })





            })
            .catch(error => console.log('error', error));

    }
    function getbrand() {
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/brand?username=" + localStorage.getItem('username'), requestOptions)
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

        var arrayname = listnameforshow
        var arrayid = colorsselected
        var txt = event.target.value
        console.log(arrayname)
        const split = txt.split(",")


        if (arrayid.includes(split[0])) {
            console.log('inclue')
        }
        else {
            arrayid.push(split[0])
            arrayname.push(split[1])

            setlistnameforshow([...arrayname])
            setcolorsselected(arrayid);

            toast.success(' رنگ ' + split[1] + ' انتخاب شد ')

        }


    };
    const handleChangeMultiplecolorbody = (event) => {
        const { options } = event.target.value;

        const value = [];
        // for (let i = 0, l = options.length; i < l; i += 1) {
        //   if (options[i].selected) {
        //     value.push(options[i].value);
        //   }
        // }

        var arrayname = listcolobodyselectedname
        var arrayid = listcolobodyselected
        var txt = event.target.value
        console.log(arrayname)
        const split = txt.split(",")


        if (arrayid.includes(split[0])) {
            console.log('inclue')
        }
        else {
            arrayid.push(split[0])
            arrayname.push(split[1])
            setlistcolobodyselectedname([...arrayname])
            setlistcolobodyselected(arrayid);

            toast.success(' رنگ ' + split[1] + ' انتخاب شد ')

        }


    };
    const handleChangeMultipleangle = (event) => {
        const { options } = event.target.value;

        const value = [];
        // for (let i = 0, l = options.length; i < l; i += 1) {
        //   if (options[i].selected) {
        //     value.push(options[i].value);
        //   }
        // }

        var arrayname = listangleselectedname
        var arrayid = listangleselected
        var txt = event.target.value
        console.log(arrayname)
        const split = txt.split(",")


        if (arrayid.includes(split[0])) {
            console.log('inclue')
        }
        else {
            arrayid.push(split[0])
            arrayname.push(split[1])
            setlistangleselectedname([...arrayname])
            setlistangleselected(arrayid);

            toast.success(' زاویه ' + split[1] + ' انتخاب شد ')

        }


    };
    useEffect(() => {
        // getData()
        getcategory()
        getbrand()
        getcolor()
        getbodycolor()
        getangle()
    }, []);
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText("");
    };
    function getcolor() {
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/color?username=" + localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)


                    setcolorlist(rep);
                })





            })
            .catch(error => console.log('error', error));
    }
    function getbodycolor() {
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/bodycolor?username=" + localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)


                    setbodycoloridlist(rep);
                })





            })
            .catch(error => console.log('error', error));
    }
    function getangle() {
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            }


        };

        fetch(Config()['apiUrl'] + "/admin/angle?username=" + localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)


                    setangleRadiationidlist(rep);
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
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={` جستجو ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                <div>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        جستجو
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        پاک کردن
                    </Button>
                </div>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
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
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            )
    });


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

        fetch(Config()['apiUrl'] + "/admin/changestateaddproduct?id=" + idSelected.key + "&username=" + localStorage.getItem('username'), requestOptions)
            .then(response => {

                setDeleteLoading(false)
                if (response.status === 200) {
                    toast.success('عملیات با موفقیت انجام شد')
                    setTimeout(function () {
                        getData()
                        setDeleteModal(false)
                    }, 1000);

                }
                else {
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
        var category = categoryid
        var brand = brandid
        setCreateLoading(true)
        var addimage = []
        if (imageUploader1 !== null)
            addimage.push(imageUploader1)
        if (imageUploader2 !== null)
            addimage.push(imageUploader2)
        if (imageUploader3 !== null)
            addimage.push(imageUploader3)
        if (category === null)
            category = 0
        if (brand === null)
            brand = 0


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
            "rate":rate,
            "boxHeight": boxHeight,
  "boxLength": boxLength,
  "boxWidth":boxWidth,
  "productHeight": productHeight,
  "productLength": productLength,
  "productWidth": productWidth,
"weight":weight,
"material":material,
"count":count,
"titleMetatag":'',
"canonicalMetatag":'',
"descriptionMetatag":''



        }


        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            },
            body: JSON.stringify(body)


        };

        fetch(Config()['apiUrl'] + "/admin/product?username=" + localStorage.getItem('username'), requestOptions)
            .then(response => {

                setCreateLoading(false)
                if (response.status === 200) {
                    toast.success('عملیات با موفقیت انجام شد')
                         response.json().then(rep => {
                             setidproduct(rep.id)
                         })

                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
                else {
                    toast.error('خطایی رخ داده است')
                }






            })
            .catch(error => console.log('error', error));


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
            body: form


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
            body: form


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
            body: form


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
            body: form


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
    function clickonitem(id, name) {
        setcategorynameselected(name)
        setcategoryid(id)
    }
    function clickonitembrand(id, name) {
        setbrandid(id)
        setbrandname(name)
    }
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const createcolor=()=>{
        const body = {
            "id": idcolorselected,
  "num": colorcount,
  "productid": idproduct
           
          
        
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

        fetch(Config()['apiUrl'] + "/admin/Productitemcolor?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {

                setCreateLoading(false)
if(response.status===200){
    // toast.success('عملیات با موفقیت انجام شد')
var array = listColorState
array.push(1)
setlistColorState([...array])

var names=arraycolor
console.log(colorcount)
const colorselect = {'name':colornameselected,'count':colorcount}
names.push(colorselect)
setarraycolor([...names])
    // getData()
}
else{
     toast.error('خطایی رخ داده است')
}
             





            })
            .catch(error => console.log('error', error));



    
    }
    const createbodycolor=()=>{
        const body = {
            "id": idcolorbodyselected,
  "num": colorbodycount,
  "productid": idproduct
           
          
        
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

        fetch(Config()['apiUrl'] + "/admin/Productitemcolorbody?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {

                setCreateLoading(false)
if(response.status===200){
    // toast.success('عملیات با موفقیت انجام شد')
var array = listColorbodyState
array.push(1)
setlistColorbodyState([...array])

var names=arraycolorbody
const colorselect = {'name':colorbodynameselected,'count':colorbodycount}
names.push(colorselect)
setarraycolorbody([...names])
    // getData()
}
else{
     toast.error('خطایی رخ داده است')
}
             





            })
            .catch(error => console.log('error', error));



    
    }
    const createangle=()=>{
        const body = {
            "id": idangleselected,
  "num": anglecount,
  "productid": idproduct
           
          
        
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

        fetch(Config()['apiUrl'] + "/admin/Productitemangle?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {

                setCreateLoading(false)
if(response.status===200){
    // toast.success('عملیات با موفقیت انجام شد')
var array = listangleState
array.push(1)
setlistangleState([...array])

var names=arrayangle
const colorselect = {'name':anglenameselected,'count':anglecount}
names.push(colorselect)
setarrayangle([...names])
    // getData()
}
else{
     toast.error('خطایی رخ داده است')
}
             





            })
            .catch(error => console.log('error', error));



    
    }
    const clickonitemcolor=(id,name)=>{
setidcolorselected(id)
setcolornameselected(name)

    }
    const  clickonitemcolorbody=(id,name)=>{
        setidcolorbodyselected(id)
        setcolorbodynameselected(name)
        
            }
            const  clickonitemangle=(id,name)=>{
                setidangleselected(id)
                setanglenameselected(name)
                
                    }
    
    

    return (
        <div className='addproduct-list-page'>
            <Modal closable={false} className='addproduct-preview-modal' footer={[
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
                {idSelected && <div className='addproduct-modal-preview'>
                    <img src={idSelected.imageurl} alt='addproduct' />
                    <div className='header'>
                        <h4>امتیاز {idSelected.rate} </h4>
                        <h4>قیمت {idSelected.netprice} </h4>
                        <h4>تخفیف {idSelected.discount} </h4>
                        <h4>دسته بندی: {idSelected.category} </h4>
                        <h2>  {idSelected.topic}  {idSelected.promote && <Tag color='red'>فعال</Tag>}</h2>
                    </div>
                    <p>توضیحات: {idSelected.text} </p>
                </div>
                }
            </Modal>


            <Modal closable={false} className='addproduct-delete-modal' footer={[
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
                {idSelected && <div className='addproduct-modal-preview'>
                    <p>از تغییر وضعیت این خبر اطمینان دارید ؟</p>
                </div>
                }
            </Modal>



            <Box >
                <Stepper activeStep={activeStep} orientation="vertical">
                    <Step key={'اطلاعات کلی'}>
                        <StepLabel

                        >
                            اطلاعات کلی
                        </StepLabel>
                        <StepContent style={{ width: '100%' }}>
                            <Typography style={{ width: '100%', display: 'flex', direction: 'rtl', flexDirection: 'column' }}>
                                <div className='create-addproduct-modal-preview'>
                                    <div className='profile-pic'>
                                        <img src={imageUploader ? imageUploader : ProfilePic} alt='profile-pic' />
                                        <input accept="image/*" onChange={changeUploaderHandler} ref={uploadRef} className='uploader' type='file' />
                                        <div onClick={() => uploadRef.current.click()} className='change-mode'>
                                            <p>تعویض</p>
                                        </div>
                                        {loadingUpload &&
                                            <div onClick={() => uploadRef.current.click()} style={{ display: 'flex' }}
                                                className='change-mode'>
                                                <Spin />
                                            </div>}
                                    </div>
                                    <div className='addimage' >
                                        <div className='profile-pic1'>
                                            <img src={imageUploader1 ? imageUploader1 : ProfilePic} alt='profile-pic' />
                                            <input accept="image/*" onChange={changeUploaderHandler1} ref={uploadRef1} className='uploader' type='file' />
                                            <div onClick={() => uploadRef1.current.click()} className='change-mode'>
                                                <p>تعویض</p>
                                            </div>
                                            {loadingUpload &&
                                                <div onClick={() => uploadRef1.current.click()} style={{ display: 'flex' }}
                                                    className='change-mode'>
                                                    <Spin />
                                                </div>}
                                        </div>
                                        <div className='profile-pic1'>
                                            <img src={imageUploader2 ? imageUploader2 : ProfilePic} alt='profile-pic' />
                                            <input accept="image/*" onChange={changeUploaderHandler2} ref={uploadRef2} className='uploader' type='file' />
                                            <div onClick={() => uploadRef2.current.click()} className='change-mode'>
                                                <p>تعویض</p>
                                            </div>
                                            {loadingUpload &&
                                                <div onClick={() => uploadRef2.current.click()} style={{ display: 'flex' }}
                                                    className='change-mode'>
                                                    <Spin />
                                                </div>}
                                        </div>
                                        <div className='profile-pic1'>
                                            <img src={imageUploader3 ? imageUploader3 : ProfilePic} alt='profile-pic' />
                                            <input accept="image/*" onChange={changeUploaderHandler3} ref={uploadRef3} className='uploader' type='file' />
                                            <div onClick={() => uploadRef3.current.click()} className='change-mode'>
                                                <p>تعویض</p>
                                            </div>
                                            {loadingUpload &&
                                                <div onClick={() => uploadRef3.current.click()} style={{ display: 'flex' }}
                                                    className='change-mode'>
                                                    <Spin />
                                                </div>}
                                        </div>
                                    </div>



                                </div>
                                <div className='items'>
                                    <label>نام</label>
                                    <Input value={createTopic} onChange={(e) => setCreateTopic(e.target.value)}
                                        placeholder='نام' />
                                </div>
                                <div className='items'>
                                    <label>قیمت</label>
                                    <Input value={netprice} onChange={(e) => setnetprice(e.target.value)}
                                        placeholder='قیمت' />
                                </div>
                                <div className='items'>
                                    <label>تخفیف</label>
                                    <Input value={discount} onChange={(e) => setdiscount(e.target.value)}
                                        placeholder='تخفیف' />
                                </div>
                                <div className='items'>
                                    <label>امتیاز</label>
                                    <Input value={rate} onChange={(e) => setrate(e.target.value)}
                                        placeholder='امتیاز' />
                                </div>
                                <div className='items'>
                                    <label>موجودی</label>
                                    <Input value={stock} onChange={(e) => setstock(e.target.value)}
                                        placeholder='موجودی' />
                                </div>

                                <div className='items'>
                        <label>طول بسته</label>
                        <Input value={boxLength} onChange={(e) => setboxLength(e.target.value)}
                               placeholder='طول بسته'/>
                    </div>
                    <div className='items'>
                        <label>عرض بسته</label>
                        <Input value={boxWidth} onChange={(e) => setboxWidth(e.target.value)}
                               placeholder='عرض بسته'/>
                    </div>
                    <div className='items'>
                        <label>ارتفاع بسته</label>
                        <Input value={boxHeight} onChange={(e) => setboxHeigth(e.target.value)}
                               placeholder='ارتفاع بسته'/>
                    </div>
                    <div className='items'>
                        <label>عرض محصول</label>
                        <Input value={productWidth} onChange={(e) => setproductWidth(e.target.value)}
                               placeholder='عرض محصول'/>
                    </div>
                    <div className='items'>
                        <label>طول محصول</label>
                        <Input value={productLength} onChange={(e) => setproductLength(e.target.value)}
                               placeholder='طول محصول'/>
                    </div>
                    <div className='items'>
                        <label>ارتفاع محصول</label>
                        <Input value={productHeight} onChange={(e) => setproductHeigth(e.target.value)}
                               placeholder='ارتفاع محصول'/>
                    </div>
                    <div className='items'>
                        <label>وزن </label>
                        <Input value={weight} onChange={(e) => setweight(e.target.value)}
                               placeholder='وزن'/>
                    </div>
                    <div className='items'>
                        <label>جنس </label>
                        <Input value={material} onChange={(e) => setmaterial(e.target.value)}
                               placeholder='جنس'/>
                    </div>
                    <div className='items'>
                        <label>پارچه </label>
                        <Input value={count} onChange={(e) => setcount(e.target.value)}
                               placeholder='پارچه'/>
                    </div>
                    
                                <div className='items my-dropdown'>
                                    <label>دسته بندی : </label>
                                    <Dropdown overlay={(
                                        <Menu >
                                            {categorylist.map((result) => (
                                                // {console.log(result)}
                                                <Menu.Item>
                                                    <div onClick={() => clickonitem(result.id, result.name)}
                                                        className='one-card-drop-down-selected network'>
                                                        <h4>{result.name}</h4>
                                                    </div>
                                                </Menu.Item>
                                            ))}



                                        </Menu>
                                    )} trigger={['click']}>
                                        <div className='one-card-drop-down-selected payment'>
                                            <h4>{categorynameselected}</h4>
                                            <DownOutlined />
                                        </div>


                                    </Dropdown>
                                </div>
                                <div className='items my-dropdown' >
                                    <label>برند : </label>
                                    <Dropdown overlay={(
                                        <Menu style={{overflow:'scroll',height:'300px'}}>
                                            {brandlist.map((result) => (
                                                // {console.log(result)}
                                                <Menu.Item>
                                                    <div onClick={() => clickonitembrand(result.id, result.title)}
                                                        className='one-card-drop-down-selected network'>
                                                        <h4>{result.title}</h4>
                                                    </div>
                                                </Menu.Item>
                                            ))}



                                        </Menu>
                                    )} trigger={['click']}>
                                        <div className='one-card-drop-down-selected payment'>
                                            <h4>{brandname}</h4>
                                            <DownOutlined />
                                        </div>
                                    </Dropdown>
                                </div>

                                <div className='items'>
                                    <label>توضیحات</label>
                                    {/* <Input.TextArea value={createText} onChange={e => setCreateText(e.target.value)}
                                        placeholder='متن' /> */}
                                </div>
                                                 {/* <RichTextEditor value={createText} onChange={setCreateText} />; */}
                                                 <JoditEditor
            	ref={editor}
                value={createText}
		tabIndex={1} // tabIndex of textarea
		onBlur={newContent => setCreateText(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={newContent => {setCreateText(newContent)}}
            />
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={createHandler}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        ادامه
                                        {/* {index === 3 ? 'Finish' : 'Continue'} */}
                                    </Button>

                                </div>
                            </Box>
                        </StepContent>
                    </Step>


                    <Step key={'رنگ '}>
                        <StepLabel

                        >
                            رنگ 
                        </StepLabel>
                        <StepContent style={{ width: '100%' }}>
                        <Typography style={{ width: '100%', display: 'flex', direction: 'rtl', flexDirection: 'column' }}>
                            {arraycolor.map((index)=>(
  <div style={{display:'flex',flexDirection:'row',cursor:'not-allowed'}}>
  <div className='items my-dropdown'>
<label>رنگ : </label>
<Dropdown overlay={(
<Menu style={{overflow:'scroll',height:'300px'}}>
{colorlist.map((result)=>(
// {console.log(result)}
<Menu.Item>
<div 
     className='one-card-drop-down-selected network'>
    <h4>{result.title}</h4>
</div>
</Menu.Item>
))}



</Menu>
)} >
<div className='one-card-drop-down-selected payment'>
<h4>{index.name}</h4>
<DownOutlined/>
</div>
</Dropdown>
</div>
<label style={{padding:'10px'}} ></label>
<Input style={{width:'200px'}} disabled={true}  value={index.count}></Input>
<Button onClick={createcolor} disabled={true}>ثبت</Button>
</div>

                            ))}
                                {listColorState.map((index , i)=>(
                                    i===listColorState.length-1?(
                                        <div style={{display:'flex',flexDirection:'row'}}>
                                                      <div className='items my-dropdown'>
                                        <label>رنگ : </label>
                                        <Dropdown overlay={(
                                            <Menu>
                                                {colorlist.map((result)=>(
                                                    // console.log(result)
               <Menu.Item>
                                                    <div   onClick={() => clickonitemcolor(result.id,result.name)}
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
                                    <label style={{padding:'10px'}} >تعداد :</label>
                                    <Input style={{width:'200px'}} onChange={(e) => setcolorcount(e.target.value)}></Input>
                                    <Button onClick={createcolor}>ثبت</Button>
                                        </div>
                          
                                    ):null

                                ))}
                            </Typography>
                           
                            <Box sx={{ mb: 2 }}>
                                <div>
                                <Button
                                        variant="contained"
                                        onClick={() => window.location.replace('/dashboard/product')}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        اتمام
                                        {/* {index === 3 ? 'Finish' : 'Continue'} */}
                                    </Button>

                                </div>
                            </Box>
                        </StepContent>
                    </Step>
             
                </Stepper>


            </Box>
        </div>
    );
};
export default Addproduct

