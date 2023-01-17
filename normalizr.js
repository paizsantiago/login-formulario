const { schema, normalize } = require("normalizr");

const authorSchema = new schema.Entity("authors");
const messageSchema = new schema.Entity("messages",{
    author: authorSchema,
});

const messagesListSchema = new schema.Entity("messagesList",{
    messages: [messageSchema],
});

const normalizeMessages = (array) =>{
    const normalizedInfo = normalize({ id: "HistorialChat", messages: array }, messagesListSchema);
    return normalizedInfo;
}

module.exports = {normalizeMessages};

