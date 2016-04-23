import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-apollo'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import routes from '../modules/routes'

const url = 'http://localhost:8085/'
const networkInterface = createNetworkInterface(url)

const client = new ApolloClient({
  networkInterface
})

render(
  (
    <Provider client={client}>
      <Router history={browserHistory} routes={routes}/>
    </Provider>
  ),
  document.getElementById('app')
)
