import {
	createContext,
	useState,
	ReactNode,
	Dispatch,
	SetStateAction,
} from "react"

export type PureVideoMode = "head" | "torso" | "leg"
export type VideoMode = PureVideoMode | undefined

export const VideoModeContext = createContext<
	[VideoMode, Dispatch<SetStateAction<VideoMode>> | undefined]
>([undefined, undefined])

export const VideoModeProvider = (props: { children: ReactNode }) => {
	const [currentVideoMode, setVideoMode] = useState<VideoMode | undefined>()

	return (
		<VideoModeContext.Provider value={[currentVideoMode, setVideoMode]}>
			{props.children}
		</VideoModeContext.Provider>
	)
}
