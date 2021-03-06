import { useEffect, useMemo, useState, ReactNode, useCallback } from "react"
import { getRandInt } from "../utils/getRandInt"
import { useWindowSize } from "../hooks/useWindowSize"
import ReactPlayer from "react-player"
import { PureVideoMode } from "../contexts/VideoMode"
import io from "socket.io-client"
import { useDebounce } from "use-debounce"
export interface BoxSpinnerProps {
	boxCount: number
	videoMode: PureVideoMode
	isPi: boolean
}

const NUM_TO_VIDEO_MODE: PureVideoMode[] = ["head", "torso", "leg"]
export const BoxSpinner = (props: BoxSpinnerProps) => {
	const [x, setX] = useState<number>(0)
	const { width } = useWindowSize()

	const [targetX, setTargetX] = useState<number>(0)
	const [spinning, setSpinning] = useState<boolean>(false)
	const [buttonPressed, setButtonPressed] = useState<boolean>(false)
	const resolvedWidth = width ?? 1920

	const boxes: ReactNode[] = useMemo(() => {
		console.log(props.videoMode)
		let arr = []
		for (let i = 0; i < props.boxCount; i++) {
			arr.push(
				<img
					alt="Spinner"
					src={`https://storage.googleapis.com/amalgamate-videos/${
						props.videoMode
					}/frames/${i + 1}.png`}
				/>
			)
		}

		return arr
	}, [props.boxCount, props.videoMode])

	const tickInterval = 200
	useEffect(() => {
		//console.log(x, targetX, test)
		const timerId = setInterval(() => {
			if (x < targetX && spinning) {
				setX(x + 1)
			} else {
				setSpinning(false)
			}
		}, tickInterval)

		return () => clearInterval(timerId)
	})
	const startSpinner = useCallback(() => {
		if (!spinning) {
			setTargetX(targetX + getRandInt(5, Math.min(12, props.boxCount)))
			setSpinning(true)
		}
	}, [targetX, props.boxCount, spinning])

	const [debouncedReadyForSpin] = useDebounce(buttonPressed, 500)
	useEffect(() => {
		if (debouncedReadyForSpin) {
			setButtonPressed(false)
			startSpinner()
		}
	}, [debouncedReadyForSpin, startSpinner])

	useEffect(() => {
		const socket = io(
			`ws://${props.isPi ? "127.0.0.1" : process.env.REACT_APP_WS}:5000`,
			{
				withCredentials: false,
			}
		)
		socket.on("connect", () =>
			console.log("Websocket connection established.")
		)
		socket.on("input_event", (num: number) => {
			if (NUM_TO_VIDEO_MODE[num - 1] !== props.videoMode) {
				return
			}
			setButtonPressed(true)
		})
	}, [props.videoMode, props.isPi])

	return (
		<div className="videoHolder">
			<div>
				{boxes.map((box, i) => (
					<div
						key={i}
						className="box"
						style={{
							position: "fixed",
							background: "white",
							display:
								spinning &&
								Math.abs((x % props.boxCount) - i) <= 2
									? "block"
									: "none",
							left:
								x % props.boxCount === i
									? 0
									: x % props.boxCount === i + 1
									? -resolvedWidth
									: resolvedWidth,

							zIndex: props.boxCount - i + 100,
						}}
					>
						{box}
					</div>
				))}
				<ReactPlayer
					url={`https://storage.googleapis.com/amalgamate-videos/${
						props.videoMode
					}/${(targetX % props.boxCount) + 1}.mp4`}
					playing={true}
					width="100vw"
					height="100vh"
					loop
					style={{
						zIndex: 1,
					}}
					volume={0}
				/>
			</div>
		</div>
	)
}
