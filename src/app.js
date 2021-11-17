import { Core, Table } from "sc-game-base";

import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { generateResult, getSettlementResult } from "./helpers/result-helper";
import RouletteContainerRegistry from "./roulette-container-registry";

const run = async () => {
    const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult);
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);
    const container = new RouletteContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("Roulette", appConfigs);

    await app.run();
    await app.startGame(container);
};

run();
