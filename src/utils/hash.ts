import bcrypt from 'bcrypt'

export const create = async (password: string): Promise<string> =>
	new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, (err, res) => {
			if (err) return reject(err)
			resolve(res)
		})
	})

export const compare = async (
	password: string,
	hash: string,
): Promise<boolean> =>
	new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, (err, res) => {
			if (err) return reject(err)
			resolve(res)
		})
	})
