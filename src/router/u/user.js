import React , {useEffect,useState} from 'react';
import style from './../profile/Profile.module.css';
import Navbar from "../../component/navbar/navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons'
import Image from '../../component/showImage/Image';
import { useNavigate } from "react-router-dom"
import Search from '../../component/search/search';
import { useParams } from "react-router-dom";
import { auth, firestore } from '../../firebase/firebase';
import Post from '../../component/post/post';
import sendNotification from '../../notification';

export default function User(){
  const { uid } = useParams();
  let navigate = useNavigate();
 
  const [userInfo, setUserInfo] = useState({
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

  const [viewUser, setViewUser] = useState({
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
  const [urlImg, setUrlImg] = useState('')
  const [uidUser, setUidUser] = useState('')
  const [follower, setFollower] = useState(0)
  const [following, setFollowing] = useState(0)
  const [isFollowing, setIsFollowing] = useState(0)

  const [postShow, setPostShow] = useState([])
  const [statusPage, setStatusPage] = useState(1)

  const follow = () => {
    setIsFollowing(true)
    const followUserRef = firestore.collection('users').doc(uidUser)
    const follow2UserRef = firestore.collection('users').doc(uid)
    followUserRef.collection('following').doc(uid)
    .set({
      uid : uid,
      date : new Date().valueOf()
    })
    .then( _ =>{
      follow2UserRef.collection('follower').doc(uidUser)
      .set({
        uid : uidUser,
        date : new Date().valueOf()
      })
    })
    sendNotification(uid,`${viewUser.username} is follow you!`,new Date().valueOf(),viewUser.photoURL,`/u/${viewUser.uid}`)
  }

  const unFollow = () => {
    setIsFollowing(false)
    const followUserRef = firestore.collection('users').doc(uidUser)
    const follow2UserRef = firestore.collection('users').doc(uid)
    followUserRef.collection('following').doc(uid).delete()
    .then(() => {
      follow2UserRef.collection('follower').doc(uidUser).delete()
    })
  }

  const showImg = (url) => {
    setPreviewImg(true);
    setUrlImg(url);
  }

  useEffect(() => {
      auth.onAuthStateChanged(user => {
          setUidUser(user.uid)
          if(user.uid == uid){
            navigate('/profile')
          } else {
            firestore.collection('users').doc(uid).onSnapshot(doc => {
                if(doc.exists){
                    setUserInfo(doc.data())
                }else {
                    navigate('/')
                }
            })    
            firestore.collection('users').doc(user.uid)
            .get().then(doc => {
              setViewUser(doc.data())
            })
          }
          firestore.collection('users').doc(uid)
          .collection('follower').doc(user.uid)
          .onSnapshot(doc => {
            if(doc.exists) {
              setIsFollowing(false)
            } else {
              setIsFollowing(true)
            }
          })
      })
      firestore.collection('users').doc(uid)
      .collection('follower').onSnapshot(docs => {
        setFollower(docs.size)
      })
      firestore.collection('users').doc(uid)
      .collection('following').onSnapshot(docs => {
        setFollowing(docs.size)
      })
      getPost()
  }, [])

  const getPost = () => {
    setStatusPage(1)
    setPostShow([])
    const tweetRef = firestore.collection('users').doc(uid)
                              .collection('retweet')
    tweetRef.get()
    .then(docs => {
      var tempPostId = []
      docs.forEach(doc => {
        tempPostId = [...tempPostId , doc.data().postId]
      })
      if(tempPostId.length > 0){
        // splice(0, 10)
        tempPostId = tempPostId.splice(0, 10)
        // !!!!!!!! ########
        const retweet = firestore.collection('posts').where('postId' , 'in' , tempPostId)
        retweet.get()
        .then( docs => {
          var temp = []
          docs.forEach(doc => {
            temp = [...temp , doc.data()]
          })
          temp.sort((a,b) => b.time - a.time)
          setPostShow(temp)
        })
      }
    })
  }

  const getPostReply = () => {
    setPostShow([])
    setStatusPage(2)
    const postRef = firestore.collection('posts')
    .where('uid','==',uid)
    postRef.get().then( docs => {
      var temp = []
      docs.forEach( doc => {
        temp = [...temp, doc.data()]
      })
      temp.sort((a,b) => b.time - a.time)
      setPostShow(temp)
    })
  }

  const getMedia = () => {
    setPostShow([])
    setStatusPage(3)
    const postRef = firestore.collection('posts')
    .where('uid','==',uid)
    .where('img','!=',false)
    postRef.get().then( docs => {
      var temp = []
      docs.forEach( doc => {
        temp = [...temp, doc.data()]
      })
      temp.sort((a,b) => b.time - a.time)
      setPostShow(temp)
    })
  }

  const getLike = () => {
    setStatusPage(4)
    setPostShow([])
    const tweetRef = firestore.collection('users').doc(uid)
                              .collection('like')
    tweetRef.get()
    .then(docs => {
      var tempPostId = []
      docs.forEach(doc => {
        tempPostId = [...tempPostId , doc.data().postId]
      })
      if(tempPostId.length > 0){
        tempPostId = tempPostId.splice(0, 10)
        // !!!!!!!! ########
        const retweet = firestore.collection('posts').where('postId' , 'in' , tempPostId)
        retweet.get()
        .then( docs => {
          var temp = []
          docs.forEach(doc => {
            temp = [...temp , doc.data()]
          })
          temp.sort((a,b) => b.time - a.time)
          setPostShow(temp)
        })
      }
    })
  }

  return (
    <>
      {
        previewImg && <Image url={urlImg} close={() => setPreviewImg(false)} />
      }
      <div className={style.container}>
        <Navbar />
        <div className="content">
          <div className={style.profileContainer}>
            <div className={style.topNav}>
              <FontAwesomeIcon icon={faArrowLeft} 
                               onClick={() => navigate(`/`)}/>
              <div className={style.textTopNav} >
                {userInfo.username}
              </div>
            </div>
            <div style={{marginTop:59}}></div>
            <div className={style.coverImg} 
                  style={{backgroundImage: `url('${userInfo.coverPhotoURL}')`}}
                  onClick={() => showImg(userInfo.coverPhotoURL)}>
            </div>
            <div className={style.imgContainer}>
              <div className={style.profileImg}
                 style={{backgroundImage: `url('${userInfo.photoURL}')`}}
                 onClick={() => showImg(userInfo.photoURL)}></div>

              {
                isFollowing ? (
                   <span className={style.btnEdit}
                         onClick={follow}>
                     follow
                   </span>
                ) : (
                  <span className={style.btnEdit3}
                         onClick={unFollow}>
                     unfollow
                  </span>
                )
              }
            
              
              <span className={style.btnEdit2}
                    onClick={() => navigate(`/m/${uid}`)}>
                message
              </span>
            </div>
            <div className={style.profileInformation}>
              <div className={style.username}>{userInfo.username}</div>
              <div className={style.email}>{userInfo.email}</div>
              <div className={style.title}>{userInfo.title}</div>
              <div className={style.follower}>
                <div className={style.numberFollower}
                onClick={() => navigate(`/follower/${uid}`)}>
                {follower} <span className={style.boldText}>follower</span>
                </div>
                <div className={style.numberFollower}
                onClick={() => navigate(`/following/${uid}`)}>
                {following} <span className={style.boldText}>following</span>
                </div>
              </div>
            </div>
            <div className={style.navProfile}>
              <div className={statusPage == 1 ? style.navProfileLinkActive : style.navProfileLink}
                   onClick={getPost}>Tweets</div>
              <div className={statusPage == 2 ? style.navProfileLinkActive : style.navProfileLink}
                   onClick={getPostReply}>Tweets and reply</div>
              <div className={statusPage == 3 ? style.navProfileLinkActive : style.navProfileLink}
                   onClick={getMedia}>Media</div>
              <div className={statusPage == 4 ? style.navProfileLinkActive : style.navProfileLink}
                   onClick={getLike}>Likes</div>
            </div>

            {
              postShow.map((item,index) => {
                return (
                  <Post key={index} item={item}/>
                )
              })
            }

          </div>
          <Search/>
        </div>
      </div>
    </>
  );
}