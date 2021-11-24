import React , {useEffect,useState} from 'react'
import Navbar from '../../component/navbar/navbar'
import Search from '../../component/search/search'
import style from './post.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft , faRetweet, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { auth, firestore } from '../../firebase/firebase'
import { useParams } from "react-router-dom"
import  CreatePost  from './../../component/createpost/createpost'
import Image from './../../component/showImage/Image'
import Post from './../../component/post/post'
import sendNotification from '../../notification'

export default function MainPost() {
    let navigate = useNavigate()
    const { postId } = useParams({})
    const [previewImg, setPreviewImg] = useState(false)

    const [uid , setUid] = useState('')
    const [id , setId] = useState('')
    const [isLike, setIsLike] = useState(false)
    const [numberLike, setNumberLike] = useState(0)
    const [isRetweet, setIsRetweet] = useState(false)
    const [numberRetweet, setNumberRetweet] = useState(0)

    const [postInfo, setPostInfo] = useState({
        img : 'null',
        postId : 'null',
        subPostID : 0,
        text : 'null',
        time : 'null',
        uid : 'null'
    })
    const [userPostInfo, setUserPostInfo] = useState({
        uid : '',
        username : '',
        email : '',
        photoURL : '',
        coverPhotoURL : '',
        created : '',
        role : '',
        follower : 0,
        following : 0,
        title : ''
    })

    const [subPostInfo, setSubPostInfo] = useState({
        img : 'null',
        postId : 'null',
        subPostID : 0,
        text : 'loading..',
        time : 'null',
        uid : 'null'
    })
    
    const [userSubPostInfo, setSubUserPostInfo] = useState({
        uid : '',
        username : '',
        email : '',
        photoURL : '',
        coverPhotoURL : '',
        created : '',
        role : '',
        follower : 0,
        following : 0,
        title : ''
    })

    const [userComment, setUserComment] = useState([])

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                setUid(user.uid)
                const userRetweetRef = firestore.collection('users').doc(user.uid)
                                                .collection('retweet')
                                                .where('postId' , '==' , parseInt(postId))
                userRetweetRef.onSnapshot(docs => {
                    if(docs.size == 0) {
                        setIsRetweet(false)
                    } else {
                        setIsRetweet(true)
                    }
                })

                const userLikeRef = firestore.collection('users').doc(user.uid)
                                             .collection('like')
                                             .where('postId' , '==' , parseInt(postId))
                userLikeRef.onSnapshot(docs => {
                    if(docs.size > 0) {
                        setIsLike(true)
                    } else {
                        setIsLike(false)
                    }
                })
            }
        })

        const postRef = firestore.collection('posts').where('postId','==',parseInt(postId))
        postRef.onSnapshot(docs => {
            docs.forEach(doc => {
                setId(doc.id)
                setPostInfo(doc.data());
                let subId = doc.data().subPostId;
                const userRef = firestore.collection('users').doc(doc.data().uid)
                userRef.onSnapshot(doc => {
                    setUserPostInfo(doc.data());
                    if(subId != 0){
                        const subPostRef = firestore.collection('posts').where('postId','==',subId)
                        subPostRef.onSnapshot(docs => {
                            docs.forEach(doc => {
                                setSubPostInfo(doc.data())
                                const userSubRef = firestore.collection('users').doc(doc.data().uid)
                                userSubRef.onSnapshot(doc => {
                                    setSubUserPostInfo(doc.data())
                                })
                            })
                        })
                    }
                })
                const commentRef = firestore.collection('posts')
                .where('subPostId' , '==' , parseInt(postId))
                commentRef.onSnapshot(docs => {
                    setUserComment([])
                    var temp = []
                    docs.forEach(doc => {
                        temp = [...temp , doc.data()]
                    })
                    temp.sort((a,b) => b.time - a.time)
                    setUserComment(temp)                    
                })
                const numberRetweetRef = firestore.collection('posts').doc(doc.id)
                                   .collection('retweet')
                numberRetweetRef.onSnapshot(docs => {
                  setNumberRetweet(docs.size)
                })
                const numberLikeRef = firestore.collection('posts').doc(doc.id)
                                   .collection('like')
                numberLikeRef.onSnapshot(docs => {
                  setNumberLike(docs.size)
                })
            })
        })
    }, [])

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

    const like = () => {
        firestore.collection('posts').doc(id)
        .collection('like').doc(uid)
        .set({
          date : new Date().valueOf(),
          uid : uid,
          id : id,
          postId : parseInt(postId)
        })
    
        firestore.collection('users').doc(uid)
        .collection('like').doc(id)
        .set({
          date : new Date().valueOf(),
          uid : uid,
          id : id,
          postId : parseInt(postId)
        })

        
        firestore.collection('users').doc(uid)
        .get().then(doc => {
          if(postInfo.uid != doc.data().uid)
          sendNotification(postInfo.uid,`${doc.data().username} liked your tweet!` , new Date().valueOf() , doc.data().photoURL , `/post/${postId}`)
        }) 
    }
    
    const retweet = () => {
        firestore.collection('posts').doc(id)
        .collection('retweet').doc(uid)
        .set({
          date : new Date().valueOf(),
          uid : uid,
          id : id,
          postId : parseInt(postId)
        })
    
        firestore.collection('users').doc(uid)
        .collection('retweet').doc(id)
        .set({
          date : new Date().valueOf(),
          uid : uid,
          id : id,
          postId : parseInt(postId)
        })

        
        firestore.collection('users').doc(uid)
        .get().then(doc => {
          if(postInfo.uid != doc.data().uid)
          sendNotification(postInfo.uid,`${doc.data().username} retweete your tweet!` , new Date().valueOf() , doc.data().photoURL , `/post/${postId}`)
        }) 
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

    return (
      <>
      {
        previewImg && postInfo.img && <Image url={postInfo.img} close={() => setPreviewImg(false)} />
      }
      <div>
        <Navbar />
        <div className="content">
          <div style={style.container}>
            <div className={style.topNav}>
              <FontAwesomeIcon icon={faArrowLeft} 
                               onClick={() => navigate(`/`)}/>
              <div className={style.textTopNav} >
                {userPostInfo.username.split(' ')[0] ? userPostInfo.username.split(' ')[0] : userPostInfo.username}'s Tweet
              </div>
            </div>
            <div style={{marginTop:59}}></div>
            {
                postInfo.subPostId != 0 && (
                    <div className={style.subPostContainer} onClick={() => window.location = `/post/${postInfo.subPostId}`}>
                        <div className={style.useInfo2}>
                            <div className={style.imgContainer}>
                                <div className={style.userProfile} style={{backgroundImage:`url(${userSubPostInfo.photoURL})`}}></div>
                            </div>
                            <div className={style.userTitle2}>
                                {subPostInfo.text}
                            </div>
                        </div>
                    </div>
                )
            }
            <div className={style.postContainer}>
                <div className={style.useInfo}
                     onClick={() => navigate(`/u/${userPostInfo.uid}`)}>
                    <div className={style.imgContainer}>
                        <div className={style.userProfile} style={{backgroundImage:`url(${userPostInfo.photoURL})`}}></div>
                    </div>
                    <div className={style.userTitle}>
                        <div className={style.userName}>{userPostInfo.username}</div>
                        <div className={style.time}>{convertTime(postInfo.time)}</div>
                    </div>
                </div>
                <div className={style.postInfo}>
                    {postInfo.text}
                </div>
                {
                    postInfo.img && (
                      <div className={style.previewImg}
                           style={{backgroundImage:`url(${postInfo.img})`}}
                           onClick={() => setPreviewImg(true)}
                           >
                      </div>
                    )
                }

                <div className={style.icons}>

                    {
                      isRetweet ? (
                        <div className={style.icon1Active}
                             onClick={unRetweet}>
                          <FontAwesomeIcon icon={faRetweet} />
                          {numberRetweet}
                        </div>   
                      ) : (
                        <div className={style.icon1}
                             onClick={retweet}>
                          <FontAwesomeIcon icon={faRetweet} />
                          {numberRetweet}
                        </div>    
                      )
                    }
                    {
                      isLike ? (
                        <div className={style.icon3Active}
                             onClick={unLike}>
                          <FontAwesomeIcon icon={faHeart}/>
                          {numberLike}
                        </div>
                      ) : (
                        <div className={style.icon3}
                              onClick={like}>
                          <FontAwesomeIcon icon={faHeart}/>
                          {numberLike}
                        </div>
                      )
                    }
                </div>
            </div>
            <CreatePost subpost={postId}/>
            {
                userComment.map((item,index) => {
                    return <Post key={index} item={item} />
                })
            } 
          </div>
          <Search /> 
        </div>
      </div>
      </>
    )
}
