import { StatusCd } from '../app/generated/prisma/index'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma'
// this is depracated, will be removed in the future
async function main() {
    // 创建一个用户
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: '    ',
            name: 'Test',
            password: bcrypt.hashSync('password123', 10),
        },
    })
    console.log(`Created user: ${user.name} with ID: ${user.id}`)
    // 创建一个长期计划
    const plan = await prisma.plan.create({
        data: {
            title: '跑半马训练计划',
            description: '12 周内完成半程马拉松训练',
            status: StatusCd.IN_PROGRESS,
            userId: user.id,
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 三个月后
            priority: 1,
            conversationId: 0, // 假设没有关联的对话
        },
    })
    console.log(`Created plan: ${plan.title} with ID: ${plan.id}`)
    // 给这个计划加几个子任务
    await prisma.task.createMany({
        data: [
            {
                title: '第 1 周：基础有氧跑',
                status: StatusCd.PENDING,
                userId: user.id,
                planId: plan.id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                priority: 2,
                conversationId: 0, // 假设没有关联的对话
            },
            {
                title: '第 2 周：力量训练',
                status: StatusCd.PENDING,
                userId: user.id,
                planId: plan.id,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                priority: 2,
                conversationId: 0, // 假设没有关联的对话
            },
        ],
    })
    console.log(`Created tasks for plan: ${plan.title}`)
    // 创建两个独立的短期任务
    await prisma.task.createMany({
        data: [
            {
                title: '本周阅读一本书',
                status: StatusCd.IN_PROGRESS,
                userId: user.id,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                priority: 3,
                conversationId: 0, // 假设没有关联的对话
            },
            {
                title: '更新个人博客',
                status: StatusCd.PENDING,
                userId: user.id,
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                priority: 2,
                conversationId: 0, // 假设没有关联的对话
            },
        ],
    })
    console.log('Created independent tasks for user:', user.name)
}

main()
    .then(async () => {
        console.log('Seeding completed successfully.')
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
