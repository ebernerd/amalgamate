import "./App.scss"
import { useContext } from "react"
import { PureVideoMode, VideoModeContext } from "./contexts/VideoMode"
import { VideoModeSelector } from "./components/VideoModeSelector"
import { BoxSpinner } from "./components/BoxSpinner"

const VIDEO_COUNTS: Record<PureVideoMode, number> = {
	head: 24,
	torso: 41,
	leg: 37,
}

const App = () => {
	//	Show the video mode selector if there is not one selected
	const [videoMode] = useContext(VideoModeContext)
	return videoMode === undefined ? (
		<VideoModeSelector />
	) : (
		<BoxSpinner boxCount={VIDEO_COUNTS[videoMode]} videoMode={videoMode} />
	)
}

export default App
