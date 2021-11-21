import React , {useState} from 'react'
import style from './register.module.css'
import { Link } from "react-router-dom";

export default function Register() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div className={style.container}>
            <div className={style.leftComponent}
                 style={{backgroundImage : `url("https://images.unsplash.com/photo-1637434659088-cec7b7ea8646?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`}}>
            </div>
            <div className={style.rightComponent}>
                {/* <div className={style.navLogin}>
                    <div className={style.logoLogin}>
                        G03-Project
                    </div> 
                    <div className={style.headNav}>
                        Register
                    </div> 
                </div> */}
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
                    <div className={style.btnAvtive}>Register</div>
                    <div className={style.textLink}>Have you G03-Project? <Link to="/g03-react/login"> Login now.</Link></div>
                </div>
            </div>
        </div>
    )
}
