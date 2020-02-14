import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [speed_xy, setSpeedXY] = useState([0, -1, 0]);
  const [speed, setSpeed] = useState(5);
  const [length, setLength] = useState(10);

  const [my_worm_plot, setMyWormPlot] = useState(
    Array(1).fill("").map((x, i) => [0, 0, 0, 0, 0])
  );

  const [food, setFood] = useState(
    Array(100).fill("").map(() => [
      (Math.floor(Math.random() * 2300)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
      (Math.floor(Math.random() * 2300)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
      Math.floor(Math.random() * 10)
    ])
  );

  const [style, setStyle] = useState({
    main: {
      width: `100vw`,
      height: `100vh`,
    },
    app: {
      userSelect: "none",
      pointerEvents: "none",
      position: "relative",
      backgroundColor: "#432C34",
      overflow: "hidden",
      width: `100%`,
      height: `100%`,
      // transition: "zoom 0.2s",
      backgroundImage: "url('/images/bg.jpg')",
      backgroundSize: "80%",
      // backgroundImage: "repeating-linear-gradient(#e66465, #e66465 1px, transparent 1px, transparent 500px)",
    },
    worm: {
      head: {},
      body: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        backgroundColor: "#0ee",
        // backgroundPosition: "center",
        // backgroundSize: "cover",
        backgroundImage: "radial-gradient(circle at 40% 50%, transparent, transparent 60%, rgba(0,0,0,0.6) 100%), radial-gradient(circle at 60% 50%, transparent, transparent 60%, rgba(0,0,0,0.6) 100%)"
      },
    },
    table: {},
    td: {
      cursor: "pointer",
      width: "50px",
      height: "50px",
      textAlign: "center",
      color: "#000",
      fontSize: "30px",
      transition: "0.2s",
    },
    face: {
      position: "absolute",
      top: "50%",
      left: "50%",
      zoom: "0.7",
    },
    food: {
      position: "absolute",
      width: "40px",
      height: "40px",
    },
    border: {
      position: "absolute",
      width: "5000px",
      height: "5000px",
      transform: "translate(-50%, -50%)",
      borderRadius: "30px",
      border: "solid 15px rgba(255,0,0,0.5)",
    },
    score: {
      position: "absolute",
      right: "0",
      top: "0",
      padding: "calc(10px + 0.5vw)",
      width: "calc(10px + 7vw)",
      color: "#0ee",
      fontSize: "calc(10px + 1vw)",
      backgroundColor: "rgba(0,0,0,0.7)",
    }
  });

  useEffect(() => {
    setInterval(() => {
      setLength(length => {
        setSpeedXY(speed_xy => {
          setMyWormPlot(my_worm_plot => {
            let new_plot_x = my_worm_plot[0][0] + speed_xy[0] * speed
            let new_plot_y = my_worm_plot[0][1] + speed_xy[1] * speed
            if (new_plot_x > 2500 || new_plot_x < -2500 || new_plot_y > 2500 || new_plot_y < -2500) {
              alert("you die!")
              setLength(10)
              setFood(
                Array(100).fill("").map(() => [
                  (Math.floor(Math.random() * 2000)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
                  (Math.floor(Math.random() * 2000)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
                  Math.floor(Math.random() * 10)
                ])
              )
              return Array(1).fill("").map((x, i) => [0, 0, 0, 0, 0])
            } else {
              setFood(food => {
                let food_count = food.length
                food = food.filter(f =>
                  !(
                    f[0] > new_plot_x - (50 + (length / 2)) &&
                    f[0] < new_plot_x + (50 + (length / 2)) &&
                    f[1] > new_plot_y - (50 + (length / 2)) &&
                    f[1] < new_plot_y + (50 + (length / 2))
                  )
                )
                if (food_count > food.length) {
                  setLength(length => length + (food_count - food.length) * 1)
                }
                return food
              })
              return [[
                new_plot_x, // X
                new_plot_y,  // Y
                speed_xy[0], // X direction
                speed_xy[1],  // Y direction
                speed_xy[2],
              ]].concat(my_worm_plot).splice(0, length)
            }
          })
          return speed_xy
        })
        return length
      })
    }, 10);
    document.addEventListener('mousemove', (e) => {
      setSpeedXY(speed_xy => {
        let x = e.clientX - (e.view.innerWidth / 2)
        let y = e.clientY - (e.view.innerHeight / 2)
        let speed_x = speed_xy[0]
        let speed_y = speed_xy[1]
        let new_angle = Math.atan2(x, y) * (180 / Math.PI)
        if (new_angle != speed_xy[2]) {
          speed_x = Math.sin((Math.PI / 180) * new_angle)
          speed_y = Math.cos((Math.PI / 180) * new_angle)
          speed_x = speed_x > 1 ? 0 : speed_x
          speed_y = speed_y > 1 ? 0 : speed_y
        }
        return [speed_x, speed_y, new_angle]
      })
    })
  }, [])

  return (
    <div style={style.main}>
      <div style={{
        ...style.app,
        // backgroundSize: `${100 - Math.floor((length / 5))}%`,
        // zoom: `${1 - (length / 1000)}`,
        backgroundPosition: `${my_worm_plot[0][0] * -1}px ${my_worm_plot[0][1] * -1}px`,
      }}>

        {/* BORDER */}
        <div style={{
          ...style.border,
          left: `calc(50% - ${my_worm_plot[0][0]}px)`,
          top: `calc(50% - ${my_worm_plot[0][1]}px)`,
        }}></div>

        {/* FOOD */}
        {
          food
            // .filter(f =>
            //   !(
            //     f[0] - my_worm_plot[0][0] > 1500 ||
            //     f[0] - my_worm_plot[0][0] < -1500 ||
            //     f[1] - my_worm_plot[0][1] > 1000 ||
            //     f[1] - my_worm_plot[0][1] < -1000
            //   )
            // )
            .map((f, i) =>
              <img key={`f${i}`} src="/images/cookie.png"
                style={{
                  ...style.food,
                  left: `calc(50% + ${f[0] - my_worm_plot[0][0]}px)`,
                  top: `calc(50% + ${f[1] - my_worm_plot[0][1]}px)`,
                }} />
            )
        }

        {/* BODY */}
        {
          my_worm_plot
            .map(x => [
              x[0] - my_worm_plot[0][0],
              x[1] - my_worm_plot[0][1],
              x[2],
              x[3],
              x[4],
            ])
            .filter((x, i, arr) => i % Math.floor(17 / speed) == 0 || i == arr.length - 1)
            // .filter((x, i) => i % (1 + Math.floor(length / 90)) == 0)
            .reverse()
            .map((mw, i, arr) =>
              <div key={`w${i}`} style={{
                ...style.worm.body,
                left: `calc(50% + ${mw[0]}px)`,
                top: `calc(50% + ${mw[1]}px)`,
                width: `${45 + (length / 2)}px`,
                height: `${45 + (length / 2)}px`,
                transform: `translate(-50%, -50%) rotate(${mw[4] * -1}deg)`,
                boxShadow: `0 0 ${10 + (length / 10)}px #0ee`,
                // backgroundImage: "url('/images/man01.jpg')",
                // boxShadow: `inset ${mw[3] * 10 + (length / 10)}px ${mw[2] * 10 * -1 + (length / 10)}px ${5 + (length / 10)}px -${5 + (length / 10)}px rgba(0,0,0,0.2),inset ${mw[3] * 10 * -1}px ${mw[2] * 10}px ${5 + (length / 10)}px -${5 + (length / 10)}px rgba(0,0,0,0.2), 0 0 ${10 + length / 10}px #0ee`,
              }}></div>
            )
        }

        {/* FACE */}
        <img src="/images/face.png" style={{
          ...style.face,
          width: `${40 + (length / 2)}px`,
          height: `${40 + (length / 2)}px`,
          transform: `translate(-50%, -50%) rotate(${my_worm_plot[0][4] * -1}deg)`,
        }} />

        {/* SCORE */}
        <div style={style.score}>score: {`${length - 10}`}</div>

      </div>
    </div>
  );
}

export default App;
