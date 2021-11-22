import React , {useEffect,useState} from 'react';
import style from './../profile/Profile.module.css';
import Navbar from "../../component/navbar/navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons'
import Image from '../../component/showImage/Image';
import { useNavigate } from "react-router-dom"
import Search from '../../component/search/search';
import Post from '../../component/post/post';
import { useParams } from "react-router-dom";
import { auth, firestore } from '../../firebase/firebase';

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

  const [previewImg, setPreviewImg] = useState(false)
  const [urlImg, setUrlImg] = useState('')
  const [uidUser, setUidUser] = useState('')
  const [follower, setFollower] = useState(0)
  const [following, setFollowing] = useState(0)
  const [isFollowing, setIsFollowing] = useState(0)

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
  }, [])

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
              <div className={style.navProfileLinkActive}>Post</div>
              <div className={style.navProfileLink}>Post & Replies</div>
              <div className={style.navProfileLink}>Media</div>
              <div className={style.navProfileLink}>Likes</div>
            </div>
            <Post />
          </div>
          <Search/>
        </div>
      </div>
    </>
  );
}