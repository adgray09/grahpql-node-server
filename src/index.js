const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');
const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
    Query: {
        info: () => `this is the API of a HackerNews Clone`,
        feed: async (parent, args, context, info) => {
            return context.prisma.link.findMany()
        },
        link: (_, args) => {
            const link = links.find(link => link.id === args.id)
            return link
        }
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
            return newLink
        },
        updateLink: (parent, args) => {
            links.forEach((link) => {
                if (link.id === args.id) {
                    link.id = args.id;
                    link.url = args.url
                    link.description = args.description
                }
                return link
            })
        },
        deleteLink: (parent, args) => {
            const removeIndex = links.findIndex(item => item.id === args.id);
            const removedLink = links[removeIndex];
            links.splice(removeIndex, 1);

            return removedLink
        }
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        };
    }
});

server.listen().then(({ url }) => {
    console.log(`Server is running on ${url}`)
});

