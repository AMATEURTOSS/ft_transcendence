import { useState, useEffect } from "react";
import { Modal } from '../modal/Modal'
import NavBar from './navbar/NavBar'
import '/src/scss/MainPage.scss'
import { testFriendList } from './dummyData'

const MainPage = (): JSX.Element => {

  const [isRecordOpen, setIsRecordOpen] = useState(false); // 전적 모달을 위한 State
  const [isChatOpen, setIsChatOpen] = useState(false); // 채팅 모달을 위한 State
  const [isGameOpen, setIsGameOpen] = useState(false); // 게임, 매치메이킹 모달을 위한 State

  useEffect(() => {

    const postAuthCodeToBackend = async () => {
      let searchParams: URLSearchParams = new URLSearchParams(window.location.search);
      const fetchHeader = new Headers();
      fetchHeader.append('Content-Type', 'application/json');
      fetchHeader.append('Accept', 'application/json');
      const fetchOption: any = {
        method: 'POST',
        headers: fetchHeader,
        origin: "http://127.0.0.1:3000",
        credentials: 'include',
        body: JSON.stringify({ code: searchParams.get('code') })
      }
      await fetch('http://127.0.0.1:3001/api/oauth', fetchOption)
    }

    try {
      postAuthCodeToBackend();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <NavBar
        avartarImgUrl="https://static.coindesk.com/wp-content/uploads/2021/04/dogecoin.jpg"
        friends={testFriendList} />
      <button id="record" onClick={() => setIsRecordOpen(true)}>
        <img src="https://img.icons8.com/ios/50/000000/-scoreboard-.png"/>
      </button>
      <button id="chat" onClick={() => setIsChatOpen(true)}>
        <img src="https://img.icons8.com/ios/50/000000/chat--v1.png"/>
      </button>
      <button id="game" onClick={() => setIsGameOpen(true)}>
        <img src="https://img.icons8.com/ios/50/000000/head-to-head.png"/>
      </button>
      <Modal content={() => <h1>Record</h1>} display={isRecordOpen} handleClose={() => setIsRecordOpen(false)}/>
      <Modal content={() => <h1>Chat</h1>} display={isChatOpen} handleClose={() => setIsChatOpen(false)}/>
      <Modal content={() => <h1>Game</h1>} display={isGameOpen} handleClose={() => setIsGameOpen(false)}/>
    </>
  );
}

export default MainPage;