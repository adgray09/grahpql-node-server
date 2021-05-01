const { PrismaClient } = require('@prisma/client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime');
const prisma = new PrismaClient();

async function main() {
    const newLink = await prisma.link.create({
        data: {
            description: 'Fullstack tutorial for Graphql',
            url: 'www.howtographql.com',
        },
    })
    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}

main().catch(e => {
    throw e
}).finally(async () => {
    await prisma.$disconnect()
})