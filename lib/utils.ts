export function parsePath(path:string) {
	let params = {}
	var x = path.split('/')
	x = x.map((segment, index) => {
		if (segment.startsWith(':')) {
			let paramName = segment.replace(':', '')
			params[paramName] = index
			return `([^\\/]+)`
		}
		return segment
	})
	return {
		re: new RegExp('^' + x.join('\\/') + '$', 'i'),
		params
	}
}

export function parseCookies(cookie_header:string) {
	var cookies = {}
	cookie_header.split(';').forEach(function(cookie) {
		var parts = cookie.match(/(.*?)=(.*)$/) || ['', '']
		cookies[parts[1].trim()] = decodeURIComponent((parts[2] || '').trim())
	})
	return cookies
}