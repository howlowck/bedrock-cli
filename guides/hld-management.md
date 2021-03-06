# HLD - High Level Definition

Initialize a Bedrock HLD (High Level Definition) repository and deploy pipelines
to materalize manifests.

## Requirements

There are a few base assumptions that `bedrock` makes, as this will affect the
set up of pipelines:

1. Both HLD and manifest repositories are within a single Azure DevOps project.
2. The access token being utilized via `bedrock` has access to both
   repositories.
   - [Documentation on how to create a Personal Access Token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops)

Configure Bedrock using the configuration provided in your `.bedrock-config`
file. The configuration section under `azure_devops` _must_ be provided for
Bedrock to properly configure pipelines in your Azure DevOps organization.

An example configuration is as follows:

```
azure_devops:
  access_token: "hpe3a9oiswgcodtfdpzfiek3saxbrh5if1fp673xihgc5ap467a" # This is your Personal Access Token with permission to modify and access this private repo. Leave this empty if project is public
  hld_repository: "https://dev.azure.com/bhnook/fabrikam/_git/hld" # Repository URL for your Bedrock HLDs
  manifest_repository: "https://dev.azure.com/bhnook/fabrikam/_git/materialized" # Repository URL that is configured for flux. This holds the kubernetes manifests that is generated by fabrikate.
  org: "epicstuff" # Your AzDo Org
  project: "fabrikam" # Your AzDo project
```

## Usage

```
bedrock hld [command] [options]
```

## Commands:

- [init](https://microsoft.github.io/bedrock-cli/commands/index.html#hld_init)
- [install-manifest-pipeline](https://microsoft.github.io/bedrock-cli/commands/index.html#hld_install-manifest-pipeline)
- [reconcile](https://microsoft.github.io/bedrock-cli/commands/index.html#hld_reconcile)

## Global options:

```
  -V, --version        output the version number
  -v, --verbose        Enable verbose logging
  -h, --help           Usage information
```
