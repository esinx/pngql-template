import "dotenv/config"
import crypto from "crypto"
import fs from "fs"
import createServer from "./server"

const main = async () => {
	try {
		const {
			PORT = 3000,
			JWT_PUBLIC_KEY_PATH,
			JWT_PRIVATE_KEY_PATH
		} = process.env
		if (!JWT_PRIVATE_KEY_PATH || !JWT_PRIVATE_KEY_PATH) {
			throw new Error("Missing JWT Keys.")
		}
		const server = await createServer({
			jwtKey: {
				private: crypto.createPrivateKey({
					key: fs.readFileSync(JWT_PRIVATE_KEY_PATH)
				}),
				public: crypto.createPublicKey({
					key: fs.readFileSync(JWT_PUBLIC_KEY_PATH)
				})
			}
		})
		server.listen(PORT, () => {
			console.log(`> Listening on 0.0.0.0:${PORT}`)
		})
	} catch (error) {
		console.error(error)
	}
}

main()
