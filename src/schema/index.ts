import path from 'path'
import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import * as types from './types'

const PROJECT_ROOT = path.resolve(__dirname, '../../')

export default makeSchema({
	types,
	plugins: [fieldAuthorizePlugin()],
	sourceTypes: {
		modules: [
			{
				module: path.resolve(
					PROJECT_ROOT,
					'./node_modules/.prisma/client/index.d.ts',
				),
				alias: 'prisma',
			},
		],
	},
	outputs: {
		typegen: path.resolve(
			PROJECT_ROOT,
			'./node_modules/@types/nexus-typegen/index.d.ts',
		),
		schema: path.join(PROJECT_ROOT, './schema.generated.graphql'),
	},
	contextType: {
		module: require.resolve('../context'),
		export: 'ServerContext',
	},
})
