import { PureVideoMode } from "../contexts/VideoMode"

export const VIDEOS_DIR = `${process.env.PUBLIC_URL}/videos`
export const VIDEO_COUNTS: Record<PureVideoMode, number> = {
	head: 25,
	torso: 41,
	leg: 35,
}
