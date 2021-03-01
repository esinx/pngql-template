declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production"
			PORT?: string
			JWT_PUBLIC_KEY_PATH: string
			JWT_PRIVATE_KEY_PATH: string
		}
	}
}

export {}
