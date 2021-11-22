import React , { useEffect,useState } from 'react'
import style from './navbar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome , faUser , faCommentAlt , faBell } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import ToggleSwitch from '../switch/switch';
import { auth, firestore } from '../../firebase/firebase';
import ConfirmAleart from '../confirmAlert/confirmAlert'
import { keepTheme } from "./../../theme/theme"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
    let navigate = useNavigate();

    const [username, setUsername] = useState(null)
    const [displayAlert, setDisplayAlert] = useState(false)

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
                })
            }
        })
    }, [])

    const logout = () => {
        auth.signOut()
    }

    return (
        <>
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
                    <Link to="/message" className={style.navbarLink}>
                        <FontAwesomeIcon icon={faCommentAlt} />
                        <div className={style.textLink}>Message</div>
                    </Link>
                    <Link to="/notification" className={style.navbarLink}>
                        <FontAwesomeIcon icon={faBell} />
                        <div className={style.textLink}>Notification</div>
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
