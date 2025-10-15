import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const uri = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:2009/graphql';

const httpLink = new HttpLink({
    uri,
    credentials: 'include',
    headers:{
        authorization: `Bearer ${localStorage.getItem('token')}`,
    }
});

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});


