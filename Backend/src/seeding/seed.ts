import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { UserFactory } from "./user.factory";
import { FormFactory } from "./form.factory";
import { CommentFactory } from "./comments.factory";
import { QuestionsFactory } from "./questions.factory";
import { MainSeeder } from "./main.seeder";
import dbСonfig from "../config/dbСonfig";

const options: DataSourceOptions & SeederOptions = {
    ...dbСonfig(),
    factories: [
        UserFactory,
        QuestionsFactory,
        FormFactory,
        CommentFactory
    ],
    seeds: [MainSeeder]
}

const datasource = new DataSource(options);
datasource.initialize().then(async () => {
    await datasource.synchronize(true);
    await runSeeders(datasource);
    process.exit();
})

