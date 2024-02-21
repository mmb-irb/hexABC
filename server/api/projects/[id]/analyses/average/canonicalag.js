// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get runtime config
	const config = useRuntimeConfig()

	// get project id
	const { id } = event.context.params

	console.log( id, 'Canonical Alpha Gamma' )

	return {

	}

 });