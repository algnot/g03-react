import React , {useEffect,useState} from 'react';
import style from './Profile.module.css';
import Navbar from "../../component/navbar/navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons'
import { auth, firestore } from '../../firebase/firebase';
import Image from '../../component/showImage/Image';
import EditProfile from '../../component/editProfile/editProfile';
import { useNavigate } from "react-router-dom"
import Search from '../../component/search/search';

export default function Profile(){
  let navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
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
  const [follower, setFollower] = useState(0)
  const [following, setFollowing] = useState(0)

  const [previewImg, setPreviewImg] = useState(false)
  const [editProfile, seteditProfile] = useState(false)
  const [urlImg, setUrlImg] = useState('')

  const showImg = (url) => {
    setPreviewImg(true);
    setUrlImg(url);
  }

  useEffect(() => {
    auth.onAuthStateChanged( user => {
      if(user){
        firestore.collection('users').doc(user.uid).onSnapshot(doc => {
          if(doc.data()){
            setUserInfo(doc.data())
          }
        })
        firestore.collection('users').doc(user.uid)
        .collection('follower').onSnapshot(docs => {
          setFollower(docs.size)
        })
        firestore.collection('users').doc(user.uid)
        .collection('following').onSnapshot(docs => {
          setFollowing(docs.size)
        })
      }
    })
  }, [])

  return (
    <>
      {
        previewImg && <Image url={urlImg} close={() => setPreviewImg(false)} />
      }
      {
        editProfile && <EditProfile uid={userInfo.uid} close={() => seteditProfile(false)}  />
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
              <span className={style.btnEdit}
                    onClick={() => seteditProfile(true)}>
                edit your profile
              </span>
            </div>
            <div className={style.profileInformation}>
              <div className={style.username}>{userInfo.username}</div>
              <div className={style.email}>{userInfo.email}</div>
              <div className={style.title}>{userInfo.title}</div>
              <div className={style.follower}>
                <div className={style.numberFollower} 
                onClick={() => navigate(`/follower/${userInfo.uid}`)}>
                {follower} <span className={style.boldText}>follower</span>
                </div>
                <div className={style.numberFollower} 
                onClick={() => navigate(`/following/${userInfo.uid}`)}>
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

          </div>
          <Search/>
        </div>
      </div>
    </>
  );
}