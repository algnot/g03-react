import React,{useState,useEffect} from 'react'
import style from "./post.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRetweet, faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { auth, firestore } from '../../firebase/firebase';
import Image from './../showImage/Image'
import { useNavigate } from "react-router-dom"
import sendNotification from '../../notification';
 
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
  const [isRetweet, setIsRetweet] = useState(false)
  const [numberRetweet, setNumberRetweet] = useState(0)
  const [numberComment, setNumberComment] = useState(0)
  const [userSubpost, setUserSubpost] = useState('')

  const like = () => {
    firestore.collection('posts').doc(id)
    .collection('like').doc(uid)
    .set({
      date : new Date().valueOf(),
      uid : uid,
      id : id,
      postId : item.postId
    })

    firestore.collection('users').doc(uid)
    .collection('like').doc(id)
    .set({
      date : new Date().valueOf(),
      uid : uid,
      id : id,
      postId : item.postId
    })

    firestore.collection('users').doc(uid)
    .get().then(doc => {
      if(item.uid != doc.data().uid)
        sendNotification(item.uid , `${doc.data().username} liked your tweet!`,new Date().valueOf(),doc.data().photoURL,`/post/${item.postId}`)
    })
  }

  const retweet = () => {
    firestore.collection('posts').doc(id)
    .collection('retweet').doc(uid)
    .set({
      date : new Date().valueOf(),
      uid : uid,
      id : id,
      postId : item.postId
    })

    firestore.collection('users').doc(uid)
    .collection('retweet').doc(id)
    .set({
      date : new Date().valueOf(),
      uid : uid,
      id : id,
      postId : item.postId
    })
    
    firestore.collection('users').doc(uid)
    .get().then(doc => {
      if(item.uid != doc.data().uid)
        sendNotification(item.uid , `${doc.data().username} retweete your tweet!`,new Date().valueOf(),doc.data().photoURL,`/post/${item.postId}`)
    })
    
  }

  const unRetweet = () => {
    firestore.collection('posts').doc(id)
    .collection('retweet').doc(uid).delete()

    firestore.collection('users').doc(uid)
    .collection('retweet').doc(id).delete()
  }

  const unLike = () => {
    firestore.collection('posts').doc(id)
    .collection('like').doc(uid)
    .delete()

    firestore.collection('users').doc(uid)
    .collection('like').doc(id)
    .delete()
  }

  const convertTime = (time) => {
    var sec = Math.floor(new Date().valueOf() - time) / 1000
    var min = Math.floor(sec/60)
    var hour = Math.floor(min/60)
    var day = Math.floor(hour/24)

    var date = new Date(time).getDate()
    var month_name = ["January","February","March","April","May","June","July","August","September","October","November","Decemter"]
    var monthD = new Date(time).getMonth()
    var year = new Date(time).getFullYear()

    if(sec < 60) {
      return `${parseInt(sec)} seconds ago`
    }
    else if(min < 60) {
      return `${parseInt(min)} minutes ago`
    }
    else if(hour < 24){
      return `${parseInt(hour)} hours ago`
    }
    else if(day < 3){
      return `${parseInt(day)} days ago`
    }
    else {
      return `${date} ${month_name[monthD]} ${year}`
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        setUid(user.uid)
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

            const isRetweetRef = firestore.collection('posts').doc(doc.id)
                                   .collection('retweet').doc(user.uid)
            const numberRetweetRef = firestore.collection('posts').doc(doc.id)
                                   .collection('retweet')
            numberRetweetRef.onSnapshot(docs => {
              setNumberRetweet(docs.size)
            })
            isRetweetRef.onSnapshot(doc => {
              if(doc.exists) setIsRetweet(true)
              else setIsRetweet(false)
            })
            const numberCommentRef = firestore.collection('posts')
                                    .where('subPostId' , '==' , item.postId)
            numberCommentRef.onSnapshot(docs => {
              setNumberComment(docs.size);
            })
          })
        })
      }
    })

    firestore.collection('users').doc(item.uid)
    .get().then(doc => {
      if(doc.data()){
        setUser(doc.data())
      }
    })

    firestore.collection('posts').where('postId','==',item.subPostId)
    .get().then(docs => {
      docs.forEach(doc => {
        var uid = doc.data().uid
        firestore.collection('users').doc(uid)
        .get().then(doc => {
          setUserSubpost(doc.data().username)
        })
      })
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
          <div className={style.time}>{convertTime(item.time)}</div>
          {
            item.subPostId != 0 && (
              <div className={style.reply}>
                {`Replying to ${userSubpost}`} 
              </div>
            )
          }
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

        {
          isRetweet ? (
            <div className={style.icon1Active} onClick={unRetweet}>
              <FontAwesomeIcon icon={faRetweet} />
              {numberRetweet}
            </div>   
          ) : (
            <div className={style.icon1} onClick={retweet}>
              <FontAwesomeIcon icon={faRetweet} />
              {numberRetweet}
            </div>    
          )
        }
        
        <div className={style.icon2} onClick={() => window.location.href = `/post/${item.postId}` }>
          <FontAwesomeIcon icon={faComment} />
          {numberComment}
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
