import { useState, useEffect } from 'react'
import bus from '../../utils/bus'
import './FlashMessage.css'

function FlashMessage() {
  const [visibility, setVisibility] = useState(false)
  const [message, setMessage]       = useState('')
  const [type, setType]             = useState('')

  useEffect(() => {
    bus.on('flash', ({ message, type }) => {
      setVisibility(true)
      setMessage(message)
      setType(type)
      setTimeout(() => setVisibility(false), 3500)
    })
  }, [])

  return visibility ? (
    <div className={`flash-message flash-${type}`}>
      <p>{message}</p>
    </div>
  ) : null
}

export default FlashMessage
