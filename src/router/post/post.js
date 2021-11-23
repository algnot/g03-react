import React , {useEffect,useState} from 'react'
import Navbar from '../../component/navbar/navbar'
import Search from '../../component/search/search'
import style from './post.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { firestore } from '../../firebase/firebase'
import { useParams } from "react-router-dom"
import  CreatePost  from './../../component/createpost/createpost'
import Image from './../../component/showImage/Image'
import Post from './../../component/post/post'

export default function MainPost() {
    let navigate = useNavigate()
    const { postId } = useParams({})
    const [previewImg, setPreviewImg] = useState(false)

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
        const postRef = firestore.collection('posts').where('postId','==',parseInt(postId))
        postRef.onSnapshot(docs => {
            docs.forEach(doc => {
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
            })
        })
    }, [])

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
                <div className={style.useInfo}>
                    <div className={style.imgContainer}>
                        <div className={style.userProfile} style={{backgroundImage:`url(${userPostInfo.photoURL})`}}></div>
                    </div>
                    <div className={style.userTitle}>
                        <div className={style.userName}>{userPostInfo.username}</div>
                        <div className={style.time}>{postInfo.time}</div>
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
            </div>
            <CreatePost subpost={postId}/>
            {
                userComment.map((item,index) => {
                    return <Post key={index} item={item}/>
                })
            }
          </div>
          <Search /> 
        </div>
      </div>
      </>
    )
}
