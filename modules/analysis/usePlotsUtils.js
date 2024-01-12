export default function usePlotsUtils() {

    /* HEATMAP */

    // recalcultae heatmap color scale
    const getColorScale = (values, colors) => {

        const colorscale = []
        const total = values.length

        let p1 = 0
        values.forEach((value, index) => {
            let p2 = parseFloat(((index  + 1) / total).toFixed(2))
            colorscale.push([p1, colors[value]])
            colorscale.push([p2, colors[value]])
            p1 = p2
        })

         return colorscale

    }

    // get heatmap colorbar text (brs are used to put numbers in the middle of the tick)
    const getColorBarText = (values) => {
        switch(values.length) {
            case 1:
                return [values[0]]
            case 2:
                return [`${values[0]}<br><br><br><br><br><br><br><br><br><br><br><br><br>`, `<br><br><br><br><br><br><br><br><br><br><br><br><br>${values[1]}`]
            case 3:
                if(values[1] === 1) return [`${values[0]}<br><br><br><br><br><br><br><br><br>`,`${values[1]}<br><br><br><br><br><br><br><br><br>`,`<br><br><br><br><br><br><br><br>${values[2]}`]
                if(values[1] === 2) return [`${values[0]}<br><br><br><br><br><br><br><br><br>`,`<br><br><br><br><br><br><br><br><br>${values[1]}`,`<br><br><br><br><br><br><br><br>${values[2]}`]
                else return [`${values[0]}<br><br><br><br><br><br><br><br><br>`,`${values[1]}`,`<br><br><br><br><br><br><br><br>${values[2]}`]
            case 4:
                return [`${values[0]}<br><br><br><br><br><br><br>`,`${values[1]}<br><br>`,`<br><br>${values[2]}`, `<br><br><br><br><br><br><br>${values[3]}`]
        }
    }

    // get unique values from heatmap data
    const getHMUniqueValues = (values) => {
        return values.reduce((result, subarray) => {
            subarray.forEach(value => {
              if (!result.includes(value)) {
                result.push(value);
              }
            });
            return result.sort();
        }, []);
    }

    return {
        getColorScale,
        getColorBarText,
        getHMUniqueValues
    }

}