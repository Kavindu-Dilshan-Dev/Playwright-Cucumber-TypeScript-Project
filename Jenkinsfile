pipeline {
    agent {
        docker {
            // Keep in sync with @playwright/test version (see Dockerfile)
            image 'mcr.microsoft.com/playwright:v1.64.1-noble'
            args '--ipc=host -u root'
        }
    }

    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser to run against')
        string(name: 'TAGS', defaultValue: '@smoke', description: 'Cucumber tag expression, e.g. @smoke, @regression, "@pim and not @smoke"')
        string(name: 'PARALLEL', defaultValue: '2', description: 'Number of parallel workers (1 = sequential)')
        string(name: 'BASE_URL', defaultValue: 'https://opensource-demo.orangehrmlive.com', description: 'Application under test')
    }

    environment {
        CI          = 'true'
        HEADLESS    = 'true'
        BROWSER     = "${params.BROWSER}"
        BASE_URL    = "${params.BASE_URL}"
        // Optional: store these as Jenkins "Secret text" credentials instead of defaults
        ADMIN_USERNAME = 'Admin'
        ADMIN_PASSWORD = 'admin123'
        npm_config_cache = "${WORKSPACE}/.npm"
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Type check') {
            steps {
                sh 'npm run typecheck'
            }
        }

        stage('Run tests') {
            steps {
                sh '''
                    mkdir -p reports
                    npx cucumber-js --tags "${TAGS}" --parallel ${PARALLEL}
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true, fingerprint: true

            // Requires the "HTML Publisher" plugin
            publishHTML(target: [
                reportDir: 'reports',
                reportFiles: 'cucumber-report.html',
                reportName: 'Cucumber Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
        }
        cleanup {
            // Container runs as root; reset ownership so the agent can clean the workspace
            sh 'chmod -R a+rwX . || true'
            cleanWs()
        }
    }
}
