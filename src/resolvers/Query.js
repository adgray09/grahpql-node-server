async function feed(parent, args, context, info) {
    const where = args.filter
        ? {
            OR: [
                { description: { contains: args.filter } },
                { url: { contains: args.filter } },
            ],
        }
        : {}
    const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy,
    })

    const counts = await context.prisma.link.count({ where })

    return {
        links,
        counts
    }
}

module.exports = {
    feed,
}