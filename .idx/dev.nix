
{ pkgs, ... }: {
  # Use the stable channel for reproducibility.
  channel = "stable-24.05";

  # A list of packages to install from the specified channel.
  # You can search for packages on the NixOS package search:
  # https://search.nixos.org/packages
  packages = [
  pkgs.nodejs_20
  pkgs.nodePackages.prisma
  pkgs.openssl # এটি নতুন যোগ করুন
];

  # VS Code extensions to install from the Open VSX Registry.
  # https://open-vsx.org/
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
    ];

    # Workspace lifecycle hooks.
    workspace = {
      # Runs when a workspace is first created.
      onCreate = {
        npm-install = "npm install";
      };

      # Runs every time the workspace is (re)started.
      # We will use this hook to load environment variables from the .env file.
      onStart = {
        load-env = ''
          if [ -f .env ]; then
            set -a
            source .env
            set +a
          fi
        '';
      };
    };
  };
}
