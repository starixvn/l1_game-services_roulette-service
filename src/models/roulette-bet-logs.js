import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    phien: { type: Number, required: true },
    time: { type: Date, required: true },

    straightUp: { type: Object },
    split: { type: Object },
    street: { type: Object },
    triangle: { type: Object },
    corner: { type: Object },
    fourNumbers: { type: Object },
    line: { type: Object },
    column: { type: Object },
    dozen: { type: Object },
    redBlack: { type: Object },
    oddEven: { type: Object },
    bigSmall: { type: Object },

    memberId: { type: Number },
    siteId: { type: String },
});

export default mongoose.model("Roulette_cuoc", schema);
