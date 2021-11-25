import React , { useEffect,useState } from 'react'
import style from './navbar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome , faUser , faCommentAlt , faBell, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import ToggleSwitch from '../switch/switch';
import { auth, firestore } from '../../firebase/firebase';
import ConfirmAleart from '../confirmAlert/confirmAlert'
import { keepTheme } from "./../../theme/theme"
import { useNavigate } from "react-router-dom"
import Notification from '../notification/notification';
import Loading from './../loading/Loading'

export default function Navbar() {
    let navigate = useNavigate();

    const [username, setUsername] = useState(null)
    const [displayAlert, setDisplayAlert] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        keepTheme();
        auth.onAuthStateChanged(user => {
            if(!user){
                navigate(`/login`);
            } else {
                firestore.collection('users').doc(user.uid)
                .onSnapshot( doc => {
                    if(doc.data())
                        setUsername(doc.data().username.split(' ')[0] ? doc.data().username.split(' ')[0] : doc.data().username)
                    setTimeout(() => {
                       setLoading(false) 
                    }, 1000);
                })
            }
        })
    }, [])

    const logout = () => {
        auth.signOut()
        .then(() => {
            window.location.href = '/login'
        })
    }

    return (
        <>
        {
            loading &&
            <Loading />
        }
        <Notification />
        {
            displayAlert && 
            <ConfirmAleart Topic={username}
                           Message="Select your option"
                           Btn={
                               [
                                   {text : 'View your profile' , action : () => navigate(`/profile`) } ,
                                   {text : 'Logout' , action : logout }
                               ]
                            }
                           setDisplayAlert={setDisplayAlert}/>
        }
        <div className={style.container}>
            <div className={style.logo}>G03-Project</div>
            <div className={style.navbarContainer}>
                <div className={style.linkContainer}>
                    <Link to="/" className={style.navbarLink}>
                        <FontAwesomeIcon icon={faHome} />
                        <div className={style.textLink}>Home</div>
                    </Link>
                    <Link to="/search" className={style.navbarLink || style.navbarLink2}>
                        <FontAwesomeIcon icon={faSearch} />
                        <div className={style.textLink}>Search</div>
                    </Link>
                    <Link to="/notification" className={style.navbarLink}>
                        <FontAwesomeIcon icon={faBell} />
                        <div className={style.textLink}>Notifications</div>
                    </Link>
                    <div to="/profile" className={style.navbarLink}
                          onClick={() => setDisplayAlert(true)}>
                        <FontAwesomeIcon icon={faUser} />
                        <div className={style.textLink}>{username}</div>
                    </div>
                </div>
                <div className={style.switch}>
                    <ToggleSwitch />
                </div>
                </div>
            </div>
        </>
    )
}
