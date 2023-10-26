import "./VideoModeSelector.scss"
import { FC } from "react"
import { PureVideoMode, useVideoMode } from "../contexts/VideoMode"
import { capitalize } from "lodash"

export const VideoModeSelector = () => {
	return (
		<div className="container">
			<div className="title">
				<h1>Amalgamate!</h1>
			</div>
			<div className="selector">
				<VideoModeButton mode="head" />
				<VideoModeButton mode="torso" />
				<VideoModeButton mode="leg" />
			</div>
		</div>
		
	)
}


interface VideoModeButtonProps {
	mode: PureVideoMode
}

const BUTTON_META: Record<PureVideoMode, { icon: string, label: string }> = {
	head: {
		icon: "mood-smile-beam",
		label: "Faces",
	},
	torso: {
		icon: "shirt",
		label: "Bodies",
	},
	leg: {
		icon: "shoe",
		label: "Legs"
	}
}

const VideoModeButton: FC<VideoModeButtonProps> = ({mode}) => {
	const { setVideoMode } = useVideoMode()
	const { icon, label } = BUTTON_META[mode]
	return <button className={`option ${mode}`} onClick={() => setVideoMode(mode)}>
		<i className={`ti ti-${icon}`} />
		{label}
	</button>
}