const express = require('express');
const { graphqlHTTP } = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const port = 3080;
const app = express();

const producers = [
	{ id: 1, name: 'FurnituresOnDemand' },
	{ id: 2, name: 'All for Computers' },
	{ id: 3, name: 'MyIT' }
]

const items = [
	{ id: 1, name: 'Shelf', producerId: 1 },
	{ id: 2, name: 'Chair', producerId: 1 },
	{ id: 3, name: 'Desk', producerId: 1 },
	{ id: 4, name: 'Docking Station', producerId: 2 },
	{ id: 5, name: 'Mouse', producerId: 2 },
	{ id: 6, name: 'Keyboard', producerId: 2 },
	{ id: 7, name: 'Laptop X', producerId: 3 },
	{ id: 8, name: 'SmartPhone12', producerId: 3 }
]

const ItemType = new GraphQLObjectType({
  name: 'Item',
  description: 'This represents a item of the inventory',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    producerId: { type: GraphQLNonNull(GraphQLInt) },
    producer: {
      type: ProducerType,
      resolve: (item) => {
        return producers.find(producer => producer.id === item.producerId)
      }
    }
  })
})

const ProducerType = new GraphQLObjectType({
  name: 'Producer',
  description: 'This represents a producer of a item',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    items: {
      type: new GraphQLList(ItemType),
      resolve: (producer) => {
        return items.filter(item => item.producerId === producer.id)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    item: {
      type: ItemType,
      description: 'A Single I  tem',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => items.find(item => item.id === args.id)
    },
    items: {
      type: new GraphQLList(ItemType),
      description: 'List of All Items',
      resolve: () => items
    },
    producers: {
      type: new GraphQLList(ProducerType),
      description: 'List of All Producers',
      resolve: () => producers
    },
    producer: {
      type: ProducerType,
      description: 'A Single Producer',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => producers.find(producer => producer.id === args.id)
    }
  })
})


const schema = new GraphQLSchema({
  query: RootQueryType,
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.listen(port, () => console.log(`Server listening on the port:${port}`));
