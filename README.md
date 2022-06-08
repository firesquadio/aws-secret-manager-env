# aws-secret-manager-env

This will load your secrets from the AWS Secret Manager into the environment of github actions.

## How to use.

On your action, put:

```yml
- name: Pull Secrets
  uses: firesquadio/aws-secret-manager-env@v1
  with:
    json: true
    secret: "your-secret"
```

Params is:

- `json`: True if the secret is json, and we parse it, false to just load it as a string.
- `secret`: The name of the secret.
