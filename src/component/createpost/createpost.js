import react from 'react'
import style from "./createpost.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faSmile } from "@fortawesome/free-solid-svg-icons";

export default function CreatePost() {
    return (
      <div className={style.container}>
        <div className={style.leftcpost}>
          <div className={style.profileimg}>
            <Link to="/profile">
              <img
                src="https://i.pinimg.com/originals/8e/de/53/8ede538fcf75a0a1bd812810edb50cb7.jpg"
                className={style.imgp}
              />
            </Link>
          </div>
        </div>
        <div className={style.rightcpost}>
          <textarea className={style.text} rows="5" cols="80"></textarea>
          <div className={style.add}>
            <div className={style.addl}>
              <FontAwesomeIcon icon={faImages} className={style.icon1} />
              <FontAwesomeIcon icon={faSmile} className={style.icon2} />
            </div>
            <div className={style.btn}>
              <button className={style.btnt}>Tweet</button>
            </div>
          </div>
        </div>
      </div>
    );
}