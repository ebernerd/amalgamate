import "./VideoFrame.scss"
import { FC, HTMLAttributes } from "react"
import { PureVideoMode } from "../contexts/VideoMode"
import { VIDEOS_DIR } from "../utils/misc"

type VideoFrameProps = {
	index: number
	videoMode: PureVideoMode
	xPos: number
	boxWidth: number
}

export const ANIMATION_SPEED = 0.25 //seconds

export const VideoFrame: FC<VideoFrameProps> = (props) => {
	const { index, videoMode, xPos, boxWidth } = props

	const frameImgUrl = `${VIDEOS_DIR}/${videoMode}/frames/${index + 1}.png`

	const style: HTMLAttributes<HTMLDivElement>["style"] = {
		display: "block",
		position: "absolute",
		left: xPos,

		transitionDuration: `${ANIMATION_SPEED}s`,
		transitionProperty: "all",
		transitionTimingFunction: "linear",
		zIndex: 100 + index,
	}

	return (
		<div style={style}>
			<img src={frameImgUrl} alt={`Frame ${index}`} width={boxWidth} />
		</div>
	)
}
