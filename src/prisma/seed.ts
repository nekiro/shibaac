import prisma from '.';

async function main() {
  let createdAccount = await prisma.accounts.findUnique({
    where: { name: 'nekiro' },
  });

  if (!createdAccount) {
    createdAccount = await prisma.accounts.create({
      data: {
        name: 'nekiro',
        password: '1448f93979c89c4e6e8664df211b40ace882f6d5',
        email: 'nekirodev@dev.com',
        twoFAEnabled: false,
      },
    });
  }

  let createdPlayer = await prisma.players.findUnique({
    where: { name: 'Nekiro' },
  });

  if (!createdPlayer) {
    createdPlayer = await prisma.players.create({
      data: {
        name: 'Nekiro',
        account_id: createdAccount.id,
        vocation: 0,
        sex: 1,
      },
    });
  }

  const existingNews = await prisma.aac_news.findFirst({
    where: { title: 'Welcome' },
  });

  if (!existingNews) {
    await prisma.aac_news.create({
      data: {
        title: 'Welcome',
        content: 'Welcome to shibaac...',
        imageUrl: '',
        authorId: createdPlayer.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
