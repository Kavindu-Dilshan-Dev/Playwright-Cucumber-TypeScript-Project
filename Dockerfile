FROM jenkins/jenkins:lts

USER root

# Install Node.js, npm, Git, and supporting packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        nodejs \
        npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify installations
RUN node --version && \
    npm --version && \
    git --version

# Switch back to the Jenkins user
USER jenkins