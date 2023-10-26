import { useContext } from "react"
import { VideoModeContext } from "../contexts/VideoMode"

export const VideoModeSelector = () => {
	// eslint-disable-next-line
	const [_, setValue] = useContext(VideoModeContext)
	if (!setValue) {
		return <></>
	}

	return (
		<div>
			<button onClick={() => setValue("head")}>Head</button>
			<button onClick={() => setValue("torso")}>Torso</button>
			<button onClick={() => setValue("leg")}>Legs</button>
		</div>
	)
}
