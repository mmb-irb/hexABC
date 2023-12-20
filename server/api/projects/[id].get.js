// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

    const { id } = event.context.params

    const uri = `https://bioexcel-cv19.bsc.es/api/rest/v1/projects/${id}`

    const data = await $fetch(uri)

    return {
        data
    }

 });