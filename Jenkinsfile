pipeline {
    agent any

    environment {
        DOCKER_HUB = "srikanth3140"   // 🔴 change this
        BACKEND_IMAGE = "${DOCKER_HUB}/backend"
        FRONTEND_IMAGE = "${DOCKER_HUB}/frontend"
        TAG = "latest"
    }

    stages {

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $BACKEND_IMAGE:$TAG .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $FRONTEND_IMAGE:$TAG .'
                }
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',  // 🔴 create in Jenkins
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
                sh 'kubectl apply -f kubernetes/'
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