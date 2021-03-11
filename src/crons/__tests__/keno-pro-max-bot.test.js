import { stub, stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { Core, Table } from "sc-game-base";
import KenoProMaxBot from "../keno-pro-max-bot";

describe("keno pro max bot test", () => {
    const definition = new Table.TableGameDefinition({ id: 1, name: "game name", durations: { lockingBet: 5 } });
    const gameData = new Table.TableGameData(0);

    /** @type {BaseEventPublisher}*/
    const publisher = stub(Core.BaseEventPublishers);

    /** @type {mongoose.Model}*/
    const userInfosRepository = { find: () => {}, findOne: () => {}, updateOne: () => {}, updateMany: () => {} };

    /** @type {mongoose.Model}*/
    const tempBetsRepository = stubMongooseModelStupidly(mongoose.Model);

    const kenoProMaxBot = new KenoProMaxBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);

    it("inherit TableGameBot", () => {
        expect(kenoProMaxBot instanceof Table.Crons.TableGameBot);
    });

    it("resetAllBotData", () => {
        //arrange
        spyOn(Table.Crons.TableGameBot.prototype, "resetAllBotData");
        spyOn(KenoProMaxBot.prototype, "resetAllBets");

        //act
        kenoProMaxBot.resetAllBotData();

        //assert
        expect(Table.Crons.TableGameBot.prototype.resetAllBotData).toHaveBeenCalled();
        expect(KenoProMaxBot.prototype.resetAllBets).toHaveBeenCalled();
    });

    it("resetAllBets", () => {
        kenoProMaxBot.smallTickets = 4;
        kenoProMaxBot.allBets = {
            big: 3,
            small: 5,
            odd: 2,
            even: 100,
            earth: 35,
            fire: 20,
            gold: 1,
            water: 4,
            wood: 7,
        };

        kenoProMaxBot.resetAllBets();

        expect(kenoProMaxBot.smallTickets).toBe(0);
        expect(kenoProMaxBot.allBets).toEqual({ big: 0, small: 0, odd: 0, even: 0, earth: 0, fire: 0, gold: 0, water: 0, wood: 0 });
    });

    it("getBetChoice", () => {
        const bot = { id: 1, name: "bot1", red: 1000, type: true, choices: [] };

        kenoProMaxBot.allBets = {
            big: 3,
            small: 5,
            odd: 2,
            even: 100,
            earth: 35,
            fire: 20,
            gold: 1,
            water: 4,
            wood: 7,
        };

        const actualResult = kenoProMaxBot.getBetChoice(bot);
        const isValidBetChoice = ["big", "small", "odd", "even", "gold", "wood", "water", "fire", "earth"].includes(actualResult);

        expect(isValidBetChoice).toBe(true);
    });
});
