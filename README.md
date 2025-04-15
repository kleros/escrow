# Decentralized Escrow

## Development

1. Start the development container in your IDE.
   - It will automatically run `yarn install`.
2. Run `yarn start` to launch the application.

### Notes on development container configuration

- `remoteUser: "node"`

  - The container runs as the `node` user by default for better security. If you encounter permission errors, you can either:
    - Configure the necessary permissions on your system, or
    - Remove `remoteUser: "node"` to run as `root`.

- `runArgs:["--platform=linux/amd64"]`
  - This attempts to run Node 10 on ARM64 machines through AMD64 emulation. If you don't need it, you can remove it.
  - Note that ARM64 compatibility issues may still happen. The project currently works best on AMD64 systems.
