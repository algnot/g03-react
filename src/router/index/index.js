import React , {useEffect} from 'react'
import style from './index.module.css'
import { auth } from '../../firebase/firebase'
import Navbar from '../../component/navbar/navbar'

export default function Index() {
    return (
      <div className={style.container}>
        <Navbar />
        <div className="content">
            
        </div>
      </div>
    );
}
