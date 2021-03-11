import mongoose from "mongoose";

const modelName = "KenoProMax_phien";

const settlementResultSchema = new mongoose.Schema(
    {
        big: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
        odd: { type: Boolean, default: false },
        even: { type: Boolean, default: false },
        gold: { type: Boolean, default: false },
        wood: { type: Boolean, default: false },
        water: { type: Boolean, default: false },
        fire: { type: Boolean, default: false },
        earth: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: { type: [Number], required: true },
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
});

export default mongoose.model(modelName, Schema);
