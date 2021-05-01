import "./App.scss"
import { useContext } from "react"
import { VideoModeContext } from "./contexts/VideoMode"
import { VideoModeSelector } from "./components/VideoModeSelector"
import { VideoController } from "./components/VideoController"

const App = () => {
	//	Show the video mode selector if there is not one selected
	const [videoMode] = useContext(VideoModeContext)
	return videoMode === undefined ? (
		<VideoModeSelector />
	) : (
		<VideoController videoMode={videoMode} />
	)
}

export default App
