import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { githubRoutes } from "./routes/github/index.js";
import { WebhookEvent } from "@octokit/webhooks-types";
import { isProjectsV2ItemEvent } from "./model/webhook.js";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const PORT = process.env.PORT || 4000;

express()
  .use(cors())
  .use(express.json())
  .use("/github", githubRoutes)
  .get("/", (_, res) => {
    res.send("Bem-vindo!");
  })
  .post("/webhook", (req, res) => {
    console.log('[POST] /webhook')

    const webhookEvent = (req.body as WebhookEvent)
    if (!isProjectsV2ItemEvent(webhookEvent)) {
      console.log('Event is not a ProjectsV2ItemEvent')
      return
    }
    
    // 1. identificar cada tipo de evento e chamar o handler
    /**
     principais: ProjectsV2ItemCreatedEvent, ProjectsV2ItemEditedEvent
     outros: ProjectsV2ItemArchivedEvent, ProjectsV2ItemReorderedEvent, ProjectsV2ItemConvertedEvent, ProjectsV2ItemRestoredEvent, ProjectsV2ItemDeletedEvent
     */
    // 2. para eventos de edição, identificar o que foi alterado
    /**
     * pelo jeito precisa usar a api (
         The project item itself. To find more information about the project item, you can use `node_id` (the node ID of the project item) and `project_node_id` (the node ID of the project) to query information in the GraphQL API. For more information, see "[Using the API to manage projects](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/using-the-api-to-manage-projects)."
       )
     * event::field_value::field_node_id
     * event::item::content_node_id
     */
    // 3. chamar endpoint da aplicação para atualizar o banco de dados

    res.send("Wellcome, webhook!")
  })
  .get("/webhook", (req, res) => {
    console.log('[GET] /webhook')
    res.send("Wellcome, webhook!")
  })
  .listen(PORT, () => {
    console.log(`Servidor rodando na ${HOSTNAME}:${PORT}`);
  });
