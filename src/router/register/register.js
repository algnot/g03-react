import React , {useState,useEffect} from 'react'
import style from './register.module.css'
import { Link } from "react-router-dom";
import { auth , firestore } from './../../firebase/firebase'
import { useNavigate } from "react-router-dom";
import Aleart from '../../component/aleart/aleart';

export default function Register() {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [displayAlert, setDisplayAlert] = useState(false)
    const [textAlert, setTextAlert] = useState('')

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                navigate(`/`);
            }
        })    
    }, [])

    const Register = () => {
        if(!username) {
            setDisplayAlert(true);
            setTextAlert("Please enter your username!");
            return;
        }

        if(!email) {
            setDisplayAlert(true);
            setTextAlert("Please enter your email!");
            return;
        }

        if(!password) {
            setDisplayAlert(true);
            setTextAlert("Please enter your password!");
            return;
        }

        if(password != confirmPassword) {
            setDisplayAlert(true);
            setTextAlert("Please enter your password!");
            return;
        }

        if(password.length < 8) {
            setDisplayAlert(true);
            setTextAlert("Password must contain at least 8 characters!");
            return;
        }

        auth.createUserWithEmailAndPassword(email,password)
        .then( result => {
            const userRef = firestore.collection('users').doc(result.user.uid)
            userRef.onSnapshot( doc => {
                if(!doc.data()) {
                    userRef.set({
                        uid : result.user.uid,
                        username : username,
                        email : result.user.email,
                        photoURL : '',
                        created : new Date().valueOf(),
                        role : 'user'
                    })
                }
            })
        })
        .catch( error => {
            if(error.code == "auth/email-already-in-use"){
                setDisplayAlert(true);
                setTextAlert("Email already used");
            }
        })
    }

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
                    <div className={style.formHead}>Create your account</div>
                    <div className={style.textInput}>Username</div>
                    <input value={username} 
                           type="text"
                           onChange={(e) => setUsername(e.target.value)} />
                    <div className={style.textInput}>Email</div>
                    <input value={email} 
                           type="text"
                           onChange={(e) => setEmail(e.target.value)} />
                    <div className={style.textInput}>Password</div>
                    <input value={password} 
                           type="password"
                           onChange={(e) => setPassword(e.target.value)} />
                    <div className={style.textInput}>Confirm password</div>
                    <input value={confirmPassword} 
                           type="password"
                           onChange={(e) => setConfirmPassword(e.target.value)} />
                    <div className={style.btnAvtive}
                         onClick={Register}>Register</div>
                    <div className={style.textLink}>Have you G03-Project? <Link to="/login"> Login now.</Link></div>
                </div>
            </div>
        </div>
        </>
    )
}
