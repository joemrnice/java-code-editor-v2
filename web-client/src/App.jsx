import { Routes, Route } from "react-router-dom"
import JavaEditor from "./pages/JavaEditor"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<JavaEditor />} />
    </Routes>
  )
}