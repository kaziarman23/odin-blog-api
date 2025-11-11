const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();


async function main() {
const pw = await bcrypt.hash('password123', 10);
await prisma.user.upsert({
where: { email: 'admin@example.com' },
update: {},
create: {
email: 'admin@example.com',
username: 'admin',
password: pw,
role: 'ADMIN'
}
});
console.log('Seeded admin@example.com / password123');
}


main()
.catch(e => { console.error(e); process.exit(1); })
.finally(() => prisma.$disconnect());