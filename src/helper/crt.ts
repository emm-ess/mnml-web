// chinese remainder theorem
// taken from: https://rosettacode.org/wiki/Chinese_remainder_theorem#JavaScript
// i cheated. it was chatgpt.

function extendedGCD(a: number, b: number): {gcd: number; x: number; y: number} {
    if (b === 0) {
        return {gcd: a, x: 1, y: 0}
    }
    const {gcd, x, y} = extendedGCD(b, a % b)
    return {gcd, x: y, y: x - Math.floor(a / b) * y}
}

// Solve a single congruence equation of the form x ≡ remainder1 (mod modulus1)
// and x ≡ remainder2 (mod modulus2)
function solveTwoCongruences(
    remainder1: number,
    modulus1: number,
    remainder2: number,
    modulus2: number,
): {solution: number; combinedModulus: number} | null {
    const {gcd, x} = extendedGCD(modulus1, modulus2)
    if ((remainder2 - remainder1) % gcd !== 0) return null // No solution exists

    const combinedModulus = (modulus1 * modulus2) / gcd
    const adjustedSolution = (remainder1 + ((x * (remainder2 - remainder1)) / gcd) * modulus1) % combinedModulus

    return {
        solution: (adjustedSolution + combinedModulus) % combinedModulus,
        combinedModulus,
    }
}

// Solve a system of congruences using a generalized CRT approach
export function generalizedCrt(remainders: number[], moduli: number[]): number | null {
    if (remainders.length !== moduli.length) {
        throw new RangeError('lengths have to be equal')
    }

    let currentSolution = remainders[0]
    let currentModulus = moduli[0]

    for (let i = 1; i < remainders.length; i++) {
        const result = solveTwoCongruences(currentSolution, currentModulus, remainders[i], moduli[i])
        if (!result) {
            return null
        }
        currentSolution = result.solution
        currentModulus = result.combinedModulus
    }

    return currentSolution
}
