import { fabric } from "fabric";
import { FC, useState, useEffect } from "react";
import { RouteComponentProps, withRouter, useHistory } from "react-router-dom";
import { io } from "socket.io-client";

const GameRoomContent: FC<{socket: any} & RouteComponentProps> = ({socket, match: {params}}) => {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [canvasWidth, setCanvasWidth] = useState(700);
  const [canvasHeight, setCanvasHeight] = useState(300);
  const [leftBar, setLeftBar] = useState<fabric.Rect>();
  const [rightBar, setRightBar] = useState<fabric.Rect>(); 
  const [ball, setBall] = useState<fabric.Circle>();
  const [ballX, setBallX] = useState(350);
  const [ballY, setBallY] = useState(150);
  const [leftY, setLeftY] = useState(150);
  const [rightY, setRightY] = useState(150);
  const [downKey, setDownKey] = useState(0);
  const [upKey, setUpKey] = useState(0);
  
  /*!
   * @brief canvas와 양쪽 사이드바, 공 초기 설정
   */
  const initCanvas = () => {
    return new fabric.Canvas('myCanvas', {width: canvasWidth, height: canvasHeight, backgroundColor: 'gray'});
  };
  
  const initBar = (x, y, width, height) => {
    width = width - x;
    height = height - y;
    return new fabric.Rect({
      left: x,
      top: y,
      fill: 'black',
      width: width,
      height: height,
    });
  }
  
  const initBall = (x, y) => {
    return new fabric.Circle({
      left: x,
      top: y,
      fill: 'black',
      radius: 5,
    })
  }
  
  /*!
   * @brief 키보드 이벤트
   *        키의 눌림 상태를 변경한다.
   *        여기서 서버로 상태를 전송
   */
  
  const keyDownEvent = (e: KeyboardEvent) => {
    if (e.code === "ArrowDown" && downKey == 0) {
      socket.emit("keyEvent", {arrowUp: upKey, arrowDown: true});
      setDownKey((downKey) => {return 1});
    }
    else if (e.code === "ArrowUp" && upKey == 0) {
      socket.emit("keyEvent", {arrowUp: true, arrowDown: downKey});
      setUpKey(() => {return 1});
    }
  };
  
  const keyUpEvent = (e: KeyboardEvent) => {
    if (e.code === "ArrowDown") {
      socket.emit("keyEvent", {arrowUp: upKey, arrowDown: false});
      setDownKey(() => {return 0});
    }
    else if (e.code === "ArrowUp") {
      socket.emit("ketEvent", {arrowUp: false, arrowDown: downKey});
      setUpKey(() => {return 0});
    }
  };
  
  /*!
   * @brief 화살표 키가 눌리거나 떼지는 경우에 서버로 메세지를 보내는 건 여기서 처리
   */
  // useEffect(() => {
  //   if (downKey) {
  //     setLeftY((leftY) => {return leftY + 5});
  //   }
  //   else if (upKey) {
  //     setLeftY((leftY) => {return leftY - 5});
  //   }
  //   // 서버로 내 state 보내기
  // }, [downKey, upKey])
  
  /*!
   * @brief 캔버스 초기화
   *        맨 처음 배경과 양쪽 바, 공을 그려준다
   */
  useEffect(() => {
    socket.on("init", (data) => {
      setCanvas(initCanvas());
      setLeftBar(initBar(data.bar00[0], data.bar00[1], data.bar00[2], data.bar00[3]));
      setRightBar(initBar(data.bar01[0], data.bar01[1], data.bar01[2], data.bar01[3]));
      setBall(initBall(data.ball[0], data.ball[1]));
    })

    socket.on("update", (data) => {
      console.log("updated data", data);
      setLeftY(data.bar00[1]);
      setRightY(data.bar01[1]);
      setBallX(data.ball[0]);
      setBallY(data.ball[1]);
    })

    if (canvas) {
      canvas.add(leftBar);
      canvas.add(rightBar);
      canvas.add(ball);
    }

    addEventListener("keydown", keyDownEvent);
    addEventListener("keyup", keyUpEvent)

    return (() => {
      socket.disconnect();
      removeEventListener("keydown", keyDownEvent);
      removeEventListener("keydown", keyUpEvent);
    })
  }, []);
  
  /*!
   * @brief 왼쪽 막대가 움직이는 경우 처리
   */
  useEffect(() => {
    if (canvas) {
     
      leftBar.set({top: leftY});
      canvas.add(leftBar);
      canvas.add(rightBar);
      canvas.add(ball);
      canvas.renderAll();
    }
  }, [leftY]);
  
  /*!
   * @brief 오른 막대가 움직이는 경우 처리
   */
  useEffect(() => {
    if (canvas) {

      rightBar.set({top: rightY});
      canvas.add(leftBar);
      canvas.add(rightBar);
      canvas.add(ball);
      canvas.renderAll();
    }
  }, [rightY]);

  return (
    <canvas id="myCanvas"></canvas>
  );
};

export default withRouter(GameRoomContent);