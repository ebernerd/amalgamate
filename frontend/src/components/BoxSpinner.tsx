import { useEffect, useMemo, useState, ReactNode } from "react"
import { getRandInt } from "../utils/getRandInt"
import Tween from "rc-tween-one"
import { useWindowSize } from "../hooks/useWindowSize"
import ReactPlayer from "react-player"
import { PureVideoMode } from "../contexts/VideoMode"

export interface BoxSpinnerProps {
	boxCount: number
	videoMode: PureVideoMode
}

const COLORS = ["#03A9F4", "#4CAF50", "#f44336"]
export const BoxSpinner = (props: BoxSpinnerProps) => {
	const [x, setX] = useState<number>(0)
	const { width, height } = useWindowSize()

	const [targetX, setTargetX] = useState<number>(0)
	const [spinning, setSpinning] = useState<boolean>(false)
	const resolvedWidth = width ?? 1920

	const boxes: ReactNode[] = useMemo(() => {
		let arr = []
		for (let i = 0; i < props.boxCount; i++) {
			arr.push(
				<ReactPlayer
					loop
					playing
					volume={0}
					url={`videos/${props.videoMode}/${i + 1}.mp4`}
					width={"100%"}
					height={"100%"}
				/>
			)
		}

		return arr
	}, [])

	const tickInterval = 180
	useEffect(() => {
		const timerId = setInterval(() => {
			if (x < targetX && spinning) {
				console.log("woo!")
				setX(x + 1)
			} else {
				setSpinning(false)
			}
		}, tickInterval)

		return () => clearInterval(timerId)
	})

	return (
		<div>
			<div>
				{boxes.map((box, i) => (
					<div
						className="box"
						style={{
							position: "fixed",
							background: "white",
							left:
								x % props.boxCount === i
									? 0
									: x % props.boxCount === i + 1
									? -resolvedWidth
									: resolvedWidth,

							zIndex: props.boxCount - i,
						}}
					>
						{box}
					</div>
				))}
			</div>

			<button
				onClick={() => {
					setTargetX(
						x + getRandInt(1, props.boxCount) + props.boxCount * 2
					)
					setSpinning(true)
				}}
				style={{ position: "fixed", top: 500 }}
			>
				Spin
			</button>
		</div>
	)
}
