const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'password' 
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
    console.log(`✅ Admin kullanıcısı oluşturuldu (Kullanıcı adı: ${adminUsername}, Şifre: ${adminPassword})`)
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
