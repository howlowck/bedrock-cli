import commander from "commander";
import {
  addNewRing,
  fileInfo as bedrockFileInfo,
  read as loadBedrockFile,
} from "../../lib/bedrockYaml";
import { build as buildCmd, exit as exitCmd } from "../../lib/commandBuilder";
import { BEDROCK_FILENAME } from "../../lib/constants";
import { updateTriggerBranchesForServiceBuildAndUpdatePipeline } from "../../lib/fileutils";
import * as dns from "../../lib/net/dns";
import { hasValue } from "../../lib/validator";
import { logger } from "../../logger";
import { BedrockFile, BedrockFileInfo } from "../../types";
import decorator from "./create.decorator.json";
import { build as buildError, log as logError } from "../../lib/errorBuilder";
import { errorStatusCode } from "../../lib/errorStatusCode";

export interface CommandOptions {
  targetBranch: string;
}

/**
 * Check for bedrock.yaml
 *
 * @param projectPath project path
 * @param ringName name of ring
 */
export const checkDependencies = (
  projectPath: string,
  ringName: string
): void => {
  const fileInfo: BedrockFileInfo = bedrockFileInfo(projectPath);
  if (fileInfo.exist === false) {
    throw buildError(
      errorStatusCode.VALIDATION_ERR,
      "ring-create-cmd-err-dependency"
    );
  }

  // Check if ring already exists, if it does, warn and exit
  const bedrockFile: BedrockFile = loadBedrockFile(projectPath);
  if (ringName in bedrockFile.rings) {
    throw buildError(errorStatusCode.EXE_FLOW_ERR, {
      errorKey: "ring-create-cmd-err-ring-exists",
      values: [ringName, BEDROCK_FILENAME],
    });
  }
};

/**
 * Executes the command.
 *
 * @param ringName
 * @param projectPath
 */
export const execute = async (
  ringName: string,
  projectPath: string,
  opts: CommandOptions,
  exitFn: (status: number) => Promise<void>
): Promise<void> => {
  try {
    if (!hasValue(ringName)) {
      throw buildError(
        errorStatusCode.VALIDATION_ERR,
        "ring-create-cmd-err-name-missing"
      );
    }

    logger.info(`Project path: ${projectPath}`);

    dns.assertIsValid("<ring-name>", ringName);

    // target-branch falls back to ringName
    const targetBranch = opts.targetBranch || ringName;
    // only do assertion on targetBranch if user provided
    if (opts.targetBranch) {
      dns.assertIsValid("<target-branch>", targetBranch);
    }

    checkDependencies(projectPath, ringName);

    // Add ring to bedrock.yaml
    addNewRing(projectPath, ringName, { targetBranch });
    // Add ring to all linked service build pipelines' branch triggers
    const bedrockFile: BedrockFile = loadBedrockFile(projectPath);

    const ringBranches = Object.entries(bedrockFile.rings).map(
      ([ring, config]) => config.targetBranch || ring
    );
    logger.info(`Updated project rings: ${ringBranches}`);

    const servicePathDirectories = bedrockFile.services.map(
      (service) => service.path
    );

    for (const dir of servicePathDirectories) {
      updateTriggerBranchesForServiceBuildAndUpdatePipeline(ringBranches, dir);
    }

    logger.info(`Successfully created ring: ${ringName} for this project!`);
    await exitFn(0);
  } catch (err) {
    logError(
      // cannot include ring name in error message because it may not be defined.
      buildError(errorStatusCode.CMD_EXE_ERR, "ring-create-cmd-failed", err)
    );
    await exitFn(1);
  }
};

export const commandDecorator = (command: commander.Command): void => {
  buildCmd(command, decorator).action(
    async (ringName: string, opts: CommandOptions) => {
      await execute(ringName, process.cwd(), opts, async (status: number) => {
        await exitCmd(logger, process.exit, status);
      });
    }
  );
};
