import "./App.scss"
import { useContext, useState } from "react"
import { PureVideoMode, VideoModeContext } from "./contexts/VideoMode"
import { VideoModeSelector } from "./components/VideoModeSelector"
import { BoxSpinner } from "./components/BoxSpinner"

const VIDEO_COUNTS: Record<PureVideoMode, number> = {
	head: 19,
	torso: 39,
	leg: 35,
}

const App = () => {
	const [videoMode] = useContext(VideoModeContext)
	return videoMode === undefined ? (
		<VideoModeSelector />
	) : (
		<BoxSpinner boxCount={VIDEO_COUNTS[videoMode]} videoMode={videoMode} />
	)
}

export default App
