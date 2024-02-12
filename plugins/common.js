export default defineNuxtPlugin(() => {
  
	const sleep = ms => new Promise(r => setTimeout(r, ms) )

	return {
	  provide: {
			sleep
		}	
	}
})


