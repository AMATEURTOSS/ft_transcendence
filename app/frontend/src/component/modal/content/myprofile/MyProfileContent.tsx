import { useEffect, useState } from "react";
import { withRouter, RouteComponentProps, Link, Route } from "react-router-dom";
import "/src/scss/content/myprofile/MyProfileContent.scss";
import Modal from "../../Modal";
import ManageFriendContent from "./ManageFriendContent";
import RecordContent from "../RecordContent";
import EasyFetch from "../../../../utils/EasyFetch";

/*!
* @author donglee
* @brief MyProfile 컴포넌트
* @detail 사용자 정보를 API에서 받아와서 화면에 렌더링함
*         닉네임 변경시에 컴포넌트를 다시 렌더링함
*/

interface UserInfo {
  user_id: string;
  nick: string;
  avatar_url: string;
  total_games: number;
  win_games: number;
  loss_games: number;
  ladder_level: number;
  status: string;
}

const MyProfileContent: React.FC<RouteComponentProps> = (props) => {

  const [userInfo, setUserInfo] = useState<UserInfo>();;
  const [userNick, setuserNick] = useState("");

  /*!
  * @author donglee
  * @brief API /user 에서 프로필 정보를 요청해서 state에 저장함
  */
  const getUserInfo = async () => {
    //일단 test로 donglee 정보를 가져온다
    const easyfetch = new EasyFetch(`http://127.0.0.1:3001/users?nick=donglee`);
    const res = await (await easyfetch.fetch()).json();
    
    setUserInfo(res);
  };

  useEffect(() => {
    getUserInfo();
  }, [userNick]); //userNickName은 바뀌면 바로 다시 렌더링 해야 한다.
  /* 같은 이유로 MainPage에 avatarUrl과 nickName 도 state로 있어야 할 것 같다 */

  if (userInfo) {
    return (    
      <div id="profile">
        <div id="upper-part">
          <div id="button-container">
            <Link to={`${props.match.url}/record`}>
              <button id="stat-detail">
                상세전적보기
              </button>
            </Link>
            <button id="second-auth">2단계 인증</button>
            <Link to={`${props.match.url}/manageFriend`}>
              <button id="manage-friend">친구 관리</button>
            </Link>
          </div>
          <div id="avatar-container">
            <img src={userInfo.avatar_url} alt="프로필사진" />
          </div>
          <div id="user-info">
            <div id="user-id">
              {`${userInfo.nick} `}
              <img src="/public/pencil.png" alt="편집" />
            </div>
            <div id="user-stat">
              <span id="win">{userInfo.win_games} 승</span>
              <span className="delimiter">|</span>
              <span id="lose">{userInfo.loss_games} 패</span>
              <span className="delimiter">|</span>
              <span id="score">{userInfo.ladder_level} 점</span>
            </div>
            <div id="user-title">{userInfo.win_games >= 10 && "majesty"}</div>
          </div>
        </div>
        <div id="lower-part">
          <div id="blank"></div>
          <div id="delete-user">
            <div id="delete-icon">
              <img src="/public/delete.png" alt="회원탈퇴" />
            </div>
            <span>클릭하면 회원님의 모든 데이터가 서버에서 삭제됩니다</span>
          </div>
        </div>
        <Route path={`${props.match.path}/record`}><Modal id={Date.now()} content={<RecordContent/>} /></Route>
        <Route path={`${props.match.path}/manageFriend`}><Modal id={Date.now()} smallModal content={<ManageFriendContent nick={userInfo.nick}/>} /></Route>
      </div>
    );
  } else {
    return ( <h1>Loading..</h1> );
  }
};

export default withRouter(MyProfileContent);
