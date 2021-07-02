import React, {useEffect, useRef, useState} from 'react';
import './deathPreview.style.scss'
import {useParams, useHistory} from "react-router-dom";
import {del, get, post, put, responseValidator, upload} from "../../api";
import {toast} from "react-toastify";
import Loading from "../../loading/loading.index";
import {Button, Card, Input, Modal, Spin} from "antd";
import Comments from "../components/comments/comments.index";
import ProfilePic from '../../assets/image/emptyProfile2.png'

const DeathPreview = function () {
    const {id} = useParams();
    const [data, setData] = useState(null)
    const [activeSection, setActiveSection] = useState(1)
    const [isModalOpen3, setIsModalOpen3] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isModalOpen2, setIsModalOpen2] = useState(null)
    const [deleteLoading2, setDeleteLoading2] = useState(false)
    const [galleryData, setGalleryData] = useState(null)
    const history = useHistory()
    const [loadingUpload, setLoadingUpload] = useState(false)
    const uploadTools = useRef();
    const uploadRef = useRef(null)
    const [comments, setComments] = useState(null)
    const [newComment, setNewComment] = useState(null)
    const [commentLoading, setCommentLoading] = useState(false)
    const [pictureSelected, setPictureSelected] = useState(null)
    const [followerLoading, setFollowerLoading] = useState(false)
    const [followerList, setFollowerList] = useState(undefined)

    function getGallery() {
        get('/admin/specificdeceased/gallery', {id}).then(res => {
            {
                if (responseValidator(res.status)) {

                    setGalleryData(res.data.map(item => item.imagespath))
                } else toast.error('خطایی رخ داده است')
            }
        })
    }

    function getComments() {
        get('/admin/specificdeceased/comment', {id, mobile: 'admin'}).then(res => {
            {
                if (responseValidator(res.status))
                    setComments(res.data)
                else toast.error('خطایی رخ داده است')
            }
        })
    }
    function getDate(){
           get('/admin/specificdeceased', {id}).then(res => {

                if (responseValidator(res.status))
                    setData(res.data)
                else toast.error('خطایی رخ داده است')

        })
    }

    useEffect(() => {
getDate()
        getGallery()
        getComments()
    }, [])

    function confirmHandler() {
        setDeleteLoading(true)
        del('/admin/deceased?mobile=admin&id=' + id, {}).then(res => {
            setDeleteLoading(false)
            if (responseValidator(res.status)) {
                toast.success('عملیات با موفقیت انجام شد')
                setIsModalOpen(false)
                 setTimeout(() => {
                        window.location.replace('/dashboard/pageList/')
                    }, 1000)
            } else toast.error('خطایی رخ داده است')
        })
    }

    function getFollowerList() {
        setFollowerLoading(true)
        get('/admin/followerlist?id=' + id).then(res => {
            if (responseValidator(res.status)) {
                setFollowerList(res.data)
                setFollowerLoading(false)
            } else {
                toast.error('خطایی رخ داده است')
            }

        })
    }

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
            if (responseValidator(res.status)) {
                post(`/admin/specificdeceased/gallery?id=${id}&path=${res.data.path}`).then(res => {
                    if (responseValidator(res.status)) {
                        toast.success('عملیات با موفقیت انجام شد')
                        setGalleryData(null)
                        getGallery()
                    } else
                        toast.error('خطایی رخ داده است')
                })
            }
        });
    }

    if (!data || !galleryData || !comments)
        return <Loading/>

    function deleteHandler(item) {
        setDeleteLoading2(true)
        put(`/admin/specificdeceased/gallery?id=${id}&path=${item}&mobile=admin`).then(res => {
                setDeleteLoading2(false)
                if (responseValidator(res.status)) {
                    toast.success('عملیات با موفقیت انجام شد')
                    setIsModalOpen2(false)
                    setGalleryData(null)
                    getGallery()
                } else {
                    toast.error('خطایی رخ داده است')
                }
            }
        )
    }

    function submitNewHandler() {
        setCommentLoading(true)
        post(`/admin/specificdeceased/comment?mobile=admin`, {deceasedId: id, message: newComment}).then(res => {
            setCommentLoading(false)
            if (responseValidator(res.status)) {
                toast.success('عملیات با موفقیت انجام شد')
                setComments(null)
                setNewComment(null)
                getComments()
            } else toast.error('خطایی رخ داده است')
        })
    }

    return (
        <div className='komeil-death-preview-page'>
            <Modal closable={false} className='verification-my-modal' footer={[
                <Button onClick={() => {
                    setIsModalOpen3(false)
                    setFollowerList(undefined)
                }} key="back">
                    بستن
                </Button>,

            ]} onCancel={() => {
                setIsModalOpen3(false)
                setFollowerList(undefined)
            }} visible={isModalOpen3}>
                <div className='follower-list-content'>
                    {followerList ?
                        (followerList.length !== 0 ?
                                followerList.map((item, index) => <div className='items' key={index}>
                                    <img src={item.imageurl ? item.imageurl : ProfilePic}/>
                                    <div className='info'>
                                        <p>{item.name}</p>
                                        <span>{item.mobile}</span>
                                    </div>
                                </div>) : <p>موردی یافت نشد</p>
                        ) : <Spin/>}
                </div>
            </Modal>
            {/*-------------------------------------*/}
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
            {/*----------------------------------------*/}
            <Modal closable={false} className='verification-my-modal' footer={[
                <Button onClick={() => setIsModalOpen2(false)} key="back">
                    خیر
                </Button>,
                <Button loading={deleteLoading2} key="submit" type="primary"
                        onClick={() => deleteHandler(pictureSelected)}>
                    بله
                </Button>,

            ]} onCancel={() => setIsModalOpen2(false)} visible={isModalOpen2}>
                <p>آیا از حذف کردن این عکس اطمینان دارید ؟</p>
            </Modal>
            {/*--------------------------------------------*/}
            <Card>
                <div className='info'>
                    <div className='right'>
                        <div className='my-container'>
                            <div className='items'>
                                <h1>{data.name}</h1>
                                <label onClick={() => {
                                    setIsModalOpen3(true)
                                    getFollowerList()
                                }}>{data.followerCount} دنبال کننده</label>
                            </div>
                            <div className='items'>
                                <span>تاریخ تولد‌  : </span>

                                <p> {   new Date(data.birthday*1000).toLocaleDateString('fa')
}</p>
                            </div>
                            <div className='items'>
                                <span>تاریخ وفات‌  : </span>
                                     <p> {   new Date(data.deathday*1000).toLocaleDateString('fa')
}</p>
                            </div>
                            <div className='items'>
                                <span>آرامگاه  : </span>
                                <p>{data.deathloc}</p>
                            </div>
                            <div className='items'>
                                <p className='detail'>{data.description}</p>
                            </div>

                        </div>


                    </div>
                    <div className='left'>
                        <img src={data.imageurl} alt='profile pic'/>
                        <p className='privacy'>سطح دسترسی
                            : {data.accesstype === 'Public' ? 'عمومی' : data.accesstype === 'Private' ? 'خصوصی' : 'نیمه خصوصی'}</p>
                        <div className='btn'>
                            <Button onClick={() => history.push('/dashboard/createPage/' + id + '/')}
                                    type={"primary"}>ویرایش</Button>
                            <Button onClick={() => setIsModalOpen(true)} type={"default"}>حذف</Button>
                        </div>
                    </div>
                </div>
                <div className='sections'>
                    <div onClick={() => setActiveSection(1)}
                         className={`items  ${activeSection === 1 ? 'active' : ''}`}>
                        <h2>گالری تصاویر</h2>
                    </div>
                    <div onClick={() => setActiveSection(2)}
                         className={`items  ${activeSection === 2 ? 'active' : ''}`}>
                        <h2>تالار گفتگو</h2>
                    </div>
                </div>
                {activeSection === 1 && <div className='gallery'>
                    <div onClick={() => uploadRef.current.click()} className='items new'>
                        <input accept="image/*" onChange={changeUploaderHandler} ref={uploadRef} className='uploader'
                               type='file'/>
                        {loadingUpload &&
                        <div onClick={() => uploadRef.current.click()} style={{display: 'flex'}}
                             className='change-mode'>
                            <Spin/>
                        </div>}
                        <i className="material-icons">
                            add_circle_outline
                        </i>
                    </div>
                    {galleryData.map((item, index) => <div key={index} className='items'>
                        <img src={item}/>
                        <div onClick={() => {
                            setIsModalOpen2(true)
                            setPictureSelected(item)
                        }} className='edit-mode'>
                            <i className="material-icons">
                                delete_outline
                            </i>
                        </div>
                    </div>)}
                    <div className='my-grid'/>
                    <div className='my-grid'/>
                    <div className='my-grid'/>
                </div>}
                {activeSection === 2 && <div className='comments'>
                    <div style={{margin: '14px 0'}} className='new-comment'>
                        <Input.TextArea value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                        placeholder='متن خود را وارد کنید'/>
                        <div className='my-btn'>
                            <Button loading={commentLoading} onClick={submitNewHandler} type={"primary"}>ثبت</Button>
                        </div>

                    </div>
                    {comments.map((item, index) => <Comments motevaffaID={id} isOwner={data.isowner} key={index}
                                                             onDelete={() => {
                                                                 setComments(null)
                                                                 getComments()
                                                             }} data={item}/>)}
                </div>}
            </Card>
        </div>
    );
};
export default DeathPreview
