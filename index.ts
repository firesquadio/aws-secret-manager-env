import * as core from '@actions/core'
import {
  SecretsManagerClient,
  GetSecretValueCommand
} from '@aws-sdk/client-secrets-manager'

// Create Secrets Manager Client
const client = new SecretsManagerClient({})

// Read Inputs
const secret = core.getInput('secret', {required: true })
const json = core.getBooleanInput('json', { required: false, })
const name = core.getInput('name', { required: !json })

// Create Command
const cmd = new GetSecretValueCommand({ SecretId: secret })

const PullFromSecretsManager = async () => {
  try {
    const res = await client.send(cmd)
    return res.SecretString
  } catch (err) {
    core.setFailed(`Failed to get secret ${secret} with error ${err}`)
    throw err
  }
}

const PopulateToEnv =  async (secretValue: string) => {
  core.startGroup('Populate to Environment')
  if (json) {
    core.startGroup('Parse JSON secret')
    try {
      const jsonSecret = JSON.parse(secretValue)
      Object.keys(jsonSecret).forEach(key => {
        core.exportVariable(key, jsonSecret[key])
        core.setSecret(jsonSecret[key])
      })
      
      return
    } catch (err) {
      core.setFailed(`Failed to read secret ${secret} as JSON.`)
      throw err
    } finally {
      core.endGroup()
    }
  }
  
  core.exportVariable(name, secretValue)
  core.setSecret(secretValue)
  core.endGroup()
  return
}

PullFromSecretsManager().then(data => PopulateToEnv(data))