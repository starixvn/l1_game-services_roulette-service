import { stub } from "jest-micro-auto-stub";
import { Core, Table } from "sc-game-base";

import KenoProMaxPlaceBetConsumer from "../keno-pro-max-place-bet-consumer";

describe("KenoProMaxPlaceBetConsumer test", () => {
    const definition = new Table.TableGameDefinition({ id: 1, name: "keno-pro-max" });
    const gameData = new Table.TableGameData();
    const publisher = stub(Core.BaseEventPublishers.BaseEventPublisher);
    const consumer = new KenoProMaxPlaceBetConsumer(definition, gameData, publisher);

    it("inherit PlaceBetConsumer", () => {
        expect(consumer instanceof Core.BaseEventConsumers.PlaceBetConsumer);
    });
});

describe("BettingTimeValidation test", () => {
    const gameDefinition = new Core.GameDefinition({
        durations: {
            placingBets: 30,
            lockingBet: 5,
            shakeThePlateDuration: 3,
        },
    });
    const publisher = stub(Core.BaseEventPublishers.BaseEventPublisher);

    it("valid bet, bet on betting time and gameConfig enabled true", () => {
        const gameData = new Table.TableGameData(20);
        gameData.gameConfigs = {
            enabled: true,
        };

        const consumer = new KenoProMaxPlaceBetConsumer(gameDefinition, gameData, publisher);
        const actualResult = consumer.composeBettingTimeValidationCriteria();
        const anyFailure = actualResult.some((validation) => validation.failure);

        expect(anyFailure).toBe(false);
    });

    it("invalid bet, gameConfig enabled fail", () => {
        const gameData = new Table.TableGameData(20);
        gameData.gameConfigs = {
            enabled: false,
        };

        const consumer = new KenoProMaxPlaceBetConsumer(gameDefinition, gameData, publisher);
        const actualResult = consumer.composeBettingTimeValidationCriteria();

        expect(actualResult[0].failure).toBe(true);
    });

    it("invalid bet, place bet on shaking time", () => {
        const gameData = new Table.TableGameData(31);
        gameData.gameConfigs = {
            enabled: true,
        };

        const consumer = new KenoProMaxPlaceBetConsumer(gameDefinition, gameData, publisher);
        const actualResult = consumer.composeBettingTimeValidationCriteria();

        expect(actualResult[1].failure).toBe(true);
    });

    it("invalid bet, place bet on waiting time", () => {
        const gameData = new Table.TableGameData(34);
        gameData.gameConfigs = {
            enabled: true,
        };

        const consumer = new KenoProMaxPlaceBetConsumer(gameDefinition, gameData, publisher);
        const actualResult = consumer.composeBettingTimeValidationCriteria();

        expect(actualResult[2].failure).toBe(true);
    });
});
