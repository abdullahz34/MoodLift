import { useState, useEffect, useRef } from "react"
import "./dropdown.css"

const DropdownType = (props) => {
  const [toggled, setToggled] = useState(false)
  const [selection, setSelection] = useState(null)
  const dropdownRef = useRef(null)


  useEffect(() => {
    function handler(e) {
      e.preventDefault()
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
  },)

  const handleTypeChange = (option) => {
    setSelection(option)
    props.setType(option.value)
    setToggled(false)
  }

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
        <span>{toggled ? '-' : '+'}</span>
      </button>
      <div className={`options ${toggled ? "visible" : ""}`}>
        {dropdownOptions.map((option, index) => {
          return (
            <button key={option.id} onClick={() => {
                handleTypeChange(option)
            }}>{option.label}</button>
          )
        })}
      </div>
    </div>
  )
}

export default DropdownType