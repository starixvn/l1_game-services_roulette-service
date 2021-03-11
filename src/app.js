import { Core, Table } from "sc-game-base";

import appConfigs from "./app-configs";
import constants from "./constants";
import gameSettings from "./game-settings";
import { generateResult, getSettlementResult } from "./helpers/result-helper";
import KenoProMaxContainerRegistry from "./kenoProMax-container-registry";

const run = async () => {
    const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult);
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound, constants.resetTotalBets);
    const container = new KenoProMaxContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(container);

    await app.run();
};

run();
