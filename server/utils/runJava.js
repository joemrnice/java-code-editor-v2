import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { v4 as uuid } from "uuid"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const runJava = (code) => {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, "..", "temp")
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }


    // Always use Main.java for public class Main
    const javaFilePath = path.join(tempDir, "Main.java")
    const classFilePath = path.join(tempDir, "Main.class")

    fs.writeFileSync(javaFilePath, code)

    const compileCommand = `javac ${javaFilePath}`
    const runCommand = `java -cp ${tempDir} Main`

    exec(compileCommand, (compileErr, _, compileStderr) => {
      if (compileErr || compileStderr) {
        cleanup()
        return resolve({ output: "Compilation Error:\n" + (compileErr?.message || compileStderr) })
      }

      exec(runCommand, { timeout: 5000 }, (runErr, stdout, stderr) => {
        cleanup()
        if (runErr || stderr) {
          return resolve({ output: "Runtime Error:\n" + (runErr?.message || stderr) })
        }

        resolve({ output: stdout })
      })
    })

    const cleanup = () => {
      try {
        if (fs.existsSync(javaFilePath)) fs.unlinkSync(javaFilePath)
        if (fs.existsSync(classFilePath)) fs.unlinkSync(classFilePath)
      } catch (err) {
        console.error("Error cleaning up files:", err.message)
      }
    }
  })
}

export default runJava