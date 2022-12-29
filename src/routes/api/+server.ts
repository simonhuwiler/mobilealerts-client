import { json } from '@sveltejs/kit';

const headers:any = new Headers({
	'Content-Type': 'application/json',
	// 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
	'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 6.0; Android SDK built for x86 Build/MASTER)',
	'Host': 'www.data199.com',
	'Accept-Encoding': 'gzip',
})

/** @type {import('./$types').POST} */
export function POST(post:any)
{
	return post.request.json()
	  .then((payload:any) => {

			// Now Fetch Mobile Alerts Api

			return fetch('https://www.data199.com/api/v1/dashboard', {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(payload)
			})
			.then((response:any) => response.json())
			.then((response:any) => {

				// Return the result
				return new Response(JSON.stringify(response), {
					headers: {
						'Content-Type': 'application/json'
					}
				})

			})	 
			.catch(e => {
				console.log("SERVER ERROR")
				console.log(e)
			})
	})
}