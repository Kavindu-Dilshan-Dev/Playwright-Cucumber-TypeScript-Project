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
            description: 'Select the test suite to execute'
        )

        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Run Playwright in headless mode'
        )
    }

    environment {
        CI = 'true'
        NODE_ENV = 'test'
        TEST_IMAGE = 'playwright-cucumber-tests:v1'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo 'Source code checked out successfully.'
            }
        }

        stage('Check Docker') {
            steps {
                sh '''
                    docker --version
                    docker info
                '''
            }
        }

        stage('Build Playwright Test Image') {
            steps {
                sh '''
                    docker build -t "$TEST_IMAGE" .
                '''
            }
        }

        stage('Execute Tests') {
            steps {
                sh '''
                    mkdir -p reports
                '''

                script {
                    def tagArgument = ''

                    if (params.TEST_SUITE == 'smoke') {
                        tagArgument = '--tags "@smoke"'
                    } else if (params.TEST_SUITE == 'regression') {
                        tagArgument = '--tags "@regression"'
                    }

                    withEnv(["CUCUMBER_TAG_ARGUMENT=${tagArgument}"]) {
                        sh '''
                            docker run --rm \
                              -e CI=true \
                              -e NODE_ENV=test \
                              -e HEADLESS="${HEADLESS}" \
                              -v "$WORKSPACE/reports:/app/reports" \
                              "$TEST_IMAGE" \
                              sh -c 'npx cucumber-js ${CUCUMBER_TAG_ARGUMENT} --format progress --format json:reports/cucumber-report.json'
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

            echo 'Test execution completed. Check the build console and archived reports.'
        }

        success {
            echo 'All selected tests passed.'
        }

        failure {
            echo 'Test execution failed. Review the Jenkins console output and test reports.'
        }

        cleanup {
            echo 'Jenkins pipeline cleanup completed.'
        }
    }
}