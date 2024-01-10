// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

    const { id } = event.context.params

    const uri = `${process.env.MAIN_API_URL}projects/${id}`

    const data = await $fetch(uri)
                .catch((error) => {
                    setResponseStatus(event, 404)
                    return { message: error.message }
                });

    return {
        project: data
    }

 });