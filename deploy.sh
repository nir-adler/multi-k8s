docker build -t dogliy/multi-client:latest -t dogliy/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t dogliy/multi-backend:latest -t dogliy/multi-backend:$SHA -f ./backend/Dockerfile ./backend
docker build -t dogliy/multi-worker:latest -t dogliy/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push dogliy/multi-client:latest
docker push dogliy/multi-backend:latest
docker push dogliy/multi-worker:latest

docker push dogliy/multi-client:$SHA
docker push dogliy/multi-backend:$SHA
docker push dogliy/multi-worker:$SHA

kubectl apply -f./k8s
kubectl set image deployments/backend-deployment backend=dogliy/multi-backend:$SHA
kubectl set image deployments/client-deployment client=dogliy/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=dogliy/multi-worker:$SHA