pipeline {
    agent any

    environment {
        DOCKER_HUB = "srikanth3140"  
        BACKEND_IMAGE = "${DOCKER_HUB}/backend"
        FRONTEND_IMAGE = "${DOCKER_HUB}/frontend"
        TAG = "latest"
    }

    stages {

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    bat 'docker build -t %BACKEND_IMAGE%:%TAG% .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    bat 'docker build -t %FRONTEND_IMAGE%:%TAG% .'
                }
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    bat 'echo %PASSWORD% | docker login -u %USERNAME% --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                bat 'docker push %BACKEND_IMAGE%:%TAG%'
                bat 'docker push %FRONTEND_IMAGE%:%TAG%'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f kubernetes/'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods'
                bat 'kubectl get svc'
            }
        }

        stage('Scaling (Auto Step)') {
            steps {
                bat 'kubectl scale deployment backend --replicas=5'
                bat 'kubectl get pods'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Pipeline Failed!'
        }
    }
}