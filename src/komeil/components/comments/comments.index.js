import React, {useState} from 'react';
import './comments.style.scss'
import profilePic from '../../../assets/image/emptyProfile.png'
import {Button, Card, Collapse, Input, Modal, Spin} from "antd";
import {post, put, responseValidator} from "../../../api";
import {toast} from "react-toastify";


const Comments = function (props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [likeLoading, setLikeLoading] = useState(false)
    const [likeCounting, setLikeCounting] = useState(props.data.likes)
    const [isLiked, setIsLiked] = useState(props.data.favourite)
    const [isReply, setIsReply] = useState(false)
    const [replyLoading, setReplyLoading] = useState(false)
    const [replyText, setReplyText] = useState(undefined)

    function likeHandler() {
        setLikeLoading(true)
        const body = {
            commentId: props.data.id,
            like: true
        }
        post('/likes/favourite?mobile=admin', body).then(res => {
            setLikeLoading(false)
            if (responseValidator(res.status)) {
                if (isLiked) {
                    setIsLiked(false)
                    setLikeCounting(likeCounting - 1);
                } else {
                    setIsLiked(true)
                    setLikeCounting(likeCounting + 1)
                }
            } else
                toast.error('خطایی رخ داده است')
        })
    }

    function deleteHandler() {
        setDeleteLoading(true)
        put(`/admin/specificdeceased/comment?id=${props.data.id}&mobile=admin`).then(res => {
                setDeleteLoading(false)
                if (responseValidator(res.status)) {
                    toast.success('عملیات با موفقیت انجام شد')
                    props.onDelete()
                } else
                    toast.error('خطایی رخ داده است')
            }
        )
    }

    function replyHandler() {
        setReplyLoading(true)
        const body = {
            commentId: props.data.id,
            deceasedId: props.motevaffaID,
            txt: replyText
        }
        post('/comments/reply?mobile=admin', body).then(res => {
            setReplyLoading(false)
            if (responseValidator(res.status)) {
                toast.success('عملیات با موفقیت انجام شد')
                props.onDelete()
            } else
                toast.error('خطایی رخ داده است')
        })
    }

    return (
        <Card className='komeil-comments-component'>
            <Modal closable={false} className='verification-my-modal' footer={[
                <Button onClick={() => setIsModalOpen(false)} key="back">
                    خیر
                </Button>,
                <Button loading={deleteLoading} key="submit" type="primary" onClick={deleteHandler}>
                    بله
                </Button>,

            ]} onCancel={() => setIsModalOpen(false)} visible={isModalOpen}>
                <p>آیا از حذف کردن این پیام اطمینان دارید ؟</p>
            </Modal>
            {props.data.reply && <div className='reply-box'><i onClick={() => setIsReply(!isReply)} className="material-icons">
                            reply
                        </i>{props.data.reply}</div>}
            <div className='info'>
                <img src={props.data.imageurl ? props.data.imageurl : profilePic} alt='profile-pic'/>
                <div className='detail'>
                    <div className='name'>
                        <h4>{props.data.name ? props.data.name : 'بدون نام'}</h4>
                        <span/>
                        {!likeLoading ? <label>{likeCounting}</label> : <Spin size='small'/>}
                        {isLiked ? <i onClick={likeHandler} className="material-icons">
                            favorite
                        </i> : <i onClick={likeHandler} className="material-icons">
                            favorite_border
                        </i>}
                        <i onClick={() => setIsModalOpen(true)} className="material-icons">
                            delete_outline
                        </i>
                        {props.isOwner && !props.data.reply && <i onClick={() => setIsReply(!isReply)} className="material-icons">
                            reply
                        </i>}
                    </div>

                    <span>{new Date(props.data.timestamp).toLocaleDateString('fa')}</span>
                </div>
            </div>
            <p>{props.data.message}</p>
            <div style={{height: isReply ? '144px' : '0'}} className='new-reply-box'>
                <Input.TextArea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                                placeholder='پاسخ خود را بنویسید'/>
                <Button onClick={replyHandler} type='primary'>ارسال</Button>
            </div>

        </Card>
    );
};
export default Comments
