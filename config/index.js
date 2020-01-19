const urls = {
  dev: 'http://192.168.1.16:80/',
  prod: '',
}

const isProduction = process.env.NODE_ENV === 'production'
const baseUrl = urls[isProduction ? 'prod' : 'dev']

export {
	baseUrl
}
