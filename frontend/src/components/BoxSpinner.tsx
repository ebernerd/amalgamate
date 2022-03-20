import { useEffect, useMemo, useState, ReactNode, useCallback } from "react"
import { getRandInt } from "../utils/getRandInt"
import { useWindowSize } from "../hooks/useWindowSize"
import ReactPlayer from "react-player"
import { PureVideoMode } from "../contexts/VideoMode"
import io from "socket.io-client"
import { useDebounce } from "use-debounce"
import { useInterval } from "../hooks/useInterval"
import { VIDEOS_DIR, VIDEO_COUNTS } from "../utils/misc"
import { VideoFrameRibbon } from "./VideoFrameRibbon"

const DEBUG_DISABLE_SOCKET = true

export interface BoxSpinnerProps {
	boxCount: number
	videoMode: PureVideoMode
}

const NUM_TO_VIDEO_MODE: PureVideoMode[] = ["head", "torso", "leg"]
export const BoxSpinner = (props: BoxSpinnerProps) => {
	const { boxCount } = props

	const getFrameUrl = (index: number) =>
		`${VIDEOS_DIR}/${props.videoMode}/frames/${index}.png`
	const getVideoUrl = (index: number) =>
		`${VIDEOS_DIR}/${props.videoMode}/${index}.mp4`

	const { width: rawScreenWidth } = useWindowSize()
	const screenWidth = rawScreenWidth ?? 1920 //	Provides 1920 as a default value

	//	Holds the index of the video clip the spin animation should stop at
	const [targetClipIndex, setTargetClipIndex] = useState<number>(0)

	const [isSpinning, setIsSpinning] = useState<boolean>(false)
	const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false)

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
			const newTargetIndex = getRandInt(
				0,
				VIDEO_COUNTS[props.videoMode] - 1
			)
			setTargetClipIndex(newTargetIndex)
			console.log(`Target clip index: ${newTargetIndex}`)
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
				{isSpinning ? (
					<VideoFrameRibbon
						boxWidth={screenWidth}
						targetIndex={targetClipIndex}
						videoMode={props.videoMode}
						onSpinComplete={() => setIsSpinning(false)}
					/>
				) : null}
				<ReactPlayer
					url={getVideoUrl((targetClipIndex % boxCount) + 1)}
					playing={!isSpinning}
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
