import { useVideoMode } from "../contexts/VideoMode"

export const VideoModeSelector = () => {
	const { setVideoMode } = useVideoMode()

	return (
		<div>
			<button onClick={() => setVideoMode("head")}>Head</button>
			<button onClick={() => setVideoMode("torso")}>Torso</button>
			<button onClick={() => setVideoMode("leg")}>Legs</button>
		</div>
	)
}
