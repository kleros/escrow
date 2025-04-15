# Decentralized Escrow

## Development

1. Start the development container in your IDE.
   - It will automatically run `yarn install`.
2. Run `yarn start` to launch the application.

### Notes on development container configuration

- The container runs as the `node` user by default for improved security. If you encounter permission errors, you can either:

  - Configure the necessary permissions on your system, or
  - Remove `remoteUser: "node"` to run as `root`.

- If running into ARM64 related issues, you can try to uncomment the `runArgs:["--platform=linux/amd64"]` line.
