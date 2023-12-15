export default defineEventHandler(async (event) => { 

    const { code } = event.context.params

    //const { tokenExample } = useRuntimeConfig()
    //console.log(tokenExample)

    /*const uri = `https://mmb.irbbarcelona.org/3dRS/api/v1/download/${code}`

    const data = await $fetch(uri)  

    //const response = JSON.parse(await data.text())

    return data*/

    return {
        message: `Hello! You are 564 years old.`
    }

 });