// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get runtime config
	const config = useRuntimeConfig()

	// get project id
	const { id } = event.context.params

  // handle query params (GET)
  let { res } = getQuery(event);

	// get sasa data
	const uri = `${config.public.externalApi}v1/projects/${id}/analyses/sasa`
	const response = await $fetch(uri)
							.catch((error) => {
									setResponseStatus(event, error.status)
									return { message: error.message }
							});

	// discarding null values
	let r = response.saspf.filter(item => item !== null)
  let m = response.means.filter(item => item !== null)

  // if res is defined, filter the response
  if(res) {
    const residues = res.split(',').map(Number)
    r = residues.map(index => r[index - 1]);
  }

  // if res is an invalid value, return the whole response
  if(r === undefined) r = response.saspf.filter(item => item !== null)

	return {
		step: response.step,
    means: m,
		sasa: r 
	}

 });