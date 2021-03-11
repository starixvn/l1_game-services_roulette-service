import Chance from "chance";
import RandomJs from "random-js";

const { Random, MersenneTwister19937 } = RandomJs;
const chance = new Chance();
const random = new Random(MersenneTwister19937.autoSeed());
const seeds = [...Array(81).keys()].slice(1);

const shuffleThenPickOut20ByChance = () => chance.pickset(seeds, 20);

const random20UniqueNumbersByChance = () => chance.unique(chance.natural, 20, { min: 1, max: 80 });

const shuffleThenPickOut20ByRandomJs = () => random.shuffle([...seeds]).slice(0, 20);

const randomlyPick20NumbersByRandomJs = () => random.sample(seeds, 20);

const algorithms = [
    shuffleThenPickOut20ByChance,
    random20UniqueNumbersByChance,
    shuffleThenPickOut20ByRandomJs,
    randomlyPick20NumbersByRandomJs,
];

const settlementRuleEntries = Object.entries({
    big: (totalPoints) => totalPoints >= 811,
    small: (totalPoints) => totalPoints <= 810,
    odd: (totalPoints) => totalPoints % 2 === 1,
    even: (totalPoints) => totalPoints % 2 === 0,
    gold: (totalPoints) => 210 <= totalPoints && totalPoints <= 695,
    wood: (totalPoints) => 696 <= totalPoints && totalPoints <= 763,
    water: (totalPoints) => 764 <= totalPoints && totalPoints <= 855,
    fire: (totalPoints) => 856 <= totalPoints && totalPoints <= 923,
    earth: (totalPoints) => 924 <= totalPoints && totalPoints <= 1410,
});

export const generateResult = () => {
    const randomSelection = chance.natural({
        min: 0,
        max: algorithms.length - 1,
    });
    let result = algorithms[randomSelection]();

    result.sort((pre, next) => pre - next);

    return result;
};

export const getSettlementResult = (roundResult) => {
    const totalPoints = roundResult.reduce((total, number) => total + number, 0);

    const settlementResult = settlementRuleEntries.reduce((settlementTempResult, [choice, rule]) => {
        settlementTempResult[choice] = rule(totalPoints);

        return settlementTempResult;
    }, {});

    return settlementResult;
};
