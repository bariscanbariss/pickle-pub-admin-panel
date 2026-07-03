const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const adminUsername = 'admin'
  const adminPassword = 'password' // Change this later in production
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(adminPassword, salt)

  // Sadece eğer admin yoksa ekle
  const existingAdmin = await prisma.admin_users.findUnique({
    where: { username: adminUsername }
  })

  if (!existingAdmin) {
    await prisma.admin_users.create({
      data: {
        username: adminUsername,
        password_hash: passwordHash,
      }
    })
    console.log('✅ Admin kullanıcısı oluşturuldu (Kullanıcı adı: admin, Şifre: password)')
  } else {
    console.log('ℹ️ Admin kullanıcısı zaten mevcut.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
