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
}

const NUM_TO_VIDEO_MODE: PureVideoMode[] = ["head", "torso", "leg"]
export const BoxSpinner = (props: BoxSpinnerProps) => {
	const [x, setX] = useState<number>(0)
	const { width } = useWindowSize()

	const [targetX, setTargetX] = useState<number>(0)
	const [spinning, setSpinning] = useState<boolean>(false)
	const [connectText, setConnectText] = useState<string>("Not connected.")
	const [buttonPressed, setButtonPressed] = useState<boolean>(false)
	const resolvedWidth = width ?? 1920

	const boxes: ReactNode[] = useMemo(() => {
		console.log(props.videoMode)
		let arr = []
		for (let i = 0; i < props.boxCount; i++) {
			arr.push(
				<img
					alt="Spinner"
					src={`videos/${props.videoMode}/frames/${i + 1}.png`}
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
		setTargetX(targetX + getRandInt(5, Math.min(12, props.boxCount)))
		setSpinning(true)
	}, [targetX, props.boxCount])

	const [debouncedReadyForSpin] = useDebounce(buttonPressed, 500)
	useEffect(() => {
		console.log(debouncedReadyForSpin)
		if (debouncedReadyForSpin) {
			setButtonPressed(false)
			startSpinner()
		}
	}, [debouncedReadyForSpin, startSpinner])

	useEffect(() => {
		const socket = io(`ws://${process.env.REACT_APP_WS}:5000`, {
			withCredentials: false,
			auth: undefined,
		})
		socket.on("connect", () => setConnectText("Connection Succeeded"))
		socket.on("connect_failed", () => {
			setConnectText("Connection failed")
		})
		socket.on("input_event", (num: number) => {
			if (NUM_TO_VIDEO_MODE[num] !== props.videoMode) {
				return
			}
			setButtonPressed(true)
		})
	}, [props.videoMode])

	return (
		<div>
			<p>{connectText}</p>
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
					url={`videos/${props.videoMode}/${
						(targetX % props.boxCount) + 1
					}.mp4`}
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

			<button
				onClick={() => {
					startSpinner()
				}}
				style={{ position: "fixed", top: 500 }}
			>
				Spin
			</button>
		</div>
	)
}
