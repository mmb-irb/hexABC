// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get runtime config
	const config = useRuntimeConfig()

	// get project id
	const { id, type } = event.context.params

	// get rmsds data
	const uri = `${config.public.externalApi}v1/projects/${id}/analyses/rmsds`
	const response = await $fetch(uri)
							.catch((error) => {
									setResponseStatus(event, error.status)
									return { message: error.message }
							});

	// get data by type
	const r = response.data.filter(item => item.reference === type)[0]

	// Step 1: Calculate the mean
	const mean = r.values.reduce((acc, value) => acc + value, 0) / r.values.length;

	// Step 2: Calculate the squared differences
	const squaredDiff = r.values.map(value => Math.pow(value - mean, 2));

	// Step 3: Calculate the mean of the squared differences
	const meanSquaredDiff = squaredDiff.reduce((acc, value) => acc + value, 0) / squaredDiff.length;

	// Step 4: Take the square root to get the standard deviation
	const stdDeviation = Math.sqrt(meanSquaredDiff);

	return {
		mean: Number(mean.toFixed(2)),
  	stdev: Number(stdDeviation.toFixed(2)),
		rmsd: r.values,
	}

 });