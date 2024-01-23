// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

    // get runtime config
    const config = useRuntimeConfig()

    // handle query params (GET)
    let { limit, page, seq } = getQuery(event);

    if(!limit) limit = 10;
    if(!page) page = 1;

    const uri = `${config.public.externalApi}v1/projects?query={"metadata.SEQUENCES.0":{"$regex":"${seq}"}}&limit=${limit}&page=${page}`

    let data
    try {
        data = await $fetch(uri)
    } catch (error) {
        setResponseStatus(event, error.status)
        return { message: error.message }
    }

    const response = data.projects.map((item) => ({
        id: item.identifier,
        accession: item.accession, 
        name: item.metadata.NAME,
        sequences: item.metadata.SEQUENCES,
        analyses: item.analyses
    }))

    return {
        total: data.filteredCount,
        projects: response
    }

 });