'use client'

import { Dispatch, SetStateAction } from 'react'

interface IFileLoaderProps {
  stateSetter: Dispatch<SetStateAction<any>>
}

const FileLoader = (props: IFileLoaderProps) => {
  // this is TERRIBLE! but it's the only way I can get it to work
  const PASSWORD = 't36gref9u84y7f43g'
  const handleFileChange = async (data: ArrayBuffer) => {
    try {
      if (!data) return
      const iv = data.slice(0, 16)
      const salt = iv // using iv as salt, as in original code
      // Derive key using PBKDF2
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(PASSWORD),
        { name: 'PBKDF2' },
        false,
        ['deriveKey'],
      )
      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100,
          hash: 'SHA-1',
        },
        keyMaterial,
        { name: 'AES-CBC', length: 128 },
        false,
        ['decrypt'],
      )
      // Decrypt
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-CBC',
          iv: iv,
        },
        key,
        data.slice(16),
      )
      // convert decrypted to text
      const decodedText = new TextDecoder().decode(decrypted)
      // there's an issue (apparently) where playedMaps aren't formatted properly.
      // this is a hacky fix for that using regex
      const regex = /"playedMaps"(\s|)\:(\s){\s*.*\s*.*\s*.\s*.*\s*/
      const fixedText = decodedText.replace(regex, '')
      // Logging for debugging
      // console.log('Decrypted text:', decodedText)
      // console.log('Fixed text:', fixedText)
      try {
        const parsed = JSON.parse(fixedText)
        console.log('Parsed JSON:', parsed)
        props.stateSetter(parsed)
      } catch (parseErr) {
        // console.error('JSON parse error:', parseErr)
        alert(
          'Failed to parse decrypted save file. The file may be corrupted or not a valid save file.',
        )
      }
    } catch (e) {
      // console.error(e)
      alert(
        "Error decrypting save file - make sure you're using the correct file (and that it's valid)",
      )
    }
  }
  return (
    <>
      <input
        type="file"
        accept=".txt"
        id="saveFileInput"
        className="hidden"
        onChange={(e) => {
          if (!e.target.files?.[0]) return
          const fileReader = new FileReader()
          fileReader.onload = (ev: ProgressEvent<FileReader>) => {
            // setData(Buffer.from(ev.target?.result as ArrayBuffer))
            const data = ev.target?.result as ArrayBuffer
            handleFileChange(data)
          }
          fileReader.readAsArrayBuffer(e.target.files[0])
        }}
      />
      <input
        type="file"
        accept=".txt"
        id="saveFileInputUnencrypted"
        className="hidden"
        onChange={(e) => {
          if (!e.target.files?.[0]) return
          const fileReader = new FileReader()
          fileReader.onload = (ev: ProgressEvent<FileReader>) => {
            props.stateSetter(JSON.parse(ev.target?.result as string))
          }
          fileReader.readAsText(e.target.files[0])
        }}
      />
    </>
  )
}

export default FileLoader
