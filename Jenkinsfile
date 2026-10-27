pipeline {
<<<<<<< HEAD
    agent any

    options {
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(
            numToKeepStr: '20',
            artifactNumToKeepStr: '10'
        ))
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'smoke', 'regression'],
            description: 'Select the test suite'
        )

        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Run tests in headless mode'
        )
    }

    environment {
        CI = 'true'
        TEST_IMAGE = 'playwright-cucumber-tests:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t "$TEST_IMAGE" .'
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    def tagArgs = ''

                    if (params.TEST_SUITE == 'smoke') {
                        tagArgs = '--tags "@smoke"'
                    } else if (params.TEST_SUITE == 'regression') {
                        tagArgs = '--tags "@regression"'
                    }

                    sh 'mkdir -p reports'

                    withEnv(["CUCUMBER_TAG_ARGS=${tagArgs}"]) {
                        sh '''
                            docker run --rm \
                              -e CI=true \
                              -e HEADLESS="${HEADLESS}" \
                              -v "$WORKSPACE/reports:/app/reports" \
                              "$TEST_IMAGE" \
                              sh -c '
                                npx cucumber-js \
                                  $CUCUMBER_TAG_ARGS \
                                  --format progress \
                                  --format html:reports/cucumber-report.html \
                                  --format json:reports/cucumber-report.json
                              '
                        '''
                    }
                }
=======
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
>>>>>>> b9b574e0d7387c49b863bbb9737c28d6f036780d
            }
        }
    }

    post {
        always {
<<<<<<< HEAD
            archiveArtifacts(
                artifacts: 'reports/**/*',
                allowEmptyArchive: true
            )

            echo 'Check the archived HTML and JSON reports.'
        }

        success {
            echo 'Test execution passed.'
        }

        failure {
            echo 'Tests failed or pipeline execution encountered an error.'
        }
    }
}
=======
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
>>>>>>> b9b574e0d7387c49b863bbb9737c28d6f036780d
