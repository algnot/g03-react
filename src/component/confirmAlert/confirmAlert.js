import React from 'react'
import style from './confirmAlert.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default function ConfirmAleart({Topic , Message , Btn , setDisplayAlert}) {

    return (
        <div className={style.container}>
            <div className={style.aleartBox}>
                <div className={style.topAlert}>
                    <div className={style.topLogo}>{Topic}</div>
                    <span className={style.closeBtn}
                          onClick={() => setDisplayAlert(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </div>
                <div className={style.message}>
                    {Message}
                </div>
                {
                    Btn.map((data,index) => {
                        return (
                            <div className={style.btn}
                                 key={index}
                                 onClick={data.action}>
                                    {data.text}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
