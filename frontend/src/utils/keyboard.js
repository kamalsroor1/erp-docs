/**
 * Keyboard shortcuts utility for ERP forms
 */
export const useKeyboardShortcuts = (actions) => {
  const handleKeyDown = (event) => {
    // F9: Save/Post
    if (event.key === 'F9') {
      event.preventDefault()
      actions.onSave?.()
    }
    
    // F2: Search
    if (event.key === 'F2') {
      event.preventDefault()
      actions.onSearch?.()
    }
    
    // Esc: Cancel/Close
    if (event.key === 'Escape') {
      actions.onCancel?.()
    }
    
    // Enter: Navigate (If not on a button/textarea)
    if (event.key === 'Enter' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'TEXTAREA') {
      // Logic for Enter-to-Tab is complex in modern web, 
      // but we can emit a custom action or handle specifically
      actions.onEnter?.()
    }
  }

  const register = () => {
    window.addEventListener('keydown', handleKeyDown)
  }

  const unregister = () => {
    window.removeEventListener('keydown', handleKeyDown)
  }

  return { register, unregister }
}
