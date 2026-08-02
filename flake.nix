{
  description = "wishlist — pinned Prisma schema engine and Postgres for local development";
  # unstable, because it is the channel that carries a Prisma 7 engine.
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        # mise resolves these out of the store and exports the paths into the
        # environment — see .mise/nix-env.sh.
        #
        # v7 talks to the database through a driver adapter, so there is no
        # query engine left to pin; `prisma db push` still shells out to the
        # schema engine, and Prisma publishes no build of it for the
        # linux-nixos target.
        packages = {
          prisma-engines = pkgs.prisma-engines_7;
          postgresql = pkgs.postgresql_17;
        };

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [ bashInteractive postgresql_17 ];
          shellHook = ''
            export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines_7}/bin/schema-engine"
          '';
        };
      });
}
