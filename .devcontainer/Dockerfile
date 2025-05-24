FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm
ENV PATH="/root/.bun/bin:${PATH}"

ENV TERM=xterm-256color
ENV COLORTERM=truecolor

RUN echo 'export PS1="\[\033[01;33m\][\t]\[\033[00m\] \[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ "' >> ~/.bashrc && \
    echo 'alias ll="ls -la --color=auto"' >> ~/.bashrc && \
    echo 'alias la="ls -A --color=auto"' >> ~/.bashrc && \
    echo 'alias l="ls -CF --color=auto"' >> ~/.bashrc && \
    echo 'export CLICOLOR=1' >> ~/.bashrc

WORKDIR /workspace
