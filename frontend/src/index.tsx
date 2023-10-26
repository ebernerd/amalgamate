import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { VideoModeProvider } from "./contexts/VideoMode"

ReactDOM.render(
	<VideoModeProvider>
		<App />
	</VideoModeProvider>,

	document.getElementById("root")
)
