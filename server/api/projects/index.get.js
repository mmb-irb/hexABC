// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

    // handle query params (GET)
    let { limit, page } = getQuery(event);

    if(!limit) limit = 10;
    if(!page) page = 1;

    // analyses not working
    //const uri = `https://bioexcel-cv19.bsc.es/api/rest/v1/projects?projection={"accession":1,"metadata.NAME":1,"metadata.UNIT":1,"analyses":1}&limit=${limit}&page=${page}`

    const uri = `https://bioexcel-cv19.bsc.es/api/rest/v1/projects?limit=${limit}&page=${page}`

    const data = await $fetch(uri)

    const response = data.projects.map((item) => ({
        accession: item.accession, 
        name: item.metadata.NAME,
        unit: item.metadata.UNIT,
        analyses: item.analyses
    }))

    return {
        total: data.filteredCount,
        projects: response
    }

 });