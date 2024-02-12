// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get runtime config
	const config = useRuntimeConfig()

	// get project id
	const { id, type } = event.context.params

	// get rmsds data
	const uri = `${config.public.externalApi}v1/projects/${id}/analyses/rmsd-pairwise`
	const response = await $fetch(uri)
							.catch((error) => {
									setResponseStatus(event, error.status)
									return { message: error.message }
							});

	// get data by type
	const r = response.data.filter(item => item.name === 'Overall')[0]

	return {
		step: response.step,
		rmsd: r.rmsds
	}

 });