import "./VideoFrame.scss"
import { FC, HTMLAttributes } from "react"
import { PureVideoMode } from "../contexts/VideoMode"
import { VIDEOS_DIR } from "../utils/misc"
import { useWindowSize } from "../hooks/useWindowSize"

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
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		left: xPos,

		transitionDuration: `${ANIMATION_SPEED}s`,
		transitionProperty: "all",
		transitionTimingFunction: "linear",
		zIndex: 100 + index,
		width: "100vw",
		height: "100vh",
		background: "white",
	}

	const windowSize = useWindowSize()
	const imageDimensions = {
		horiz: 1920 * ((windowSize.width ?? 1920) / 1920),
		vert: 1080 * ((windowSize.height ?? 1080) / 1080),
	}

	const legSizeOffset = 200

	return (
		<div style={style}>
			<img
				src={frameImgUrl}
				alt={`Frame ${index}`}
				width={
					videoMode === "leg"
						? imageDimensions.vert - legSizeOffset * 2
						: imageDimensions.horiz
				}
				height={
					videoMode === "leg"
						? imageDimensions.horiz - legSizeOffset * 3
						: imageDimensions.vert
				}
			/>
		</div>
	)
}
