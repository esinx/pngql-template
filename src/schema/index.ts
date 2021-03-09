import path from 'path'
import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import * as types from './types'

export default makeSchema({
	types,
	plugins: [fieldAuthorizePlugin()],
	sourceTypes: {
		modules: [
			{
				module: path.resolve(
					__dirname,
					'../../node_modules/.prisma/client/index.d.ts',
				),
				alias: 'prisma',
			},
		],
	},
	outputs: {
		typegen: path.resolve(
			__dirname,
			'../../node_modules/@types/nexus-typegen/index.d.ts',
		),
		schema: path.join(__dirname, './schema.graphql'),
	},
	contextType: {
		module: require.resolve('../context'),
		export: 'ServerContext',
	},
})
