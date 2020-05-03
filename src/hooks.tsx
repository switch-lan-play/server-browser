import React, { useEffect, useState } from 'react'
import Alert from '@material-ui/lab/Alert'
import CircularProgress from '@material-ui/core/CircularProgress'
import { ApolloError } from '@apollo/client'

interface QueryResult<TData, TVariables> {
  error?: ApolloError
  loading: boolean
  data?: TData
}

export function useResult<TData, TVariables>(result: QueryResult<TData, TVariables>, onData: (data: TData) => React.ReactNode) {
  const { error, loading, data } = result
  if (data) {
    return <>
      { onData(data!) }
    </>
  }
  if (error) {
    return <Alert severity='error'>{error.message}</Alert>
  }
  if (loading) {
    return <CircularProgress />
  }
  return <></>
}

interface PingOptions {
  server: string
  interval?: number
  timeout?: number
}
interface PingResult {
  ping: number
  updateAt: Date
}
const PingText = `{"id":"1","type":"start","payload":{"variables":{},"extensions":{},"operationName":null,"query":"subscription{serverInfo{idle}}"}}`
export function usePing({ server, interval = 10 * 1000, timeout = 10 * 1000}: PingOptions) {
  const [ result, setResult ] = useState<PingResult | undefined>(undefined)
  const [ hidden, setHidden ] = useState(false)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setHidden(document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibilityChange, false)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
  useEffect(() => {
    console.log('hidden', hidden)
    if (hidden) {
      return // do nothing
    }
    let abort = () => {}
    const ping = () => new Promise<number>((res, rej) => {
      setTimeout(() => rej(new Error('timeout')), timeout)
      let timeoutId: number | undefined = undefined
      let lastTime: Date | undefined = undefined
      const ws = new WebSocket(`ws://${server}`, 'graphql-ws')
      abort = () => {
        ws.close()
        timeoutId && window.clearTimeout(timeoutId)
      }
      ws.onmessage = e => {
        const data = JSON.parse(e.data)
        if (data.type === 'data' && data.id === '1') {
          let delta = Date.now() - lastTime!.getTime()
          res(delta)
          ws.send(`{"id":"1","type":"stop"}`)
          ws.close()
        }
      }
      ws.onclose = () => {
        abort()
      }
      ws.onerror = e => {
        rej(e)
        abort()
      }
      ws.onopen = () => {
        ws.send(`{"type":"connection_init","payload":{}}`)
        timeoutId = window.setTimeout(() => {
          ws.send(PingText)
          lastTime = new Date()
        }, 100)
      }
    }).then(ping => setResult({
      ping,
      updateAt: new Date()
    }), e => console.error(e))
    if (interval > 0) {
      let id: number | undefined = undefined
      const run = async () => {
        await ping()
        id = window.setTimeout(run, interval)
      }
      run()
      return () => {
        window.clearInterval(id)
        abort()
      }
    } else {
      ping()
      return () => {
        abort()
      }
    }
  }, [ server, timeout, interval, hidden ])

  return result
}
