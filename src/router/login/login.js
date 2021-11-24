import React , { useState , useEffect } from 'react'
import style from './../register/register.module.css'
import styleLogin from './login.module.css'
import { auth , googleProvider , firestore } from './../../firebase/firebase'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Aleart from '../../component/aleart/aleart';
import { keepTheme } from "./../../theme/theme"

export default function Login() {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayAlert, setDisplayAlert] = useState(false)
    const [textAlert, setTextAlert] = useState('')

    const googleLogin = async () => {
        keepTheme();
        await auth.signInWithPopup(googleProvider)
        .then( result => {
            const userRef = firestore.collection('users').doc(result.user.uid)
            userRef.onSnapshot( doc => {
                if(!doc.data()) {
                    userRef.set({
                        uid : result.user.uid,
                        username : result.user.displayName,
                        email : result.user.email,
                        photoURL : result.user.photoURL ? result.user.photoURL : 'https://firebasestorage.googleapis.com/v0/b/g03-project.appspot.com/o/u%2Fbasic_img%2Fmain%2Fimages.jpg?alt=media&token=d3f747ad-71ab-4014-b67d-7c235fc980d4',
                        coverPhotoURL : 'https://firebasestorage.googleapis.com/v0/b/g03-project.appspot.com/o/u%2Fbasic_img%2Fcover%2Fpile-of-abstract-facebook-cover.png?alt=media&token=aa0a7350-f2b2-400d-a027-477cb2c09812',
                        created : new Date().valueOf(),
                        role : 'user',
                        follower : [],
                        following : [],
                        title : ''
                    })
                }
            })
        })
        .catch( _ => console.log(''))
    }

    const login = async () => {
      if (!email) {
        setDisplayAlert(true);
        setTextAlert("Please enter your email!");
        return;
      }

      if (!password) {
        setDisplayAlert(true);
        setTextAlert("Please enter your password!");
        return;
      }

      auth
        .signInWithEmailAndPassword(email, password)
        .then((result) => console.log(result))
        .catch( error => {
            console.log(error.code);
            if(error.code == "auth/email-already-in-use"){
                setDisplayAlert(true);
                setTextAlert("Email already used");
            }
            if(error.code == "auth/wrong-password"){
                setDisplayAlert(true);
                setTextAlert("Wrong password");
            }
            if(error.code == "auth/invalid-email"){
                setDisplayAlert(true);
                setTextAlert("Wrong email");
            }
            if (error.code == "auth/user-not-found") {
              setDisplayAlert(true);
              setTextAlert("User not found");
            }
        })
    };

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          navigate(`/`);
        }
      });
    }, []);

    return (
        <>
        {
            displayAlert && 
            <Aleart Topic="Alert"
                    Message={textAlert}
                    setDisplayAlert={setDisplayAlert}/>
        }
        <div className={style.container}>
            <div className={style.leftComponent}
                 style={{backgroundImage : `url("https://images.unsplash.com/photo-1637434659088-cec7b7ea8646?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`}}>
            </div>
            <div className={style.rightComponent}>
                <div className={style.formLogin}>
                    <div className={style.formHead}>Login</div>
                    <div className={style.textInput}>Email</div>
                    <input value={email} 
                           type="text"
                           className={styleLogin.input}
                           onChange={(e) => setEmail(e.target.value)} />
                    <div className={style.textInput}>Password</div>
                    <input value={password} 
                           type="password"
                           className={styleLogin.input}
                           onChange={(e) => setPassword(e.target.value)} />
                    <div className={style.btnAvtive}
                         onClick={login}>Login</div>
                    <div className={styleLogin.btnLogin} onClick={googleLogin}>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="LgbsSe-Bz112c"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
                        Login with google
                    </div>
                    <div className={style.textLink}>New to G03-Project? <Link to="/register"> Register now.</Link></div>
                </div>
            </div>
        </div>
        </>
    )
}
      
