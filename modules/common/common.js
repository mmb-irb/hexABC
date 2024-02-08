export default function common() {

	const sleep = ms => new Promise(r => setTimeout(r, ms) )

	return {
			sleep
	}

}