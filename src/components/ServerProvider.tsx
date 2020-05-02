import React, { useMemo, createContext, useContext } from 'react'
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'

type ServerProviderProps = {
  server: string
}

const ServerCtx = createContext<ServerProviderProps>({
  server: ''
})

export const useServer = () => {
  return useContext(ServerCtx)
}

export const ServerProvider: React.FC<ServerProviderProps> = ({ children, server }) => {
  const client = useMemo(() => {
    const httpLink = new HttpLink({
      uri: `http://${server}/`
    })
    const wsLink =  new WebSocketLink({
      uri: `ws://${server}/`,
      options: {
        reconnect: true,
      }
    })
    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink,
    )

    return new ApolloClient({
      cache: new InMemoryCache(),
      link,
    })
  }, [ server ])

  return <>
    <ApolloProvider client={client}>
      <ServerCtx.Provider value={{ server }}>
        { children }
      </ServerCtx.Provider>
    </ApolloProvider>
  </>
}
