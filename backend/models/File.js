const fileSchema = new mongoose.Schema({
    name: String,
    filePath: String
});

const File = mongoose.model('File', fileSchema);

export {File}