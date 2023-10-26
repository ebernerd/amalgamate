import { useEffect, useState } from "react"
import useWebSockets from "react-use-websocket"
import { getRandInt } from "../utils/getRandInt"
import { PureVideoMode } from "../contexts/VideoMode"
import ReactPlayer from "react-player"

const VIDEO_COUNTS: Record<PureVideoMode, number> = {
	head: 24,
	torso: 13,
	leg: 3,
}

export const VideoController = (props: { videoMode: PureVideoMode }) => {
	const { readyState, lastMessage } = useWebSockets("wss://Test")
	const [videoIndex, setVideoIndex] = useState<number>(-1)

	useEffect(() => {
		let nextVideoIndex = videoIndex
		while (nextVideoIndex === videoIndex) {
			nextVideoIndex = getRandInt(1, VIDEO_COUNTS[props.videoMode])
		}

		setVideoIndex(nextVideoIndex)

		// eslint-disable-next-line
	}, [lastMessage, props.videoMode])
	return (
		<div className="App">
			<ReactPlayer
				url={`/videos/${props.videoMode}/${videoIndex}.mp4`}
				width={"100vw"}
				height={"100vh"}
				playing={true}
				volume={0}
				loop
			/>
		</div>
	)
}
