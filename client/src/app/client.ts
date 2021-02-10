import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import store from './store'

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URI ?? 'http://localhost:4000/graphql/',
})

const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    const token = store.getState().user.token
    return {
        cors: {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true,
        },
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({}),
})

export default client
