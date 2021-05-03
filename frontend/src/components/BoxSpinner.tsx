import React, {
	useEffect,
	useMemo,
	useState,
	ReactNode,
	useDebugValue,
	useCallback,
} from "react"
import { getRandInt } from "../utils/getRandInt"
import Tween from "rc-tween-one"
import { useWindowSize } from "../hooks/useWindowSize"
import ReactPlayer from "react-player"
import { PureVideoMode } from "../contexts/VideoMode"
import io from "socket.io-client"
import { useDebounce } from "use-debounce"
import { Socket } from "dgram"
export interface BoxSpinnerProps {
	boxCount: number
	videoMode: PureVideoMode
}

const NUM_TO_VIDEO_MODE: Record<number, PureVideoMode> = {
	[1]: "head",
	[2]: "torso",
	[3]: "leg",
}

const COLORS = ["#03A9F4", "#4CAF50", "#f44336"]
export const BoxSpinner = (props: BoxSpinnerProps) => {
	const [x, setX] = useState<number>(0)
	const { width, height } = useWindowSize()

	const [targetX, setTargetX] = useState<number>(0)
	const [spinning, setSpinning] = useState<boolean>(false)
	const [ready, setReady] = useState<boolean>(false)
	const [socket, setSocket] = useState<any>()
	const [buttonPressed, setButtonPressed] = useState<boolean>(false)
	const resolvedWidth = width ?? 1920

	const boxes: ReactNode[] = useMemo(() => {
		let arr = []
		for (let i = 0; i < props.boxCount; i++) {
			arr.push(
				<img src={`videos/${props.videoMode}/frames/${i + 1}.png`} />
			)
		}

		return arr
	}, [])

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

	const [debouncedReadyForSpin] = useDebounce(buttonPressed, 500)
	useEffect(() => {
		console.log(debouncedReadyForSpin)
		if (debouncedReadyForSpin) {
			setButtonPressed(false)
			startSpinner()
		}
	}, [debouncedReadyForSpin])

	const startSpinner = useCallback(() => {
		setTargetX(targetX + getRandInt(5, Math.min(12, props.boxCount)))
		setSpinning(true)
	}, [props.videoMode, targetX])

	const test = useMemo(() => targetX, [targetX])

	const testCallback = (num: number) => {
		if (NUM_TO_VIDEO_MODE[num] !== props.videoMode) {
			return
		}
		setButtonPressed(true)
	}

	useEffect(() => {
		const socket = io(`ws://${process.env.REACT_APP_WS}:5000`, {
			withCredentials: false,
		})
		socket.on("connect", () =>
			console.log("Websocket connection established.")
		)
		socket.on("input_event", testCallback)
	}, [])

	return (
		<div>
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
					on
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
