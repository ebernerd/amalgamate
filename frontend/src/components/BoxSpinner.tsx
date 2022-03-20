import { useEffect, useMemo, useState, ReactNode, useCallback } from "react"
import { getRandInt } from "../utils/getRandInt"
import { useWindowSize } from "../hooks/useWindowSize"
import ReactPlayer from "react-player"
import { PureVideoMode } from "../contexts/VideoMode"
import io from "socket.io-client"
import { useDebounce } from "use-debounce"
import { useInterval } from "../hooks/useInterval"

const DEBUG_DISABLE_SOCKET = true

const ANIMATION_SPEED_MS = 450

export interface BoxSpinnerProps {
	boxCount: number
	videoMode: PureVideoMode
}

const VIDEOS_DIR = `${process.env.PUBLIC_URL}/videos`

const NUM_TO_VIDEO_MODE: PureVideoMode[] = ["head", "torso", "leg"]
export const BoxSpinner = (props: BoxSpinnerProps) => {
	const { boxCount } = props

	const getFrameUrl = (index: number) =>
		`${VIDEOS_DIR}/${props.videoMode}/frames/${index}.png`
	console.log(getFrameUrl(1))
	const getVideoUrl = (index: number) =>
		`${VIDEOS_DIR}/${props.videoMode}/${index}.mp4`

	const { width } = useWindowSize()
	const resolvedWidth = width ?? 1920 //	Provides 1920 as a default value

	//	Holds the index of the currently-playing video clip
	const [currentClipIndex, setCurrentClipIndex] = useState<number>(0)

	//	Holds the index of the video clip the spin animation should stop at
	const [targetClipIndex, setTargetClipIndex] = useState<number>(0)

	const [isSpinning, setIsSpinning] = useState<boolean>(false)
	const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false)

	const boxes = Array(boxCount * 2)
		.fill("")
		.map((_, i) => <img alt="Spinner" src={getFrameUrl(i % boxCount)} />)

	/*	This useEffect is what drives the animation for the most part. Every
		`tickInterval` ms, the effect checks if the animation should still spin,
		and if so, updates which frame should be shown on screen. Once the
		effect runs enough times, it will stop the spinning animation
	*/
	useInterval(
		() => {
			console.log("Interval")
			console.log(currentClipIndex, targetClipIndex, isSpinning)
			if (currentClipIndex < targetClipIndex && isSpinning) {
				setCurrentClipIndex(currentClipIndex + 1)
			} else {
				setIsSpinning(false)
			}
		},
		isSpinning ? 200 : null
	)

	//	This useEffect listens for a debug key press which simulates a message
	//	from the Pi
	useEffect(() => {
		window.addEventListener("keypress", (e) => {
			if (e.key === "e") {
				startSpinner()
			}
		})
	})

	//	This callback updates the target clip & initiates the spinning animation
	const startSpinner = useCallback(() => {
		if (!isSpinning) {
			setTargetClipIndex((targetClipIndex + getRandInt(5, 12)) % boxCount)
			setIsSpinning(true)
		}
	}, [targetClipIndex, boxCount, isSpinning])

	/*	The buttons sometimes send a burst of button-press signals at once which
		would trigger multiple spin animations. Debouncing this variable reduces
		the changes of a double-spin occurring
	*/
	const [debouncedReadyForSpin] = useDebounce(isButtonPressed, 500)

	//	This useEffect listens for a request for a spin and starts the animation
	useEffect(() => {
		if (debouncedReadyForSpin) {
			setIsButtonPressed(false)
			startSpinner()
		}
	}, [debouncedReadyForSpin, startSpinner])

	//	This effect initiates the connection to the websocket server
	useEffect(() => {
		if (DEBUG_DISABLE_SOCKET) {
			return
		}
		const socket = io(`ws://${process.env.REACT_APP_WS}:5000`, {
			withCredentials: false,
		})
		socket.on("connect", () =>
			console.log("Websocket connection established.")
		)

		//	This function checks if the incoming `input_event` message is for
		//	this instance of the webpage
		const respondToInputEvent = (num: number) => {
			if (NUM_TO_VIDEO_MODE[num - 1] !== props.videoMode) {
				return
			}
			setIsButtonPressed(true)
		}

		socket.on("input_event", respondToInputEvent)
	}, [])

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
							transitionProperty: "all",
							transitionDuration: `${ANIMATION_SPEED_MS / 1000}s`,
							transitionTimingFunction: "ease-in-out",
							display:
								isSpinning &&
								Math.abs((currentClipIndex % boxCount) - i) <= 2
									? "block"
									: "none",
							left:
								currentClipIndex % boxCount === i
									? 0
									: currentClipIndex % boxCount === i + 1
									? -resolvedWidth
									: resolvedWidth,

							zIndex: boxCount - i + 1000,
						}}
					>
						{box}
					</div>
				))}
				<ReactPlayer
					url={getVideoUrl((targetClipIndex % boxCount) + 1)}
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
