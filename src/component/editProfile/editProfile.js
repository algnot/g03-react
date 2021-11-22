import React , {useEffect,useState,useRef} from 'react'
import style from './editProfile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes,faCamera } from '@fortawesome/free-solid-svg-icons'
import { firestore, storage } from '../../firebase/firebase'

export default function EditProfile({uid , close}) {

    const [userInfo, setUserInfo] = useState({
        uid : 'test',
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

    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [errorUername, setErrorUername] = useState('')
    const [percentChange, setPercentChange] = useState(0)
    const inputRefMain = useRef()
    const inputRefCover = useRef()
    
    const saveToDb = async () => {
        if(!username){
            setErrorUername("(Username can't empty!)")
            return
        }
        console.log(username);
        console.log(bio);
        setInterval(() => {
            setPercentChange(percentChange => percentChange < 90 ? percentChange + 10 : 0)
        },10)
        await firestore.collection('users').doc(uid)
        .update({
            username : username,
            title : bio ? bio : '' 
        })
        .then( _ => {
            setPercentChange(100)
            close()
        })
    }

    const uploadMainImg = (image)=>{
        const uploadTask = storage.ref(`/u/${userInfo.email}/main/${image.name}`)
        uploadTask.put(image).on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setPercentChange(progress)
            }, 
            (error) => {}, 
            () => {
                storage.ref(`/u/${userInfo.email}/main/${image.name}`).getDownloadURL()
                .then((url) => {
                    firestore.collection('users').doc(uid)
                    .update({
                        photoURL : url
                    })
                })
            }
        );
    }

    const uploadCoverImg = (image)=>{
        const uploadTask = storage.ref(`/u/${userInfo.email}/cover/${image.name}`)
        uploadTask.put(image).on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setPercentChange(progress)
            }, 
            (error) => {}, 
            () => {
                storage.ref(`/u/${userInfo.email}/cover/${image.name}`).getDownloadURL()
                .then((url) => {
                    firestore.collection('users').doc(uid)
                    .update({
                        coverPhotoURL : url
                    })
                })
            }
        );
    }

    useEffect(() => {
        firestore.collection('users').doc(uid)
        .onSnapshot( doc => {
            if(doc.data()){
                setUserInfo(doc.data())
                setUsername(doc.data().username)
                setBio(doc.data().title)
            }
        })
    }, [])

    return (
        <>
        <div className={style.container}>
            <div className={style.editBox}>
                <div className={style.navEditBox}>
                    <div className={style.navEditBoxLeft}>
                        <FontAwesomeIcon icon={faTimes} onClick={close} />
                        Edit your profile
                    </div>
                    <div className={style.btnSave}
                         onClick={saveToDb}>
                        Save
                    </div>
                </div>
                <div className={style.loading} style={{width:`${percentChange}%`}} ></div>
                <div className={style.previewCover}
                     onClick={() => inputRefCover.current.click()}
                     style={{backgroundImage: `url('${userInfo.coverPhotoURL}')`}}>
                    <FontAwesomeIcon icon={faCamera} onClick={close} />
                </div>
                <div className={style.previewImg}
                     style={{backgroundImage: `url('${userInfo.photoURL}')`}}
                     onClick={() => inputRefMain.current.click()}>
                         <FontAwesomeIcon icon={faCamera} onClick={close} />
                </div>
                <div className={style.formEdit}>
                    <div className={style.textInput}>Username {errorUername}</div>
                    <input  value={username}
                            type="text" 
                            onChange={(e) => setUsername(e.target.value)}/>
                    <div className={style.textInput}>Bio</div>
                    <input  value={bio}
                            type="text"
                            onChange={(e) => setBio(e.target.value)}/>
                    <input accept="image/png, image/jpeg , image/gif"
                           ref={inputRefMain} 
                           style={{ display: "none" }}
                           onChange={(e)=>{uploadMainImg(e.target.files[0])}}
                           type="file" />
                    <input accept="image/png, image/jpeg , image/gif"
                           ref={inputRefCover} 
                           style={{ display: "none" }}
                           onChange={(e)=>{uploadCoverImg(e.target.files[0])}}
                           type="file" />
                </div>
            </div>
        </div>
        </>
    )
}
