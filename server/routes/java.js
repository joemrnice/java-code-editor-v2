import { Router } from "express"
import runJava from "../utils/runJava.js"

const router = Router()

router.post("/run-java", async (req, res) => {
  const { code } = req.body

  if (!code || typeof code !== "string" || code.length > 10000) {
    return res.status(400).json({ output: "Invalid or too large code input" })
  }

  try {
    const result = await runJava(code)
    res.json(result)
  } catch (err) {
    res.status(500).json({ output: "Server Error:\n" + err.message })
  }
})

export default router