const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("contractor123", 12);
  const result = await prisma.user.updateMany({
    where: { email: "jason@jbconstruction.com" },
    data: { passwordHash: hash }
  });
  console.log("Updated users:", result.count);
}

main()
  .then(function() { return prisma.$disconnect(); })
  .catch(function(e) { console.error(e); process.exit(1); });