import "./App.scss"
import { VideoModeProvider, useVideoMode } from "./contexts/VideoMode"
import { VideoModeSelector } from "./components/VideoModeSelector"
import { BoxSpinner } from "./components/BoxSpinner"
import { VIDEO_COUNTS } from "./utils/misc"

const Main = () => {
	const { videoMode } = useVideoMode()
	return videoMode === undefined ? (
		<VideoModeSelector />
	) : (
		<BoxSpinner boxCount={VIDEO_COUNTS[videoMode]} videoMode={videoMode} />
	)
}

export const App = () => {
	console.log("APP RENDERED")
	return <VideoModeProvider>
		<Main />
	</VideoModeProvider>
}

