{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell { nativeBuildInputs = [ pkgs.git pkgs.nodejs_24 pkgs.pnpm_9 ]; }
