import React , {useEffect,useState,useRef} from 'react'
import style from "./createpost.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages , faTimes } from "@fortawesome/free-solid-svg-icons";
import { auth, firestore ,storage } from '../../firebase/firebase';
import sendNotification from './../../notification'

export default function CreatePost({subpost}) {
  const inputRefMain = useRef()

  const [textPost, setTextPost] = useState('')
  const [percentChange, setPercentChange] = useState(0)
  const [urlImg, setUrlImg] = useState('')

  const [onUpload, setOnUpload] = useState(false)

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

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user){
        firestore.collection('users').doc(user.uid)
        .onSnapshot(doc => {
          if(doc.data())
            setUser(doc.data())
        })
      }
    })
  }, [])

  const onPost = () => {
    if(!textPost && !urlImg){
      return
    }
    setOnUpload(true)
    var random = Math.floor(Math.random() * 8999999999 + 1000000000);
    firestore.collection('posts').add({
      postId : random,
      subPostId : parseInt(subpost),
      uid : user.uid,
      text : textPost,
      img : urlImg ? urlImg : false,
      time : new Date().valueOf()
    })
    .then(() => {
      setOnUpload(false)
      removeImg()
      setTextPost('')
      if(parseInt(subpost)!=0){
        firestore.collection('posts').where('postId','==',parseInt(subpost))
        .get().then(docs => {
          docs.forEach(doc => {
            if(doc.data().uid != user.uid)
              sendNotification(doc.data().uid,`${user.username} reply to you!`,new Date().valueOf(),user.photoURL,`/post/${random}`)
          })
        })
      }
    })
    .catch(() => {
      setOnUpload(false)
    })
  }

  const setImgPost = (image) => {
    setPercentChange(10)
    var random = Math.floor(Math.random()*9999999999);
    const uploadTask = storage.ref(`/post/image/${random}`)
    uploadTask.put(image).on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentChange(progress - 10)
        }, 
        (error) => {}, 
        () => {
            storage.ref(`/post/image/${random}`).getDownloadURL()
            .then((url) => {
              setPercentChange(100)
              setUrlImg(url)
            })
        }
    )
  }

  const removeImg = () => {
    setUrlImg('')
    setPercentChange(0)
  }

  return (
    <div className={style.container} style={{opacity:onUpload ? 0.5 : 1}}>
      <div className={style.imgContainer}>
        <div className={style.imgProfile}
             style={{backgroundImage:`url(${user.photoURL})`}}></div>
      </div>
      <div className={style.from}>
        <textarea rows="2" placeholder={`What's on your mind, ${user.username}?`}  
                  value={textPost}
                  onChange={(e) => setTextPost(e.target.value)}/>
        <div className={style.progressBar} 
             style={{width:`${percentChange}%`}}></div>
        {
          urlImg && (
            <div className={style.previewImgContainer}>
            <div className={style.previewImg}
                 style={{backgroundImage: `url(${urlImg})`}}>
              <div className={style.close}
                   onClick={removeImg}>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
            </div>
          )
        }
        <div className={style.btnContainer}>
            <div className={style.icons}>
              <FontAwesomeIcon icon={faImages} 
                               onClick={() => inputRefMain.current.click()}/>
            </div>
            <div className={style.btn}
                 onClick={onPost}>Tweet</div>
        </div>
        <input accept="image/png, image/jpeg , image/gif"
               ref={inputRefMain} 
               style={{ display: "none" }}
               onChange={(e)=>{setImgPost(e.target.files[0])}}
               type="file" />
      </div>
    </div>
  );
}