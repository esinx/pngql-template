import * as hash from "~/utils/hash"
import {
	idArg,
	mutationField,
	nonNull,
	objectType,
	queryField,
	stringArg
} from "nexus"

export const User = objectType({
	name: "User",
	definition: t => {
		t.nonNull.id("id")
		t.nonNull.string("name")
	}
})

export const UserAuth = queryField("signIn", {
	type: "String",
	args: {
		id: nonNull(idArg()),
		password: nonNull(stringArg())
	},
	resolve: async ({}, { id, password }, { prisma, jwt }) => {
		const user = await prisma.user.findUnique({ where: { id } })
		if (!user) throw new Error(`User with id: ${id} does not exist`)
		const pass = await hash.compare(password, user.password)
		if (!pass) throw new Error(`Incorrect password`)
		const token = await jwt.sign({ id })
		return token
	}
})

export const UserCreate = mutationField("signUp", {
	type: "String",
	args: {
		id: nonNull(idArg()),
		password: nonNull(stringArg()),
		name: nonNull(stringArg())
	},
	resolve: async ({}, { id, password, name }, { prisma, jwt }) => {
		const user = await prisma.user.findUnique({ where: { id } })
		if (user) throw new Error(`User with id: ${id} already exists`)
		const hashedPassword = await hash.create(password)
		await prisma.user.create({
			data: { id, password: hashedPassword, name }
		})
		const token = await jwt.sign({ id })
		return token
	}
})

export const UserMeta = queryField("me", {
	type: User,
	authorize: ({}, {}, { jwt }) => jwt.authorized,
	resolve: async ({}, {}, { prisma, jwt }) => {
		console.log({ jwt })
		const { id } = jwt.payload!
		const user = await prisma.user.findUnique({ where: { id } })
		if (!user) throw new Error(`User with id: ${id} does not exist`)
		return user
	}
})
