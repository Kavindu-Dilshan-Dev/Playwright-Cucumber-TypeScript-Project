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
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm

                echo 'Source code checked out successfully.'
            }
        }

        stage('Check Node.js and npm') {
            steps {
                sh '''
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                '''
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh '''
                    npx playwright install chromium
                '''
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    if (params.TEST_SUITE == 'smoke') {
                        sh '''
                            npx cucumber-js \
                              --tags "@smoke" \
                              --format progress \
                              --format json:reports/cucumber-report.json
                        '''
                    } else if (params.TEST_SUITE == 'regression') {
                        sh '''
                            npx cucumber-js \
                              --tags "@regression" \
                              --format progress \
                              --format json:reports/cucumber-report.json
                        '''
                    } else {
                        sh '''
                            npx cucumber-js \
                              --format progress \
                              --format json:reports/cucumber-report.json
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                archiveArtifacts(
                    artifacts: 'reports/**/*',
                    allowEmptyArchive: true
                )
            }

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
