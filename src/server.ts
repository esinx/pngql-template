import http from 'http'
import type crypto from 'crypto'
import express, { RequestHandler } from 'express'
import { ApolloServer } from 'apollo-server-express'
import createContext from './context'
import schema from './schema'

export interface ServerConfig {
	jwtKey: {
		private: crypto.KeyObject
		public: crypto.KeyObject
	}
}

const cors = (_, res, next): RequestHandler => {
	res.header('Access-Control-Allow-Origin', '*')
	return next()
}

const createServer = async (config: ServerConfig): Promise<http.Server> => {
	const app = express()
	const apolloServer = new ApolloServer({
		schema,
		context: createContext(config),
	})
	app.use(cors)
	apolloServer.applyMiddleware({ app })
	const httpServer = http.createServer(app)
	return httpServer
}

export default createServer
