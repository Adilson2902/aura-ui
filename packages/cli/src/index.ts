#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { diffCommand } from "./commands/diff.js";
import { themeCommand } from "./commands/theme.js";

const program = new Command();

program.name("aura").description("Aura UI CLI — design system 3D (modelo shadcn)").version("0.1.0");

program
  .command("init")
  .description("Cria aura.config.json e injeta tokens + preset")
  .action(initCommand);

program
  .command("add")
  .argument("[components...]", "Componentes do registry (ex: button card card-3d)")
  .option("--all", "Adiciona todos os componentes")
  .action(addCommand);

program
  .command("diff")
  .argument("<component>", "Compara cópia local com registry upstream")
  .action(diffCommand);

program.command("theme").description("Gera overrides de tokens de marca").action(themeCommand);

program.parse();
