import react from 'react'
import style from "./post.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRetweet, faComment, faHeart } from "@fortawesome/free-solid-svg-icons";

export default function Post() {
    return (
      <div className={style.container}>
        <div className={style.toppost}>
          <div className={style.profileimg}>
            <Link to="/profile">
              <img
                src="https://i.pinimg.com/originals/8e/de/53/8ede538fcf75a0a1bd812810edb50cb7.jpg"
                className={style.imgp}
              />
            </Link>
            <Link to="/profile" className={style.username}>
              Gojo Satoru
            </Link>
            <div className={style.email}>@GojoSatoru@gmail.com</div>
            <div className={style.date}>● 22 Nov</div>
          </div>
        </div>
        <div className={style.postdesc}>
          <div className={style.desc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lacus
            massa, porttitor et dui et, convallis pharetra tellus. Proin
            interdum ante quis est vehicula ullamcorper. Pellentesque diam
            turpis, pretium id fringilla et, pretium vitae ex. Maecenas posuere,
            tortor vestibulum iaculis pellentesque, elit nibh lacinia felis,
            quis euismod elit tortor ut eros. Fusce convallis vestibulum lorem.
            Vestibulum ac suscipit leo. Fusce condimentum nulla mollis nisl
            efficitur pretium. Quisque sit amet tempor velit. Integer at erat
            metus. Mauris et ultrices libero. Nam ut consequat diam.
          </div>
          <div className={style.imgpost}>
              <img src="" />
          </div>
        </div>
        <div className={style.bottompost}>
          <div className={style.navPostLink}>
            <div className={style.navconc}>
              <FontAwesomeIcon icon={faComment} className={style.iconcomment} />
              <div className={style.amountc}>10</div>
            </div>  
          </div>
          <div className={style.navPostLink}>
              <div className={style.navconr}>
              <FontAwesomeIcon icon={faRetweet} className={style.iconretweet} />
              <div className={style.amountr}>10</div>
            </div>
          </div>
          <div className={style.navPostLink}>
              <div className={style.navconh}>
              <FontAwesomeIcon icon={faHeart} className={style.iconheart} />
              <div className={style.amounth}>10</div>
            </div>
          </div>
        </div>
      </div>
    );
}
