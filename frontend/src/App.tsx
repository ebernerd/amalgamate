import "./App.scss"
import { useContext, useState } from "react"
import { PureVideoMode, VideoModeContext } from "./contexts/VideoMode"
import { VideoModeSelector } from "./components/VideoModeSelector"
import { BoxSpinner } from "./components/BoxSpinner"
import { VIDEO_COUNTS } from "./utils/misc"

const App = () => {
	const [videoMode] = useContext(VideoModeContext)
	return videoMode === undefined ? (
		<VideoModeSelector />
	) : (
		<BoxSpinner boxCount={VIDEO_COUNTS[videoMode]} videoMode={videoMode} />
	)
}

export default App
