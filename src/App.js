import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [speed_xy, setSpeedXY] = useState([0, -1, 0])
  const [speed, setSpeed] = useState(5)
  const [angle, setAngle] = useState(0)
  const [length, setLength] = useState(10)

  const [my_worm_plot, setMyWormPlot] = useState(
    Array(1).fill("").map((x, i) => [0, 0, 0, 0, 0])
  )

  const [food, setFood] = useState(
    Array(500).fill("").map(() => [
      (Math.floor(Math.random() * 2495)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
      (Math.floor(Math.random() * 2495)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
      Math.floor(Math.random() * 10)
    ])
  )

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
  })

  useEffect(() => {
    setInterval(() => {
      setSpeedXY(speed_xy => {
        let speed_x = speed_xy[0]
        let speed_y = speed_xy[1]
        setAngle(angle => {
          let new_angle = angle
          console.log(new_angle, speed_xy[2], Math.abs(new_angle - speed_xy[2]), Math.abs(new_angle - speed_xy[2]) > 180);
          if (new_angle != speed_xy[2]) {
            if (new_angle > 175 && speed_xy[2] - 5 <= -180 || (new_angle < -175 && speed_xy[2] + 5 >= 180)) {
              // do not thing
            } else if (new_angle < speed_xy[2] - 5) {
              new_angle = speed_xy[2] + (Math.abs(new_angle - speed_xy[2]) > 180 ? +5 : -5)
            } else if (new_angle > speed_xy[2] + 5) {
              new_angle = speed_xy[2] + (Math.abs(new_angle - speed_xy[2]) > 180 ? -5 : +5)
            }
            if (new_angle > 180) new_angle -= 360
            if (new_angle < -180) new_angle += 360
            speed_x = Math.sin((Math.PI / 180) * new_angle)
            speed_y = Math.cos((Math.PI / 180) * new_angle)
            speed_x = speed_x > 1 ? 0 : speed_x
            speed_y = speed_y > 1 ? 0 : speed_y
          }
          setSpeedXY([speed_x, speed_y, new_angle])
          setLength(length => {
            setMyWormPlot(my_worm_plot => {
              let new_plot_x = my_worm_plot[0][0] + speed_x * speed
              let new_plot_y = my_worm_plot[0][1] + speed_y * speed
              if (new_plot_x > 2500 || new_plot_x < -2500 || new_plot_y > 2500 || new_plot_y < -2500) {
                alert("you die!")
                setLength(10)
                setFood(
                  Array(500).fill("").map(() => [
                    (Math.floor(Math.random() * 2495)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
                    (Math.floor(Math.random() * 2495)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
                    Math.floor(Math.random() * 10)
                  ])
                )
                return Array(1).fill("").map((x, i) => [0, 0, 0, 0, 0])
              } else {
                setFood(food => {
                  let food_count = food.length
                  food = food.filter(f =>
                    !(
                      f[0] > new_plot_x - (50 + (length / 10)) &&
                      f[0] < new_plot_x + (50 + (length / 10)) &&
                      f[1] > new_plot_y - (50 + (length / 10)) &&
                      f[1] < new_plot_y + (50 + (length / 10))
                    )
                  )
                  if (food_count > food.length) {
                    setLength(length => length + (food_count - food.length) * 1)
                  }
                  return [...food, ...
                    Array(food_count - food.length).fill("").map(() => [
                      (Math.floor(Math.random() * 1500)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
                      (Math.floor(Math.random() * 1500)) * (Math.floor(Math.random() * 1.5) ? 1 : -1),
                      Math.floor(Math.random() * 10)
                    ])]
                })
                return [[
                  new_plot_x, // X
                  new_plot_y,  // Y
                  speed_x, // X direction
                  speed_y,  // Y direction
                  new_angle,
                ]].concat(my_worm_plot).splice(0, length)
              }
            })
            return length
          })
          return angle
        })
        return speed_xy
      })
    }, 10)
    document.addEventListener('mousemove', (e) => {
      setAngle((Math.atan2(e.clientX - (e.view.innerWidth / 2), e.clientY - (e.view.innerHeight / 2)) * (180 / Math.PI)))
    })
    document.addEventListener('touchmove', (e) => {
      e.preventDefault()
      setAngle((Math.atan2(e.touches[0].clientX - (e.view.innerWidth / 2), e.touches[0].clientY - (e.view.innerHeight / 2)) * (180 / Math.PI)))
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
            .filter(f =>
              !(
                f[0] - my_worm_plot[0][0] > 50 + (window.innerWidth / 2) ||
                f[0] - my_worm_plot[0][0] < -50 + (window.innerWidth / 2 * -1) ||
                f[1] - my_worm_plot[0][1] > 50 + (window.innerHeight / 2) ||
                f[1] - my_worm_plot[0][1] < -50 + (window.innerHeight / 2 * -1)
              )
            )
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
                width: `${50 + (length / 10)}px`,
                height: `${50 + (length / 10)}px`,
                transform: `translate(-50%, -50%) rotate(${mw[4] * -1}deg)`,
                boxShadow: `0 0 ${10 + (length / 50)}px #0ee`,
                // backgroundImage: "url('/images/man01.jpg')",
                // boxShadow: `inset ${mw[3] * 10 + (length / 10)}px ${mw[2] * 10 * -1 + (length / 10)}px ${5 + (length / 10)}px -${5 + (length / 10)}px rgba(0,0,0,0.2),inset ${mw[3] * 10 * -1}px ${mw[2] * 10}px ${5 + (length / 10)}px -${5 + (length / 10)}px rgba(0,0,0,0.2), 0 0 ${10 + length / 10}px #0ee`,
              }}></div>
            )
        }

        {/* FACE */}
        <img src="/images/face.png" style={{
          ...style.face,
          width: `${(50 + (length / 10)) * 0.9}px`,
          height: `${(50 + (length / 10)) * 0.9}px`,
          transform: `translate(-50%, -50%) rotate(${my_worm_plot[0][4] * -1}deg)`,
        }} />

        {/* SCORE */}
        <div style={style.score}>score: {`${length - 10}`}</div>

      </div>
    </div>
  )
}

export default App
