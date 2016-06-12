import React from 'react'
import { render } from 'react-dom'
import { addTypenameToSelectionSet } from 'apollo-client/queries/queryTransform'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-apollo'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import routes from '../modules/routes'

const url = 'http://localhost:8085/'
const networkInterface = createNetworkInterface(url)

const client = new ApolloClient({
  networkInterface,
  queryTransformer: addTypenameToSelectionSet,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) {
      return result.__typename + '-' + result.id
    }
  }
})

render(
  (
    <Provider client={client}>
      <Router history={browserHistory} routes={routes}/>
    </Provider>
  ),
  document.getElementById('app')
)
