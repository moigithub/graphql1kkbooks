// server.js
// where your node app starts



const { ApolloServer, gql } = require ('apollo-server')
const faker =require( 'faker')

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [];
 
// generate 1million data \o/
for (let i = 0; i < 1000000; i++){
  books.push({
    id: i,
    title:faker.name.jobTitle(),
    author:faker.name.findName()
  })
}

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    id: Int,
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  type Query {
    books(
      page: Int,
      count: Int
    ): [Book],

    book(id: Int!): Book
  }
 
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    book:(parentObj, args, context, schema)=>{
      if (books[args.id]) return books[args.id]
      else return null
    },
    books: (parentObj, args, context, schema) =>{
      // console.log("parentObj",parentObj,"args",args,"context",context)
      let page=0
      let count=10
      if(args.page){
        page = args.page
      }
      if(args.count){ count=args.count}
      let start = page*count
      let stop = start + count
      return books.slice(start, stop)
    } 
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

 