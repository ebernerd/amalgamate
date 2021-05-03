import "./App.scss"
import { useContext, useState } from "react"
import { PureVideoMode, VideoModeContext } from "./contexts/VideoMode"
import { VideoModeSelector } from "./components/VideoModeSelector"
import { BoxSpinner } from "./components/BoxSpinner"

const VIDEO_COUNTS: Record<PureVideoMode, number> = {
	head: 25,
	torso: 39,
	leg: 35,
}

const App = () => {
	//	Show the video mode selector if there is not one selected
	const [isPi, setIsPi] = useState<boolean>(false)

	const [videoMode] = useContext(VideoModeContext)
	return videoMode === undefined ? (
		<>
			<VideoModeSelector />
			<button onClick={() => setIsPi(!isPi)}>
				Is in Pi view? {isPi ? "Yes" : "No"}
			</button>
		</>
	) : (
		<BoxSpinner
			isPi={isPi}
			boxCount={VIDEO_COUNTS[videoMode]}
			videoMode={videoMode}
		/>
	)
}

export default App
