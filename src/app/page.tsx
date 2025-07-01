'use client'

import FileLoader from './components/FileLoader'
import FileSaver from './components/FileSaver'
import Editor from './components/Editor'
import { useState } from 'react'

export default function Home() {
  const [saveData, setSaveData] = useState(null)
  return (
    <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-4 sm:p-8 md:p-16">
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-10 sm:p-10 w-full max-w-4xl flex flex-col gap-8 border border-slate-700">
        <div className="flex flex-col items-center gap-2 mb-2">
          <h1 className="text-4xl font-extrabold text-center tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Phasmophobia Save Editor
          </h1>
          <p className="text-slate-300 text-center text-base mt-1 max-w-md">
            Easily edit and save your Phasmophobia game save file safely.
          </p>
        </div>

        {saveData ? (
          <div>
            <div className="flex flex-col items-center gap-4"></div>
            <div className="flex flex-col gap-3 items-center mb-4 w-full">
              <label
                htmlFor="saveFileOutput"
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 text-white font-semibold py-2 px-5 rounded-lg cursor-pointer text-sm sm:text-base shadow-md w-full text-center"
              >
                Download Save File
              </label>
              <label
                htmlFor="saveFileOutputUnencrypted"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-white font-semibold py-2 px-5 rounded-lg cursor-pointer text-sm sm:text-base shadow-md w-full text-center"
              >
                Download (unencrypted)
              </label>
              <FileSaver data={saveData} />
              <label
                htmlFor="clearFile"
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all duration-200 text-white font-semibold py-2 px-5 rounded-lg cursor-pointer text-sm sm:text-base shadow-md w-full text-center"
              >
                Close File
              </label>
              <input
                type="button"
                id="clearFile"
                className="hidden"
                onClick={() => setSaveData(null)}
              />
            </div>
            <div className="w-full rounded-lg bg-slate-900/60 p-4 shadow-inner">
              <Editor data={saveData} />
            </div>
            <p className="text-green-400 text-center text-sm mt-6 animate-pulse">
              Save file loaded successfully. You can now edit and save your
              changes.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col gap-3 items-center mb-4 w-full">
              <label
                htmlFor="saveFileInput"
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 text-white font-semibold py-2 px-5 rounded-lg cursor-pointer text-sm sm:text-base shadow-md w-full text-center"
              >
                Upload Save File
              </label>
              <label
                htmlFor="saveFileInputUnencrypted"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-white font-semibold py-2 px-5 rounded-lg cursor-pointer text-sm sm:text-base shadow-md w-full text-center"
              >
                Upload (unencrypted)
              </label>
              <FileLoader stateSetter={setSaveData} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-xs sm:text-sm mt-1 break-all text-center text-slate-300">
                <span className="font-semibold text-slate-200">
                  Your save data can be located on:
                </span>
              </p>
              <p className="text-xs sm:text-sm mt-1 break-all text-center text-slate-300">
                <span className="font-semibold text-blue-300">Windows:</span>{' '}
                <br />
                <code className="bg-gray-900/80 rounded-md p-1 break-all">
                  %appdata%\..\LocalLow\Kinetic Games\Phasmophobia\SaveFile.txt
                </code>
              </p>
              <p className="text-xs sm:text-sm mt-1 break-all text-center text-slate-300">
                <span className="font-semibold text-purple-300">
                  Linux (Proton):
                </span>{' '}
                <br />
                <code className="bg-gray-900/80 rounded-md p-1 break-all">
                  ~/.steam/steam/steamapps/compatdata/739630/pfx/drive_c/users/steamuser/AppData/LocalLow/Kinetic
                  Games/SaveFile.txt
                </code>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
