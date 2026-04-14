pipeline {
    agent { label 'docker' }
    options {
        skipDefaultCheckout(true)
    }

    environment {
        DOCKER_HUB = "srikanth3140"  
        EC2_IP = "54.91.14.137"
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


        stage('Build Backend Image') {
            steps {
                
                    sh 'docker build -t %BACKEND_IMAGE%:%TAG%'
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
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh 'docker push $DOCKER_HUB/frontend-app'
                sh 'docker push $DOCKER_HUB/backend-app'
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
    

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Pipeline Failed!'
        }
    }
}