{
  description = "wishlist — pinned Prisma engines and Postgres for local development";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        # mise resolves these out of the store and exports the paths into the
        # environment — see .mise/nix-env.sh. Prisma publishes no engine for the
        # linux-nixos binary target, so the nixpkgs build is the only one that
        # runs here.
        packages = {
          prisma-engines = pkgs.prisma-engines;
          postgresql = pkgs.postgresql_17;
        };

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [ bashInteractive openssl postgresql_17 ];
          shellHook = with pkgs; ''
            export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
            export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
            export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
            export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
          '';
        };
      });
}
