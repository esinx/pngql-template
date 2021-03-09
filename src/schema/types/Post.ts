import {
	extendType,
	list,
	mutationField,
	nonNull,
	objectType,
	queryField,
	stringArg,
} from 'nexus'

import { User } from './User'

// =================== Type =========================

export const Post = objectType({
	name: 'Post',
	definition: (t) => {
		t.nonNull.id('id')
		t.nonNull.string('title')
		t.nonNull.string('content')
		t.nonNull.int('date')
		t.nonNull.field('author', {
			type: User,
			resolve: async ({ id, authorId }, _, { prisma }) => {
				const user = await prisma.user.findUnique({
					where: {
						id: authorId,
					},
				})
				if (!user) throw new Error(`Author user for post(${id}) not found`)
				return user
			},
		})
	},
})

export const UserPosts = extendType({
	type: 'User',
	definition: (t) => {
		t.list.nonNull.field('posts', {
			type: Post,
			resolve: ({ id }, _, { prisma }) =>
				prisma.post.findMany({ where: { authorId: id } }),
		})
	},
})

export const CreatePosts = mutationField('createPost', {
	type: 'String',
	args: {
		title: nonNull(stringArg()),
		content: nonNull(stringArg()),
	},
	authorize: (_, __, { jwt }) => jwt.authorized,
	resolve: async (_, { title, content }, { prisma, jwt }) => {
		const post = await prisma.post.create({
			data: {
				authorId: jwt.payload!.id,
				title,
				content,
				date: new Date().getTime(),
			},
		})
		return post.id
	},
})

export const AllPosts = queryField('posts', {
	type: list(nonNull(Post)),
	resolve: async (_, __, { prisma }) => prisma.post.findMany(),
})
