// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

    // get runtime config
    const config = useRuntimeConfig()

    // handle query params (GET)
    let { limit, page, seq, seqname } = getQuery(event);

    if (!seq && !seqname) {
        setResponseStatus(event, 404)
        return { message: 'No seq or seqname provided' }
    }

    if(!limit) limit = 10;
    if(!page) page = 1;

    let uri
    if(seq)
        uri = `${config.public.externalApi}v1/projects?query={"metadata.SEQUENCES.0":{"$regex":"${seq}"}}&limit=${limit}&page=${page}`
    else if(seqname)
        uri = `${config.public.externalApi}v1/projects?query={"metadata.NAME":{"$regex":"${seqname}"}}&limit=${limit}&page=${page}`

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