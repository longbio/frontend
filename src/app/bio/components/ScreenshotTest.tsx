'use client'

import { useState } from 'react'
import html2canvas from 'html2canvas'

export default function ScreenshotTest() {
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const testScreenshot = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      // Create a simple test element
      const testElement = document.createElement('div')
      testElement.innerHTML = `
        <div style="
          width: 300px;
          height: 200px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        ">
          <h2 style="margin: 0 0 10px 0; font-size: 24px;">Test Screenshot</h2>
          <p style="margin: 0; font-size: 16px;">This is a test element for screenshot generation</p>
        </div>
      `

      // Position it off-screen
      testElement.style.position = 'absolute'
      testElement.style.left = '-9999px'
      testElement.style.top = '0'
      testElement.style.visibility = 'visible'
      testElement.style.opacity = '1'

      document.body.appendChild(testElement)

      // Wait a moment for rendering
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Generate screenshot
      const canvas = await html2canvas(testElement, {
        backgroundColor: '#ffffff',
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: true,
      })

      // Clean up
      document.body.removeChild(testElement)

      const dataURL = canvas.toDataURL('image/png')
      setTestResult(`✅ Screenshot test successful! Canvas size: ${canvas.width}x${canvas.height}`)

      // Also log the data URL for debugging
      console.log('Test screenshot data URL:', dataURL.substring(0, 100) + '...')
    } catch (error) {
      console.error('Screenshot test failed:', error)
      setTestResult(
        `❌ Screenshot test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Screenshot Functionality Test</h3>

      <button
        onClick={testScreenshot}
        disabled={isTesting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isTesting ? 'Testing...' : 'Test Screenshot Generation'}
      </button>

      {testResult && (
        <div className="mt-4 p-3 bg-white rounded-lg border">
          <p className="text-sm">{testResult}</p>
        </div>
      )}
    </div>
  )
}
