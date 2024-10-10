import fs from 'fs';
import OpenAI from "openai";

const openai = new OpenAI({
    organization: "org-QzC3X88MGfKIRzS5xHcJdfVA",
    project: "proj_gPug8qLgigtULQDCWQyQH4j1",
    apiKey: "KeyHere"
});

async function ProcessaiFile() {
    try {
        let assistant = await openai.beta.assistants.create({
            name: "Study Engine",
            instructions: "You are a Teacher. Use your knowledge base to help.",
            model: "gpt-3.5-turbo",
            tools: [{ type: "file_search" }],
        });
        console.log(assistant);
        const UploadFile = await openai.files.create({
            file: fs.createReadStream("./backend/uploads/The Calculus Lifesaver All the Tools You Need to Excel at Calculus-26-49.pdf"),
            purpose: "assistants"
        });
        console.log(UploadFile);
        const thread = await openai.beta.threads.create({
            messages: [
                {
                    role: "user",
                    content: "Create 10 questions followed by 4 potential answers from the document. In the format of multiple choice questions. The answers should be in the format of A, B, C, D. The correct answer should be in the format of (Correct Answer: A).",
                    attachments: [{ file_id: UploadFile.id, tools: [{ type: "file_search" }] }],
                },
            ],
        })
        console.log(thread);
        console.log(thread.tool_resources?.file_search);
        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant.id,
        });
        console.log(run);
        const messages = await openai.beta.threads.messages.list(thread.id, {
            run_id: run.id,
        });
        console.log(messages)
    }
    catch (err) {
        console.error('Error processing file:', err);
    }
}

export default ProcessaiFile;