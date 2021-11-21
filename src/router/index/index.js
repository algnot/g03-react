import React , {useEffect} from 'react'
import style from './index.module.css'
import { auth } from '../../firebase/firebase'
import { useNavigate } from "react-router-dom";

export default function Index() {
    let navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged( user => {
            if(!user){
                navigate(`/login`);
            }
        })
    }, [])

    return (
        <div className={style.container}>
            bgdgdrg
        </div>
    )
}
