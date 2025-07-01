/*
 eg:
 "ThermometerInventory": {
    "__type": "int",
    "value": 2
  },
*/

interface DataObject {
  __type: string
  value: any
}

interface EditorProps {
  // data is an object with keys that are strings and values that are objects with the following shape:
  data: {
    [key: string]: DataObject
  }
}

// Grouping by contextually relevant categories
const groupByContext = (data: { [key: string]: DataObject }) => {
  const groups: { [group: string]: { key: string; dataObj: DataObject }[] } = {
    Equipment: [],
    Daily: [],
    Weekly: [],
    Player: [],
    Progress: [],
    Other: [],
  }
  Object.keys(data).forEach((key) => {
    const lower = key.toLowerCase()
    if (
      lower.includes('inventory') ||
      lower.includes('equipment') ||
      lower.includes('item') ||
      lower.includes('tool')
    ) {
      groups.Equipment.push({ key, dataObj: data[key] })
    } else if (lower.includes('daily')) {
      groups.Daily.push({ key, dataObj: data[key] })
    } else if (lower.includes('weekly')) {
      groups.Weekly.push({ key, dataObj: data[key] })
    } else if (
      lower.includes('player') ||
      lower.includes('name') ||
      lower.includes('level') ||
      lower.includes('prestige')
    ) {
      groups.Player.push({ key, dataObj: data[key] })
    } else if (
      lower.includes('progress') ||
      lower.includes('exp') ||
      lower.includes('experience') ||
      lower.includes('mission') ||
      lower.includes('objective')
    ) {
      groups.Progress.push({ key, dataObj: data[key] })
    } else {
      groups.Other.push({ key, dataObj: data[key] })
    }
  })
  // Remove empty groups
  Object.keys(groups).forEach((g) => {
    if (groups[g].length === 0) delete groups[g]
  })
  return groups
}

const Editor = (props: EditorProps) => {
  const grouped = groupByContext(props.data)
  return (
    <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {Object.keys(grouped).map((group) => (
        <div
          key={group}
          className="bg-slate-800/80 rounded-xl p-4 shadow flex flex-col gap-3 border border-slate-700 w-full"
        >
          <h2 className="text-lg font-bold mb-2 text-slate-200 border-b border-slate-600 pb-1">
            {group}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {grouped[group].map(({ key, dataObj }) => {
              let inputElement
              switch (dataObj.__type) {
                case 'int':
                  inputElement = (
                    <input
                      type="number"
                      id={key}
                      defaultValue={dataObj.value}
                      className="w-full bg-slate-900 p-2 rounded-lg outline-none border border-slate-700 focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => {
                        props.data[key].value = parseInt(e.target.value)
                      }}
                    />
                  )
                  break
                case 'float':
                  inputElement = (
                    <input
                      type="number"
                      id={key}
                      defaultValue={dataObj.value}
                      className="w-full bg-slate-900 p-2 rounded-lg outline-none border border-slate-700 focus:ring-2 focus:ring-purple-400"
                      onChange={(e) => {
                        props.data[key].value = parseFloat(e.target.value)
                      }}
                    />
                  )
                  break
                case 'bool':
                  inputElement = (
                    <select
                      id={key}
                      defaultValue={dataObj.value}
                      className="w-full bg-slate-900 p-2 rounded-lg outline-none border border-slate-700 focus:ring-2 focus:ring-pink-400"
                      onChange={(e) => {
                        props.data[key].value = e.target.value === 'true'
                      }}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  )
                  break
                default:
                  if (typeof dataObj.value === 'object') {
                    inputElement = (
                      <input
                        type="text"
                        id={key}
                        value={'Uneditable'}
                        disabled
                        className="w-full bg-red-900 p-2 rounded-lg outline-none cursor-not-allowed border border-slate-700"
                      />
                    )
                    break
                  }
                  inputElement = (
                    <input
                      type="text"
                      id={key}
                      defaultValue={dataObj.value}
                      className="w-full bg-slate-900 p-2 rounded-lg outline-none border border-slate-700 focus:ring-2 focus:ring-cyan-400"
                      onChange={(e) => {
                        props.data[key].value = e.target.value
                      }}
                    />
                  )
                  break
              }
              return (
                <div key={key} className="flex flex-col gap-1 min-w-0">
                  <label
                    htmlFor={key}
                    className="font-medium text-slate-300 mb-1 truncate break-all max-w-full"
                    title={key}
                  >
                    {key}
                  </label>
                  <div className="w-full min-w-0">{inputElement}</div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Editor
