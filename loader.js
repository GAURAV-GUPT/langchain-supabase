import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const loader = new DirectoryLoader("./data", {
  ".pdf": (path) => new PDFLoader(path, { splitPages: true }),
  ".json": (path) => new JSONLoader(path, "/texts"),
  ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
  ".txt": (path) => new TextLoader(path),
  ".csv": (path) => new CSVLoader(path, "text"),
});
const docs = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
  separators: ["\n\n", "\n", " ", ""], // default setting
});

const docOutput = await splitter.splitDocuments(docs);

const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;
const openAIApiKey = process.env.OPENAI_API_KEY;
console.log(sbUrl);

const client = createClient(sbUrl, sbApiKey);

// await SupabaseVectorStore.fromDocuments(
//   docOutput,
//   new OpenAIEmbeddings({ openAIApiKey }),
//   {
//     client,
//     tableName: "documents",
//   }
// );
console.log("completed....");
// console.log(docOutput);
