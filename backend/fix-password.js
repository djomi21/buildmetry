const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Usage: node fix-password.js [email] [new-password]
// Defaults: jason@jbconstruction.com / contractor123

const email = process.argv[2] || "jason@jbconstruction.com";
const password = process.argv[3] || "contractor123";

async function main() {
  const hash = await bcrypt.hash(password, 12);
  const result = await prisma.user.updateMany({
    where: { email: email },
    data: { passwordHash: hash }
  });
  if (result.count > 0) {
    console.log("Password updated for: " + email);
  } else {
    console.log("No user found with email: " + email);
  }
}

main()
  .then(function() { return prisma.$disconnect(); })
  .catch(function(e) { console.error(e); process.exit(1); });
