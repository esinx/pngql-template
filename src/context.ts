import { PrismaClient } from "@prisma/client"
import type { ServerConfig } from "./server"
import type { Request } from "express"
import SignJWT from "jose/jwt/sign"
import jwtVerify from "jose/jwt/verify"
import type { KeyObject } from "crypto"

export interface Context {
	req: Request
	prisma: PrismaClient
	config: ServerConfig
	jwt: {
		sign: (payload: any) => Promise<string>
		authorized: boolean
		payload?: any
	}
}

const signJWT = (privateKey: KeyObject, payload: any) =>
	new SignJWT({
		...payload
	})
		.setProtectedHeader({
			alg: "RS256"
		})
		.setIssuedAt()
		.setExpirationTime("1y")
		.setIssuer("template:pngql:example")
		.setAudience("template:pngql:example")
		.sign(privateKey)

const verifyJWT = async (publicKey: KeyObject, token: string) =>
	(
		await jwtVerify(token, publicKey, {
			clockTolerance: 20,
			issuer: "template:pngql:example",
			audience: "template:pngql:example"
		})
	).payload

const createContext = (
	config: ServerConfig
): ((arg: { req: Request }) => Promise<Context>) => async ({ req }) => {
	const token = req.headers.authorization
	const payload = token ? await verifyJWT(config.jwtKey.public, token) : null
	return {
		req,
		prisma: new PrismaClient(),
		config,
		jwt: {
			payload,
			authorized: !!payload,
			sign: payload => signJWT(config.jwtKey.private, payload)
		}
	}
}

export default createContext
