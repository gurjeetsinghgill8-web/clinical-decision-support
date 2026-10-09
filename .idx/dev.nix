# Google Project IDX configuration
# Documentation: https://developers.google.com/idx/guides/customize-idx-env

{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05";

  # Packages to install in the workspace environment
  packages = [
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.python311Packages.virtualenv
  ];

  # Environment variables
  env = {
    STREAMLIT_SERVER_PORT = "$PORT";
    STREAMLIT_SERVER_HEADLESS = "true";
  };

  idx = {
    # Extensions from https://open-vsx.org/
    extensions = [
      "ms-python.python"
      "ms-python.debugpy"
    ];

    # Lifecycle hooks
    workspace = {
      # Runs when workspace is created
      onCreate = {
        setup-venv = ''
          python3 -m venv .venv
          source .venv/bin/activate
          pip install --upgrade pip
          pip install -r requirements.txt
        '';
      };
      # Runs every time workspace starts
      onStart = {
        install-deps = ''
          source .venv/bin/activate
          pip install -r requirements.txt
        '';
      };
    };

    # Live Previews inside Google Project IDX
    previews = {
      enable = true;
      previews = {
        web = {
          command = [
            "bash"
            "-c"
            "source .venv/bin/activate && streamlit run streamlit_app.py --server.port $PORT --server.address 0.0.0.0 --server.headless true --server.enableCORS false --server.enableXsrfProtection false"
          ];
          manager = "web";
        };
      };
    };
  };
}
