import RoulettePlaceBetConsumer from "../roulette-place-bet-consumer";
import { Table } from "sc-game-base";
import constants from "../../constants";
import gameSettings from "../../game-settings";
import { generateResult, getSettlementResult } from "../../helpers/result-helper";

const gameConfigs = {
    enabled: true,
    minbet: 1,
    maxbet: 2000,
    choices_maxbet: {
        straightUp: 200,
        split: 400,
        street: 600,
        triangle: 600,
        corner: 800,
        fourNumbers: 800,
        line: 1000,
        column: 2000,
        dozen: 2000,
        redBlack: 2000,
        oddEven: 2000,
        bigSmall: 2000,
    },
};

function initPlaceBetConsumer(definition, gameData) {
    return new RoulettePlaceBetConsumer(definition, gameData);
}

describe("composeBetChoiceValidationCriteria", () => {
    const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult);
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound, constants.resetTotalBets);

    it("invalid bet type - should return true", () => {
        const consumer = initPlaceBetConsumer(definition, gameData);
        const result = consumer.composeBetChoiceValidationCriteria({ straightUps: { 3: 1 } });
        expect(result[0].failure).toBeTrue();
    });

    it("invalid bet choice - should return true", () => {
        const consumer = initPlaceBetConsumer(definition, gameData);
        const result = consumer.composeBetChoiceValidationCriteria({ straightUp: { 38: 1 } });
        expect(result[0].failure).toBeTrue();
    });

    it("valid bet choice - should return false", () => {
        const consumer = initPlaceBetConsumer(definition, gameData);
        const result = consumer.composeBetChoiceValidationCriteria({ straightUp: { 2: 1 } });
        expect(result[0].failure).toBeFalse();
    });
});

describe("adjustBetTracks test", () => {
    const testCases = [
        [{}, { betChoices: { straightUp: { 20: 10 } } }, { straightUp: { 20: 10 } }],
        [{ bigSmall: { big: 10 } }, { betChoices: { straightUp: { 20: 10 } } }, { straightUp: { 20: 10 }, bigSmall: { big: 10 } }],
        [{ bigSmall: { big: 10 } }, { betChoices: { bigSmall: { big: 10 } } }, { bigSmall: { big: 20 } }],
    ];

    it.each(testCases)("should update betTracks correctly", (betTracks, bet, expectedBetTracks) => {
        const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult);
        const gameData = new Table.TableGameData(gameSettings.durations.wholeRound, constants.resetTotalBets);
        gameData.ingame.player = {
            betTracks,
        };
        const consumer = initPlaceBetConsumer(definition, gameData);

        consumer.adjustBetTracks("player", bet);
        expect(betTracks).toEqual(expectedBetTracks);
    });
});
