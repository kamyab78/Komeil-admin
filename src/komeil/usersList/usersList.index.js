import React, { useEffect, useRef, useState } from 'react';
import './usersList.style.scss'
import { Button, Card, Col, Divider, Input, Modal, Row, Spin, Table, Tag, Typography, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { del, get, post, put, responseValidator, upload } from "../../api";
import { toast } from "react-toastify";
import { useHistory } from 'react-router-dom'
import ProfilePic from "../../assets/image/emptyProfile.png";
import { Config } from '../../util/config'
const UserLists = function (props) {
    const searchInput = useRef();
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true)
    const allData = [];
    const history = useHistory()
    const [isModalOpen, setIsModalOpen] = useState(null)
    const [idSelected, setIdSelected] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [newuserModal, setNewuserModal] = useState(false)
    const [imageUploader, setImageUploader] = useState(null)
    const uploadRef = useRef(null)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [userNewUserName, setuserNewUserName] = useState(null)
    const [createLoading, setCreateLoading] = useState(false)
    const uploadTools = useRef();
    const[editusermodal,seteditusermodal]=useState(false)
    // const [userSelected,setUserSelected]=useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [brandRole, setbrandRole] = useState(false)
    const [bannerRole, setbannerRole] = useState(false)
    const [filterRole, setfilterRole] = useState(false)
    const [newsRole, setnewsRole] = useState(false)
    const [productRole, setproductRole] = useState(false)
    const [staticRole, setstaticRole] = useState(false)
    const [transportRole, settransportRole] = useState(false)
    const [colorRole, setcolorRole] = useState(false)
    const [categoryRole, setcategoryRole] = useState(false)
    const [ticketRole, setticketRole] = useState(false)
    const [editusername,seteditusername]=useState('')
    const [editpassword,seteditpassword]=useState('')
    const [idselected,setidselected]=useState('')
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

        fetch(Config()['apiUrl'] + "/admin/assign-role?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {


                setLoading(false);
                response.json().then(rep => {
                    console.log(rep)

                    rep.map((item) => {
                        allData.push({
                            key: item.id,
                            username: item.username === " " ? "تنظیم نشده است" : item.username,
                            pass: item.password === " " ? "تنظیم نشده است" : item.password,
                            banner: item.banner_role,
                            brand: item.brand_role,
                            news: item.news_role,
                            product: item.product_role,
                            static: item.static_role,
                            transport: item.transport_role,
                            category: item.category_role,
                            ticket: item.ticket_role,
                            color: item.color_role,
                            filter: item.filter_role,
                            data:item
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

    function changeUploaderHandler(e) {
        setLoadingUpload(true)
        const FILE = e.target.files[0];
        const form = new FormData();
        form.append('file', FILE);
        uploadTools.current = upload('/utility/image', form, (e) => {
            //progress bar
        });
        uploadTools.current.promise.then((res) => {
            setLoadingUpload(false)
            if (responseValidator(res.status))
                setImageUploader(res.data.path)

        });
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
    const columns = [
        {
            title: "نام کاربری",
            dataIndex: "data",
            key: "data",
            render: item => <span className="gx-link" onClick={()=>{openmodaledit(item) }}>{item.username}</span>
         
        },
        {
            title: "رمز عبور",
            dataIndex: "pass",
            key: "pass",
            render: text => <span className="gx-link">{text}</span>,
            ...getColumnSearchProps("pass"),
        },
        {
            title: "برند",
            dataIndex: "brand",
            key: "brand",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        {
            title: "بنر",
            dataIndex: "banner",
            key: "banner",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        {
            title: "فیلتر",
            dataIndex: "filter",
            key: "filter",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        {
            title: "اخبار",
            dataIndex: "news",
            key: "news",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        {
            title: "محصولات",
            dataIndex: "product",
            key: "product",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        {
            title: "آمار",
            dataIndex: "static",
            key: "static",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        {
            title: "ارسال",
            dataIndex: "transport",
            key: "transport",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        {
            title: "رنگ",
            dataIndex: "color",
            key: "color",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        {
            title: "دسته بندی",
            dataIndex: "category",
            key: "category",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        {
            title: "تیکت",
            dataIndex: "ticket",
            key: "ticket",
            render: status => {
                let color;
                if (status === true) {
                    color = "green";
                } else {
                    color = "red";
                }
                return (
                    <Tag color={color} key={status}>
                        {status === true ? 'دارد' : 'ندارد'}
                    </Tag>
                );
            },
            filters: [
                { text: "دارد", value: true },
                { text: "ندارد", value: false },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0

        },
        // {
        //     title: "عمیات ها",
        //     key: "action",
        //     render: (text) => (
        //         <span>
        //             <Text type='warning' style={{ cursor: 'pointer' }} onClick={() => {
        //                 setNewuserModal(true)
        //                 // setUserSelected(text)
        //                 setImageUploader(text.imageurl)
        //                 setuserNewUserName(text.name)
        //                 setNewPassword(text.password)
        //                 setIdSelected(text.key)
        //             }}
        //                 className="gx-link">
        //                 ویرایش
        //   </Text>

        //         </span>
        //     )
        // }
    ];

    function confirmHandler() {
        setDeleteLoading(true)
        put(`/admin/user?id=${idSelected}&mobile=admin`, { block: selectedStatus === 'active' }).then(res => {
            setDeleteLoading(false)
            if (responseValidator(res.status)) {
                toast.success('عملیات با موفقیت انجام شد')
                setIsModalOpen(false)
                getData()
            } else toast.error('خطایی رخ داده است')
        })
    }

    function createHandler() {
        setCreateLoading(true)
        const body = {
            "username": userNewUserName,
            "password": newPassword,
            "transport_role":transportRole,
            "ticket_role":ticketRole,
            "static_role":staticRole,
            "product_role":productRole,
            "news_role":newsRole,
            "filter_role":filterRole,
            "color_role":colorRole,
            "category_role":categoryRole,
            "brand_role":brandRole,
            "banner_role":bannerRole,
            "admin_role":"false"
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

        fetch(Config()['apiUrl'] + "/admin/assign-role?username="+localStorage.getItem('username'), requestOptions)
            .then(response => {

                setCreateLoading(false)
if(response.status===200){
    toast.success('عملیات با موفقیت انجام شد')
    setNewuserModal(false)
    getData()
}
else{
     toast.error('خطایی رخ داده است')
}
             





            })
            .catch(error => console.log('error', error));

    }
    function editRole(){
        setCreateLoading(true)
        const body = {
            "username": editusername,
            "password": editpassword,
            "transport_role":transportRole,
            "ticket_role":ticketRole,
            "static_role":staticRole,
            "product_role":productRole,
            "news_role":newsRole,
            "filter_role":newsRole,
            "color_role":colorRole,
            "category_role":categoryRole,
            "brand_role":brandRole,
            "banner_role":bannerRole,
            "admin_role":"false"
        }
        var requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                // "Authorization": "Basic " + window.localStorage.getItem('basic')

            },
            body:JSON.stringify(body)


        };

        fetch(Config()['apiUrl'] + "/admin/assign-role?username="+localStorage.getItem('username')+"&Id="+idselected, requestOptions)
            .then(response => {

                setCreateLoading(false)
if(response.status===200){
    toast.success('عملیات با موفقیت انجام شد')
    setNewuserModal(false)
    getData()
}
else{
     toast.error('خطایی رخ داده است')
}
             





            })
            .catch(error => console.log('error', error));
    }
    function openmodaledit(item){
        console.log(item)
        seteditusername(item.username)
        seteditpassword(item.password)
        setidselected(item.id)
        seteditusermodal(true)
            }
    function onchangecheck(checkedValues) {
        setnewsRole(false)
        setbannerRole(false)
        setbrandRole(false)
        setfilterRole(false)
        setproductRole(false)
        setstaticRole(false)
        settransportRole(false)
        setcolorRole(false)
        setcategoryRole(false)
        setticketRole(false)
        for (var i = 0; i < checkedValues.length; i++) {
            if (checkedValues[i] === 'news_role')
                setnewsRole(true)
            if (checkedValues[i] === 'brand_role')
                setbrandRole(true)
            if (checkedValues[i] === 'color_role')
                setcolorRole(true)
            if (checkedValues[i] === 'banner_role')
            setbannerRole(true)
            if (checkedValues[i] === 'product_role')
                setproductRole(true)
            if (checkedValues[i] === 'static_role')
                setstaticRole(true)
            if (checkedValues[i] === 'transport_role')
                settransportRole(true)
            if (checkedValues[i] === 'category_role')
                setcategoryRole(true)
            if (checkedValues[i] === 'ticket_role')
                setticketRole(true)
            if (checkedValues[i] === 'filter_role')
                setfilterRole(true)
        }
        console.log('checked = ', checkedValues);
    }
    return (
        <div className='users-list-page'>
            <Modal closable={false} className='verification-my-modal' footer={[
                <Button onClick={() => setIsModalOpen(false)} key="back">
                    خیر
                </Button>,
                <Button loading={deleteLoading} key="submit" type="primary" onClick={confirmHandler}>
                    بله
                </Button>,

            ]} onCancel={() => setIsModalOpen(false)} visible={isModalOpen}>
                <p>آیا از {selectedStatus === 'active' ? 'غیر فعال سازی' : 'فعال کردن'} این کاربر اطمینان دارید ؟</p>
            </Modal>
            {/*---------------------------------------*/}
            <Modal closable={false} className='create-new-user-modal' footer={[
                <Button onClick={() => setNewuserModal(false)} key="back">
                    لغو
                </Button>,
                <Button loading={createLoading} key="submit" type="primary" onClick={createHandler}>
                    تغییر
                </Button>,

            ]} onCancel={() => setNewuserModal(false)} visible={newuserModal}>
                <div className='create-news-modal-preview'>

                    <div className='items'>
                        <label>نام کاربری</label>
                        <Input value={userNewUserName} onChange={(e) => setuserNewUserName(e.target.value)}
                            placeholder='نام کاربری' />
                    </div>
                    <div className='items'>
                        <label>رمز عبور</label>
                        <Input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='رمز عبور' />
                    </div>
                    <Checkbox.Group style={{ width: '100%', marginTop: '10px' }} onChange={onchangecheck}>
                        <Row>
                            <Col span={8}>
                                <Checkbox value="news_role">اخبار</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="color_role">رنگ</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="brand_role">برند</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="banner_role">بنر</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="product_role">محصولات</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="static_role">آمار</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="transport_role">ارسال</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="category_role">دسته بندی</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="ticket_role">تیکت</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="filter_role">فیلتر</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </div>
            </Modal>
            {/*--------------------------------------------*/}
            <Modal closable={false} className='create-new-user-modal' footer={[
                <Button onClick={() => seteditusermodal(false)} key="back">
                    لغو
                </Button>,
                <Button loading={createLoading} key="submit" type="primary" onClick={editRole}>
                    تغییر
                </Button>,

            ]} onCancel={() => seteditusermodal(false)} visible={editusermodal}>
                <div className='create-news-modal-preview'>

                    <div className='items'>
                        <label>نام کاربری</label>
                        <Input value={editusername} onChange={(e) => seteditusername(e.target.value)}
                            placeholder='نام کاربری' />
                    </div>
                    <div className='items'>
                        <label>رمز عبور</label>
                        <Input type='password' value={editpassword} onChange={(e) => seteditpassword(e.target.value)}
                            placeholder='رمز عبور' />
                    </div>
                    <Checkbox.Group style={{ width: '100%', marginTop: '10px' }} onChange={onchangecheck}>
                        <Row>
                            <Col span={8}>
                                <Checkbox  value="news_role">اخبار</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="color_role">رنگ</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="brand_role">برند</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="banner_role">بنر</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="product_role">محصولات</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="static_role">آمار</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="transport_role">ارسال</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="category_role">دسته بندی</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="ticket_role">تیکت</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="filter_role">فیلتر</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </div>
            </Modal>
            {/*--------------------------------------------*/}
            <Card title={
                <div className='get_list_page_title'>
                    <p>لیست اعضا</p>
                    <span />
                    <Button onClick={() => setNewuserModal(true)} type={"primary"}>ساخت عضو جدید</Button>
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
export default UserLists



