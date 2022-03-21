import { FC, HTMLAttributes, useEffect, useMemo, useRef, useState } from "react"
import { PureVideoMode } from "../contexts/VideoMode"
import { getRandInt } from "../utils/getRandInt"
import { VIDEO_COUNTS } from "../utils/misc"
import { VideoFrame } from "./VideoFrame"

export type VideoFrameRibbonProps = {
	targetIndex: number
	boxWidth: number
	videoMode: PureVideoMode

	onSpinComplete(): void
}

const SPEED_PER_FRAME = 0.1 // seconds
export const VideoFrameRibbon: FC<VideoFrameRibbonProps> = (props) => {
	const { boxWidth, targetIndex, videoMode, onSpinComplete } = props
	const [targetX, setTargetX] = useState<number>(0)
	const numberOfElements = useRef(getRandInt(10, 15) * 2)
	const animationDuration = numberOfElements.current * SPEED_PER_FRAME

	useEffect(() => {
		setTimeout(() => setTargetX(numberOfElements.current * boxWidth), 100)
		setTimeout(() => onSpinComplete(), animationDuration * 1000)
	}, [])

	const frameElements = useMemo(() => {
		const els = Array(numberOfElements.current)
			.fill("")
			.map((_, i) => (
				<VideoFrame
					key={i}
					index={getRandInt(0, VIDEO_COUNTS[videoMode] - 1)}
					videoMode={videoMode}
					xPos={i * boxWidth}
				/>
			))
		//	Append the target frame's image to the list
		console.log(`Final frame index: ${targetIndex}`)
		els.push(
			<VideoFrame
				key={"final-frame"}
				index={targetIndex}
				xPos={els.length * boxWidth}
				videoMode={videoMode}
			/>
		)
		return els
	}, [targetIndex])

	const ribbonStyle: HTMLAttributes<HTMLDivElement>["style"] = {
		transitionDuration: `${animationDuration}s`,
		transitionProperty: "all",
		left: -targetX,
		position: "fixed",
		width: (numberOfElements.current + 1) * boxWidth,
	}

	return <div style={ribbonStyle}>{frameElements}</div>
}
