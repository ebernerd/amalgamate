import "./VideoFrame.scss"
import { FC, HTMLAttributes } from "react"
import { PureVideoMode } from "../contexts/VideoMode"
import { VIDEOS_DIR } from "../utils/misc"
import { useWindowSize } from "../hooks/useWindowSize"

type VideoFrameProps = {
	index: number
	videoMode: PureVideoMode
	xPos: number
	zIndex?: number
	width: number
	height: number
}

export const ANIMATION_SPEED = 0.25 //seconds

export const VideoFrame: FC<VideoFrameProps> = (props) => {
	const { index, videoMode, xPos, zIndex, width, height } = props

	const frameImgUrl = `${VIDEOS_DIR}/${videoMode}/frames/${index + 1}.png`

	const style: HTMLAttributes<HTMLDivElement>["style"] = {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		left: xPos,

		transitionDuration: `${ANIMATION_SPEED}s`,
		transitionProperty: "all",
		transitionTimingFunction: "linear",
		zIndex: zIndex ?? 100 + index,
		width: "100vw",
		height: "100vh",
		background: "white",
	}

	const legSizeOffset = 400

	return (
		<div style={style}>
			<img
				src={frameImgUrl}
				alt={`Frame ${index}`}
				width={
					videoMode === "leg"
						? height - legSizeOffset * (height / 1080)
						: width
				}
				height={
					videoMode === "leg"
						? width - legSizeOffset * (width / 1920)
						: "auto"
				}
			/>
		</div>
	)
}
