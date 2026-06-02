import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { copyToClipboard } from '../utils'

export function useGenerate(generatorFn) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const generate = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    try {
      const result = await generatorFn(params)
      setData(result.data || result)
      return result.data || result
    } catch (err) {
      const msg = err.message || 'Generation failed'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [generatorFn])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { loading, data, error, generate, reset }
}

export function useCopy() {
  const [copied, setCopied] = useState(null)

  const copy = useCallback(async (text, id = 'default') => {
    try {
      await copyToClipboard(text)
      setCopied(id)
      toast.success('Copied!')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }, [])

  return { copied, copy }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = useCallback((newValue) => {
    setValue(newValue)
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch {}
  }, [key])

  return [value, set]
}
