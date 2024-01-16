let settings = reactive({
    currMenuSection: null
})

// navigation for settings module
export default function structureSettings() {

    const setProperty = (prop, val) => {
        settings[prop] = val
    }

    const getProperty = (prop) => {
        return settings[prop]
    }

    return {
        settings,
        setProperty,
        getProperty
    }
}