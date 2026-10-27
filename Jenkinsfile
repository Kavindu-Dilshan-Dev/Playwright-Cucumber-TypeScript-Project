pipeline {
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
            }
        }
    }

    post {
        always {
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