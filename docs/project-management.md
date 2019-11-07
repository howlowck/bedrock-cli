# Project Management

Create and manage components for a Bedrock project.

Usage:

```
spk project [command] [options]
```

Commands:

- [Project Management](#project-management)
  - [Prerequisites](#prerequisites)
  - [Commands](#commands)
    - [init](#init)
    - [create-variable-group](#create-variable-group)

Global options:

```
  -v, --verbose        Enable verbose logging
  -h, --help           Usage information
```

## Prerequisites

An Azure DevOps git repository.

## Commands

### init

Initialize the current working directory as a Bedrock project repository. This
command supports importing a mono-repository with services organized under a
single 'packages' directory.

```
Usage: project init|i [options]

Initialize your spk repository. Will add starter bedrock, maintainers, and azure-pipelines YAML files to your project.

Options:
  -m, --mono-repo                   Initialize this repository as a mono-repo. All directories under `packages` (modifiable with `-d` flag) will be initialized as packages. (default: false)
  -d, --packages-dir <dir>          The directory containing the mono-repo packages. This is a noop if `-m` not set. (default: "packages")
  -r, --default-ring <branch-name>  Specify a default ring; this corresponds to a default branch which you wish to push initial revisions to
  -h, --help                        output usage information
```

**NOTE:**

`-d,--packages-dir` will be ignored if the `-m,--mono-repo` flag is not set. If
there is not a singular package directory, then services can be individually
added with the [`spk service` command](./service-management.md).

### create-variable-group

Create new variable group in Azure DevOps project

#### Command Prerequisites

In addition to an existing
[Azure DevOps project](https://azure.microsoft.com/en-us/services/devops/), to
link secrets from an Azure key vault as variables in Variable Group, you will
need an existing key vault containing your secrets and the Service Principal for
authorization with Azure Key Vault.

1. Use existng or
   [create a service principal either in Azure Portal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal)
   or
   [with Azure CLI](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest).
2. Use existing or
   [create a Azure Container Registry in Azure Portal](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal)
   or
   [with Azure CLI](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli).

```
Usage: service create-variable-group|cvg [options] <variable-group-name>

Create new variable group in Azure DevOps project using the options below. Also sets the azure_devops.variable_grroup item in spk config with the variable group name

Options:
  -r, --registry-name <registry-name>                             The name of the existing Azure Container Registry
  -d, --hld-repo-url <hld-repo-url>                               The high level definition (HLD) git repo url
  -u, --service-principal-id <service-principal-id>               Azure service principal id with `contributor` role in Azure Container Registry"
  -p, --service-principal-password <service-principal-password>   The Azure service principal password
  -t, --tenant                                                    The Azure AD tenant id of service principal
  --org-name <organization-name>                                  Azure DevOps organization name; falls back to azure_devops.org in spk config
  --project <project>                                             Azure DevOps project name; falls back to azure_devops.project in spk config
  --personal-access-token <personal-access-token>                 Azure DevOps Personal access token; falls back to azure_devops.access_token in spk config
  -h, --help                                                      output usage information
```