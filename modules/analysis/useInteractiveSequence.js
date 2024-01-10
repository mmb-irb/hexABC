import { ref } from 'vue'

export default function useInteractiveSequence() {
    
    const calculateComplementaryStrand = (strand) => {
        const compStrand = strand.map((base) => {
            switch (base) {
                case 'A':
                    return 'T'
                case 'T':
                    return 'A'
                case 'C':
                    return 'G'
                case 'G':
                    return 'C'
            }
        })
        return compStrand
    }

    const getSequenceSettings = (sequence) => {
        const strand1 = [...sequence]
        const strand2 = calculateComplementaryStrand(strand1)

        const ends1 = ['5\'', '3\'']
        const ends2 = ['3\'', '5\'']

        return { strand1, strand2, ends1, ends2 }
    }

    const separateByStrand = (nucleotides) => {

        const strand1 = []
        const strand2 = []

        nucleotides.forEach((n) => {
            const str = n.split('-')[2]

            if (str.includes('1')) {
                strand1.push(n)
            } else {
                strand2.push(n)
            }
        })

        strand1.sort((a, b) => {
            const numA = parseInt(a.split('-')[1]);
            const numB = parseInt(b.split('-')[1]);
            return numB - numA;
        })
        strand2.sort((a, b) => {
            const numA = parseInt(a.split('-')[1]);
            const numB = parseInt(b.split('-')[1]);
            return numA - numB;
        })

        return { strand1, strand2 }

    }

    const checkIfComplementary = (strand1, strand2, seql) => {
        if(strand1.length != strand2.length) {
            return false
        }

        strand1.sort((a, b) => {
            const numA = parseInt(a.split('-')[1]);
            const numB = parseInt(b.split('-')[1]);
            return numB - numA;
        })
        strand2.sort((a, b) => {
            const numA = parseInt(a.split('-')[1]);
            const numB = parseInt(b.split('-')[1]);
            return numA - numB;
        })

        var status = true
        strand1.forEach((n, i) => {
            const n1 = parseInt(n.split('-')[1])
            const n2 = parseInt(strand2[i].split('-')[1])

            var diff = seql - n1

            if ((seql + diff + 1) !== n2) status = false
        })

        return status
    }

    const getNucleotidesList = (nucleotides) => {
        return nucleotides.map((n) => {
            return n.split('-')[0] + '-' + n.split('-')[1]
        }).sort((a, b) => {
            const numA = parseInt(a.split('-')[1]);
            const numB = parseInt(b.split('-')[1]);
            return numA - numB;
        })
    }

    const getNucleotidesIndexes = (nucleotides, s) => {
        return nucleotides.map((n) => {
            return parseInt(n.split('-')[1])
        }).sort((a, b) => s ? a - b : b - a)
    }

    const areConsecutive = (arr) => {
        arr.sort((a, b) => a - b);
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] !== arr[i - 1] + 1) {
                return false;
            }
        }
        return true;
    }

    const checkNucleotides = (nucleotides, seql) => {

        //console.log(nucleotides, seql)

        // 0: trick for when lenght is 0 (unselect)
        if(nucleotides.length === 0) {
            removeBordersFromNucleotides(nucleotides)
            return {
                status: false,
                alert: 'info',
                msg: 'Please select <strong>one or more nucleotides</strong> from the above <strong>interactive sequence</strong>, either clicking them one by one or selecting a group with the mouse.'
            };
        }

        // 1: discard invalid lengths
        const validLengths = [1, 2, 4, 8, 12];
        if (!validLengths.includes(nucleotides.length)) {
            return {
                status: false,
                alert: 'warning',
                msg: '<strong>Invalid sequence length</strong>, you must select <strong>nucleotides individually</strong>, by <strong>base step</strong>, by <strong>base pair</strong>, by <strong>base pair step</strong>, by <strong>tetramers</strong> or by <strong>hexamers</strong>.'
            };
        }

        // 2. single nucleotide (always valid)
        if(nucleotides.length === 1) {
            const n = nucleotides[0].split('-')[0] + '-' + nucleotides[0].split('-')[1];

            return {
                status: true,
                type: 0, // single nucleotide
                nucleotides: [n],
                msg: `Single nucleotide <strong>${n}</strong> selected.`
            };
        }

        // 3. check for base pair / base step 
        if(nucleotides.length === 2) {
            // check if they belong to same strand (base step) or different strands (base pair)
            const { strand1, strand2 } = separateByStrand(nucleotides);
            if(strand1.length === 1 && strand2.length === 1) {
                // if they belong to different strands, check if they are complementary (base pair)
                const checkComp = checkIfComplementary(strand1, strand2, seql);
                
                if(checkComp) {
                    return {
                        status: true,
                        type: 2, // base pair
                        nucleotides: getNucleotidesList(nucleotides),
                        msg: `Base pair <strong>${getNucleotidesList(nucleotides).join(', ')}</strong> selected.`
                    };
                } else {
                    return {
                        status: false,
                        alert: 'warning',
                        msg: '<strong>Invalid base pair</strong>, please be sure to select two <strong>complementary nucleotides</strong> <img src="/img/projects/analyses/curves/base-pair.png" alt="base step" style="vertical-align: middle;" />'
                    };
                }

            } else {
                // if they belong to same strand, check if they are consecutive (base step)
                const nuclIdxs = getNucleotidesIndexes(nucleotides, true)
                if(areConsecutive(nuclIdxs)) {
                    return {
                        status: true,
                        type: 1, // base step
                        nucleotides: getNucleotidesList(nucleotides),
                        msg: `Base step <strong>${getNucleotidesList(nucleotides).join(', ')}</strong> selected.`
                    };
                
                } else {
                    return {
                        status: false,
                        alert: 'warning',
                        msg: '<strong>Invalid base step</strong>, please be sure to select two <strong>consecutive nucleotides</strong> <img src="/img/projects/analyses/curves/base-step.png" alt="base step" style="vertical-align: middle;" />'
                    };
                }
            }
        }

        // 4. check for base pair step 
        if(nucleotides.length === 4) {
            // check that both strands have same length
            const { strand1, strand2 } = separateByStrand(nucleotides);
            if(strand1.length === strand2.length) {

                const checkComp = checkIfComplementary(strand1, strand2, seql);

                const nuclIdxs1 = getNucleotidesIndexes(strand1, true)
                const nuclIdxs2 = getNucleotidesIndexes(strand2, true)

                if(checkComp & areConsecutive(nuclIdxs1) & areConsecutive(nuclIdxs2)) {
                    return {
                        status: true,
                        type: 3, // base pair step
                        nucleotides: getNucleotidesList(nucleotides),
                        msg: `Base pair step <strong>${getNucleotidesList(nucleotides).join(', ')}</strong> selected.`
                    };
                } else {
                    return {
                        status: false,
                        alert: 'warning',
                        msg: '<strong>Invalid base pair step</strong>, please be sure to select two <strong>consecutive pairs of complementary nucleotides</strong> <img src="/img/projects/analyses/curves/base-pair-step.png" alt="base pair step" style="vertical-align: middle;" />'
                    };
                }

            } else {
                return {
                    status: false,
                    alert: 'warning',
                    msg: '<strong>Invalid base pair step</strong>, please be sure to select two <strong>consecutive pairs of complementary nucleotides</strong> <img src="/img/projects/analyses/curves/base-pair-step.png" alt="base pair step" style="vertical-align: middle;" />'
                };
            }
        }

        // 5. check for tetramers
        if(nucleotides.length === 8) {
            // check that both strands have same length
            const { strand1, strand2 } = separateByStrand(nucleotides);
            if(strand1.length === strand2.length) {

                const checkComp = checkIfComplementary(strand1, strand2, seql);

                const nuclIdxs1 = getNucleotidesIndexes(strand1, true)
                const nuclIdxs2 = getNucleotidesIndexes(strand2, true)

                if(checkComp & areConsecutive(nuclIdxs1) & areConsecutive(nuclIdxs2)) {
                    return {
                        status: true,
                        type: 4, // tetramer
                        nucleotides: getNucleotidesList(nucleotides),
                        msg: `Tetramer <strong>${getNucleotidesList(nucleotides).join(', ')}</strong> selected.`
                    };
                } else {
                    return {
                        status: false,
                        alert: 'warning',
                        msg: '<strong>Invalid tetramer</strong>, please be sure to select four <strong>consecutive pairs of complementary nucleotides</strong> <img src="/img/projects/analyses/curves/tetramer.png" alt="tetramer" style="vertical-align: middle;" />'
                    };
                }

            } else {
                return {
                    status: false,
                    alert: 'warning',
                    msg: '<strong>Invalid tetramer</strong>, please be sure to select four <strong>consecutive pairs of complementary nucleotides</strong> <img src="/img/projects/analyses/curves/tetramer.png" alt="tetramer" style="vertical-align: middle;" />'
                };
            }

        }

        // 5. check for hexamers
        if(nucleotides.length === 12) {
            // check that both strands have same length
            const { strand1, strand2 } = separateByStrand(nucleotides);
            if(strand1.length === strand2.length) {

                const checkComp = checkIfComplementary(strand1, strand2, seql);

                const nuclIdxs1 = getNucleotidesIndexes(strand1, true)
                const nuclIdxs2 = getNucleotidesIndexes(strand2, true)

                if(checkComp & areConsecutive(nuclIdxs1) & areConsecutive(nuclIdxs2)) {
                    return {
                        status: true,
                        type: 5, // hexamer
                        nucleotides: getNucleotidesList(nucleotides),
                        msg: `Hexamer <strong>${getNucleotidesList(nucleotides).join(', ')}</strong> selected.`
                    };
                } else {
                    return {
                        status: false,
                        alert: 'warning',
                        msg: '<strong>Invalid hexamer</strong>, please be sure to select four <strong>consecutive pairs of complementary nucleotides</strong> <img src="/img/projects/analyses/curves/hexamer.png" alt="hexamer" style="vertical-align: middle;" />'
                    };
                }

            } else {
                return {
                    status: false,
                    alert: 'warning',
                    msg: '<strong>Invalid hexamer</strong>, please be sure to select four <strong>consecutive pairs of complementary nucleotides</strong> <img src="/img/projects/analyses/curves/hexamer.png" alt="hexamer" style="vertical-align: middle;" />'
                };
            }

        }
    }

    const addBordersToNucleotides = (nucleotides) => {

        if(nucleotides.length === 0) return

        if(nucleotides.length === 1) {
            document.querySelector(`#${nucleotides[0]}`).classList.add('all')
        }

        const { strand1, strand2 } = separateByStrand(nucleotides);

        if(nucleotides.length === 2) {
            if(strand1.length === 1 && strand2.length === 1) {
                document.querySelector(`#${strand1[0]}`).classList.add('top-bp')
                document.querySelector(`#${strand2[0]}`).classList.add('bottom-bp')
            } else{ 
                if(strand1.length === 2) {
                    document.querySelector(`#${strand1[1]}`).classList.add('left-bs')
                    document.querySelector(`#${strand1[0]}`).classList.add('right-bs')
                } else {
                    document.querySelector(`#${strand2[1]}`).classList.add('left-bs')
                    document.querySelector(`#${strand2[0]}`).classList.add('right-bs')
                }
            }
        }

        if(nucleotides.length === 4) {
            document.querySelector(`#${strand1[1]}`).classList.add('top-left-bps')
            document.querySelector(`#${strand1[0]}`).classList.add('top-right-bps')
            document.querySelector(`#${strand2[1]}`).classList.add('bottom-left-bps')
            document.querySelector(`#${strand2[0]}`).classList.add('bottom-right-bps')
        }

        if(nucleotides.length === 8) {
            document.querySelector(`#${strand1[0]}`).classList.add('top-right-bps')
            document.querySelector(`#${strand1[1]}`).classList.add('top-bps')
            document.querySelector(`#${strand1[2]}`).classList.add('top-bps')
            document.querySelector(`#${strand1[3]}`).classList.add('top-left-bps')
            document.querySelector(`#${strand2[0]}`).classList.add('bottom-right-bps')
            document.querySelector(`#${strand2[1]}`).classList.add('bottom-bps')
            document.querySelector(`#${strand2[2]}`).classList.add('bottom-bps')
            document.querySelector(`#${strand2[3]}`).classList.add('bottom-left-bps')
        }

        if(nucleotides.length === 12) {
            document.querySelector(`#${strand1[0]}`).classList.add('top-right-bps')
            document.querySelector(`#${strand1[1]}`).classList.add('top-bps')
            document.querySelector(`#${strand1[2]}`).classList.add('top-bps')
            document.querySelector(`#${strand1[3]}`).classList.add('top-bps')
            document.querySelector(`#${strand1[4]}`).classList.add('top-bps')
            document.querySelector(`#${strand1[5]}`).classList.add('top-left-bps')
            document.querySelector(`#${strand2[0]}`).classList.add('bottom-right-bps')
            document.querySelector(`#${strand2[1]}`).classList.add('bottom-bps')
            document.querySelector(`#${strand2[2]}`).classList.add('bottom-bps')
            document.querySelector(`#${strand2[3]}`).classList.add('bottom-bps')
            document.querySelector(`#${strand2[4]}`).classList.add('bottom-bps')
            document.querySelector(`#${strand2[5]}`).classList.add('bottom-left-bps')
        }

    }

    const removeBordersFromNucleotides = () => {

        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('all'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('top-bp'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('bottom-bp'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('left-bs'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('right-bs'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('top-left-bps'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('top-right-bps'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('bottom-left-bps'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('bottom-right-bps'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('top-bps'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('bottom-bps'))

    }

    return {
        getSequenceSettings,
        checkNucleotides,
        addBordersToNucleotides,
        removeBordersFromNucleotides
    }
}