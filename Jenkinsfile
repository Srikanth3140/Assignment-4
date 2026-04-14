pipeline {
    agent { label 'docker' }

    options {
        skipDefaultCheckout(true)
    }

    environment {
        DOCKER_HUB = "srikanth3140"
        BACKEND_IMAGE = "${DOCKER_HUB}/backend"
        FRONTEND_IMAGE = "${DOCKER_HUB}/frontend"
        TAG = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }


        stage('Build  Images') {
            steps {
                    sh 'docker build -t $DOCKER_HUB/frontend-app ./frontend'
                    sh 'docker build -t $DOCKER_HUB/backend-app ./backend'
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
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh 'docker push $BACKEND_IMAGE:$TAG'
                sh 'docker push $FRONTEND_IMAGE:$TAG'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods'
                sh 'kubectl get svc'
            }
        }

        stage('Scaling (Auto Step)') {
            steps {
                sh 'kubectl scale deployment backend --replicas=5'
                sh 'kubectl get pods'
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