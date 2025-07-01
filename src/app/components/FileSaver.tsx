// import crypto from 'crypto'

interface DataObject {
  __type: string
  value: any
}

interface FileSaverProps {
  // data is an object with keys that are strings and values that are objects with the following shape:
  data: {
    [key: string]: DataObject
  }
}

const FileSaver = (props: FileSaverProps) => {
  return (
    <>
      <input
        type="button"
        id="saveFileOutput"
        className="hidden"
        onClick={async () => {
          const dataString = JSON.stringify(props.data, null, 2)
          const PASSWORD = 't36gref9u84y7f43g'
          const encoder = new TextEncoder()
          const iv = window.crypto.getRandomValues(new Uint8Array(16))
          const salt = iv // mirror FileLoader: use iv as salt
          try {
            // Derive key using PBKDF2
            const keyMaterial = await window.crypto.subtle.importKey(
              'raw',
              encoder.encode(PASSWORD),
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
              ['encrypt'],
            )
            // Encrypt
            const encryptedBuffer = await window.crypto.subtle.encrypt(
              { name: 'AES-CBC', iv },
              key,
              encoder.encode(dataString),
            )
            const ivAndEncrypted = new Uint8Array(
              iv.length + encryptedBuffer.byteLength,
            )
            ivAndEncrypted.set(iv, 0)
            ivAndEncrypted.set(new Uint8Array(encryptedBuffer), iv.length)
            const blob = new Blob([ivAndEncrypted], {
              type: 'application/octet-stream',
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'SaveFile.txt'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          } catch (e) {
            console.error('Encryption error:', e)
            alert('Failed to encrypt and save file.')
          }
        }}
      />
      <input
        type="button"
        id="saveFileOutputUnencrypted"
        className="hidden"
        onClick={() => {
          const dataString = JSON.stringify(props.data, null, 2)
          const blob = new Blob([dataString], { type: 'text/plain' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'SaveFile.unencrypted.txt'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }}
      />
    </>
  )
}

export default FileSaver
