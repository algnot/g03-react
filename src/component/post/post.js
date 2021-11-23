import React,{useState,useEffect} from 'react'
import style from "./post.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRetweet, faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { auth, firestore } from '../../firebase/firebase';
import Image from './../showImage/Image'
import { useNavigate } from "react-router-dom"

export default function Post({item}) {
  let navigate = useNavigate();

  const [user, setUser] = useState({
    uid : '',
    username : '',
    email : '',
    photoURL : '',
    coverPhotoURL : '',
    created : '',
    role : '',
    follower : [],
    following : [],
    title : ''
  })
  
  const [previewImg, setPreviewImg] = useState(false)
  const [uid , setUid] = useState('')
  const [id , setId] = useState('')
  const [isLike, setIsLike] = useState(false)
  const [numberLike, setNumberLike] = useState(0)

  const like = () => {
    firestore.collection('posts').doc(id)
    .collection('like').doc(uid)
    .set({
      date : new Date().valueOf(),
      uid : uid,
      id : id,
      postId : item.uid
    })

    firestore.collection('users').doc(uid)
    .collection('like').doc(id)
    .set({
      date : new Date().valueOf(),
      uid : uid,
      id : id,
      postId : item.uid
    })
  }

  const unLike = () => {
    firestore.collection('posts').doc(id)
    .collection('like').doc(uid)
    .delete()

    firestore.collection('users').doc(uid)
    .collection('like').doc(id)
    .delete()
  }

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        setUid(user.uid)
      }
      const postRef = firestore.collection('posts').where('postId','==',item.postId).limit(1)
      postRef.onSnapshot( docs => {
        docs.forEach(doc => {
          setId(doc.id)
          const isLikeRef = firestore.collection('posts').doc(doc.id)
                                 .collection('like').doc(user.uid)
          const numberLikeRef = firestore.collection('posts').doc(doc.id)
                                 .collection('like')
          numberLikeRef.onSnapshot(docs => {
            setNumberLike(docs.size)
          })
          isLikeRef.onSnapshot(doc => {
            if(doc.exists) setIsLike(true)
            else setIsLike(false)
          })
        })
      })
    })
    firestore.collection('users').doc(item.uid)
    .onSnapshot(doc => {
      if(doc.data()){
        setUser(doc.data())
      }
    })
  }, [])

  return (
    <>
    {
      previewImg && item.img && <Image url={item.img} close={() => setPreviewImg(false)} />
    }
    <div className={style.container} >
      <div className={style.useInfo} onClick={() => navigate(`/u/${item.uid}`)}>
        <div className={style.imgContainer}>
          <div className={style.userProfile} style={{backgroundImage:`url(${user.photoURL})`}}></div>
        </div>
        <div className={style.userTitle}>
          <div className={style.userName}>{user.username}</div>
          <div className={style.time}>{item.time}</div>
        </div>
      </div>
      <div className={style.postInfo} onClick={() => navigate(`/post/${item.postId}`)}>
        {item.text}
      </div>
      {
        item.img && (
          <div className={style.previewImg}
               style={{backgroundImage:`url(${item.img})`}}
               onClick={() => setPreviewImg(true)}>
          </div>
        )
      }
      <div className={style.icons}>
        <div className={style.icon1}>
          <FontAwesomeIcon icon={faRetweet} />
          10
        </div>
        <div className={style.icon2}>
          <FontAwesomeIcon icon={faComment} />
          10
        </div>
        {
          isLike ? (
            <div className={style.icon3Active} onClick={unLike}>
              <FontAwesomeIcon icon={faHeart}/>
              {numberLike}
            </div>
          ) : (
            <div className={style.icon3} onClick={like}>
              <FontAwesomeIcon icon={faHeart}/>
              {numberLike}
            </div>
          )
        }
      </div>
    </div>
    </>
  );
}
