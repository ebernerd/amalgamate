import {
	createContext,
	useState,
	ReactNode,
	useContext
} from "react"

export type PureVideoMode = "head" | "torso" | "leg"
export type VideoMode = PureVideoMode | undefined

type VideoModeCtxType = {
	videoMode: VideoMode
	setVideoMode: (mode: PureVideoMode) => void
}
export const VideoModeContext = createContext<VideoModeCtxType | null>(null)

export const VideoModeProvider = (props: { children: ReactNode }) => {
	const [videoMode, setVideoMode] = useState<VideoMode>()

	return (
		<VideoModeContext.Provider value={{videoMode, setVideoMode}}>
			{props.children}
		</VideoModeContext.Provider>
	)
}

export const useVideoMode = () => {
	const data = useContext(VideoModeContext)
	if (data === null) {
		throw new Error("Cannot `useVideoMode` out of context!")
	}

	return data
}
