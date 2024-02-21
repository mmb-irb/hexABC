// navigation for settings module
export default function common() {

  const ions = ['LI', 'NA', 'K', 'CL', 'MG', 'MN', 'ZN']

  const interpolateColor = (value, minValue, maxValue) => {
    const red = 255;
    const green = 255 - Math.round(255 * (value - minValue) / (maxValue - minValue));
    const blue = 51;
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  }

  const calculateDistance = (position1, position2) => {
    return Math.sqrt(
      Math.pow(position1[0] - position2[0], 2) +
      Math.pow(position1[1] - position2[1], 2) +
      Math.pow(position1[2] - position2[2], 2)
    );
  }

  const findClosestAtom = (structureComponent, position) => {
    let closestAtom = null;
    var closestDistance = Number.MAX_VALUE;

    var pos = position.toArray();

    // Iterate through all atoms in the structure
    structureComponent.structure.eachAtom((atom) => {
      if(ions.indexOf(atom.element) === -1) {
        var atomPosition = atom.positionToArray();
        var d = calculateDistance(atomPosition, pos);

        // Check if the current atom is closer than the previously closest atom
        if (d < closestDistance) {
          closestDistance = d;
          //closestAtom = atom.positionToArray()
          closestAtom = atom.index
        }
      }
    });

    return closestAtom;
  }

  return {
    interpolateColor,
    findClosestAtom
  }
}