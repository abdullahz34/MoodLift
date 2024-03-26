import { useState, useEffect, useRef } from "react"
import "./dropdown.css"

const Dropdown = (props) => {
  const [toggled, setToggled] = useState(false)
  const [selection, setSelection] = useState(null)
  const dropdownRef = useRef(null)

  const handleTypeChange = (e) => {
    props.setType(selection)
  }

  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current) {
        if (!dropdownRef.current.contains(e.target)) {
          setToggled(false)
        }
      }
    }

    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler)
    }
  })

  const dropdownOptions = [
    {
      id: 1,
      label: "Ambassador",
      value: "Ambassador"
    },

    {
      id: 2,
      label: "Employee",
      value: "Employee"
    }
  ]

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button 
        className="toggle"
        onClick={(e) => {
          e.preventDefault()
          setToggled(!toggled)
        }}
        onChange={handleTypeChange}
      >
        <span>{selection ? selection.label : "type"}</span>
        <span>{toggled ? '^' : 'v'}</span>
      </button>
      <div className={`options ${toggled ? "visible" : ""}`}>
        {dropdownOptions.map((option, index) => {
          return (
            <button onClick={() => {
              setSelection(option)
              setToggled(false)
            }}>{option.label}</button>
          )
        })}
      </div>
    </div>
  )
}

export default Dropdown