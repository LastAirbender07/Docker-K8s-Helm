# Plan (high level)

1. Build and push images to Docker Hub (frontend + backend).
2. Create a Kubernetes namespace for the app in minikube.
3. Create Kubernetes Secrets (DB credentials) and ConfigMaps (runtime config).
4. Deploy Postgres & Redis using either (A) stable Helm charts (recommended) or (B) our own manifests + PVC — I’ll give both options (I recommend Bitnami/official charts for production-like behavior).
5. Deploy backend & frontend as Helm release (ClusterIP services) with env from secrets. Backend talks to Postgres/Redis (ClusterIP). Frontend is served by Nginx ∴ exposed via Ingress.
6. Add NetworkPolicies so: frontend → backend allowed; backend → postgres/redis allowed; other traffic blocked.
7. Enable minikube ingress & set /etc/hosts for local dev host.
8. Test and iterate (kubectl port-forward / logs / helm upgrade).

---

# BEFORE YOU START (pre-reqs)

* Docker logged into Docker Hub (`docker login`).
* Minikube + kubectl + helm installed.
* `minikube` running and has `ingress` addon available (we’ll enable it).
* You already have working Docker images for backend and frontend on Docker Hub (if not, build & push below).
* You are in project root with `frontend/` and `backend/`.

---

# 0 — Build & push images (if not already pushed)

Replace `jayaraj0781` with your Docker Hub user / repo if different.

Backend (from `backend/`):

```bash
# from project root
cd backend
docker build -t jayaraj0781/tasktracker-backend:latest .
docker push jayaraj0781/tasktracker-backend:latest
```

Frontend (from `frontend/`):

```bash
cd ../frontend
# build multi-stage Dockerfile already provided
docker build -t jayaraj0781/tasktracker-frontend:latest .
docker push jayaraj0781/tasktracker-frontend:latest
```

If minikube is configured to use its own docker daemon (optional), you can skip pushing and use local images. But pushing to Docker Hub is simplest and mirrors production.

---

# 1 — Create a Kubernetes namespace for isolation

```bash
kubectl create namespace tasktracker
```

---

# 2 — Install Ingress controller on minikube

```bash
minikube addons enable ingress
# Wait a few seconds, then check:
kubectl get pods -n ingress-nginx
```

(You’ll use an ingress to expose frontend.)

Add a hosts entry so your browser can reach the ingress host:

* Choose a host, e.g. `task.local`
* Add line to `/etc/hosts`:

```
127.0.0.1 task.local
```

(When minikube uses Docker driver the ingress will be reachable via localhost.)

---

# 3 — Option A: Deploy Postgres & Redis via Helm (recommended)

Using Bitnami charts (production-friendly): persistent PVCs, creds via Helm values.

Add repo:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

Install Postgres:

```bash
# create a secret-style password if you want; or let bitnami create one
helm install task-postgres bitnami/postgresql \
  --namespace tasktracker \
  --set auth.username=postgres \
  --set auth.password=supersecretpassword \
  --set auth.database=appdb \
  --set primary.persistence.size=1Gi
```

Install Redis:

```bash
helm install task-redis bitnami/redis \
  --namespace tasktracker \
  --set auth.enabled=false \
  --set usePassword=false \
  --set master.persistence.size=500Mi
```

After this, services will be `task-postgres-postgresql` (or check `kubectl get svc -n tasktracker`) and `task-redis-master`.

> NOTE: If you prefer to deploy your own Postgres manifest with a PVC, I can give that manifest. The Bitnami chart is safer and simpler.

---

# 4 — Prepare Secrets and ConfigMaps for backend (Kubernetes secrets)

We will store DB credentials as a Kubernetes Secret and pass them to backend as env vars.

Create secret using the values you used for Postgres above:

```bash
kubectl -n tasktracker create secret generic tasktracker-db \
  --from-literal=POSTGRES_USER=postgres \
  --from-literal=POSTGRES_PASSWORD=supersecretpassword \
  --from-literal=POSTGRES_DB=appdb
```

(If you used Bitnami chart and it created a password, you can extract it and create secret accordingly.)

Create a configmap for frontend/backedn runtime values if needed:

```bash
kubectl -n tasktracker create configmap tasktracker-config \
  --from-literal=FRONTEND_BASE_URL=http://task.local \
  --from-literal=BACKEND_BASE_URL=http://tasktracker-backend:5001
```

(We’ll wire these into the Helm chart / Deployments as env vars.)

---

# 5 — Helm chart skeleton (app chart)

Create a chart dir `charts/tasktracker` or `helm/tasktracker` locally:

```
helm create tasktracker
```

But I’ll give you the minimal structure and key template snippets to replace default `templates/`. Use this layout:

```
helm/tasktracker/
  Chart.yaml
  values.yaml
  templates/
    backend-deployment.yaml
    backend-service.yaml
    frontend-deployment.yaml
    frontend-service.yaml
    ingress.yaml
    secret.yaml
    networkpolicy-backend.yaml
    networkpolicy-db.yaml
    _helpers.tpl
```

# 6 — Install the Helm chart

From `helm/tasktracker` dir:

```bash
helm upgrade --install tasktracker ./tasktracker -n tasktracker
```

Check resources:

```bash
kubectl get all -n tasktracker
kubectl describe deploy tasktracker-backend -n tasktracker
kubectl logs deployment/tasktracker-backend -n tasktracker
```

Access the frontend:

* Add `127.0.0.1 task.local` to `/etc/hosts` as earlier.
* In browser go to `http://task.local` (Ingress routes to frontend service).
* Frontend will use the internal backend ClusterIP `http://tasktracker-backend:5001` (we set this in env).

---

# 7 — Important production best-practices & checklist

* **Secrets**: Do not put DB passwords in plain `values.yaml`. Use `kubectl create secret` (sealed-secrets for GitOps). I showed creating `tasktracker-db`.
* **ImagePullSecrets**: If using a private registry, create `imagePullSecrets` for your deployment.
* **Resource requests/limits**: set CPU/memory in `values.yaml`.
* **Readiness / Liveness**: set probes (I added /health).
* **PersistentVolumes**: use proper PVs for Postgres (Bitnami chart uses PVC).
* **NetworkPolicy**: ensure CNI supports network policies (minikube’s default CNI does). If your CNI doesn’t, policies will be ignored.
* **TLS**: For ingress in production, enable TLS using cert-manager / Let's Encrypt.
* **RBAC**: Only create RBAC as needed.
* **Monitoring / Logging**: Add Prometheus / Grafana / ELK if desired.
* **Backups**: Backup Postgres volume, use `pg_dump` or Velero for PV backups.
* **Database Migrations**: Use migration tooling (Alembic / add an init job) rather than `Base.metadata.create_all` in runtime; that’s safer in distributed deployments.

---

# 8 — Debugging tips

* `kubectl -n tasktracker get pods,svc,ingress`
* `kubectl -n tasktracker logs deploy/tasktracker-backend`
* `kubectl -n tasktracker exec -it <pod> -- sh` to inspect network connectivity (e.g. `nc -zv task-postgres-postgresql 5432`)
* If frontend can’t reach backend from browser: verify Ingress host is correct, that frontend env `BACKEND_API_URL` points to `http://tasktracker-backend:5001` (frontend container’s env), and that backend is serving on that port.
* Ensure `allow_origins` in backend CORS includes the ingress host (e.g. `http://task.local`) if browser will call backend directly. But in our architecture frontend calls backend using the backend service name only inside cluster; browser uses frontend via ingress and frontend (served by Nginx) makes requests to backend service via cluster DNS only when requests originate from container (if frontend is static JS running in browser, it will call backend URL from browser — so backend CORS must permit the browser origin `http://task.local`). In SPA deployments the browser initiates requests, so **CORS must allow the frontend origin (task.local)**.

  * In other words: add `http://task.local` into FastAPI `origins`.

---

# 9 — Final notes about networking restriction you asked for

* We made Postgres/Redis ClusterIP and allowed backend only to connect via NetworkPolicy. That prevents arbitrary pods from talking to DB.
* We allowed frontend → backend via NetworkPolicy by allowing ingress to backend from frontend pods only.
* The Ingress exposes only frontend to the Internet — backend is not exposed publicly.

---

# Example commands recap (quick run)

```bash
# 1. push images (if needed)
cd backend && docker build -t jayaraj0781/tasktracker-backend:latest . && docker push jayaraj0781/tasktracker-backend:latest
cd ../frontend && docker build -t jayaraj0781/tasktracker-frontend:latest . && docker push jayaraj0781/tasktracker-frontend:latest

# 2. start minikube and ingress
minikube start
minikube addons enable ingress

# 3. create namespace
kubectl create ns tasktracker

# 4. install postgres & redis via Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install task-postgres bitnami/postgresql -n tasktracker \
  --set auth.username=postgres \
  --set auth.password=supersecretpassword \
  --set auth.database=appdb \
  --set primary.persistence.size=1Gi

helm install task-redis bitnami/redis -n tasktracker \
  --set auth.enabled=false --set usePassword=false --set master.persistence.size=500Mi

# 5. create k8s secret
kubectl -n tasktracker create secret generic tasktracker-db \
  --from-literal=POSTGRES_USER=postgres \
  --from-literal=POSTGRES_PASSWORD=supersecretpassword \
  --from-literal=POSTGRES_DB=appdb

# 6. helm deploy your app (chart in helm/tasktracker)
helm upgrade --install tasktracker helm/tasktracker -n tasktracker

# 7. add hosts entry
echo "127.0.0.1 task.local" | sudo tee -a /etc/hosts

# 8. open in browser
http://task.local
```

---

If you want, I’ll:

* generate the full Helm chart files (all templates + `values.yaml`) ready to drop into `helm/tasktracker`, or
* produce the exact `kubectl` manifests instead of using Helm, or
* show how to wire cert-manager for TLS on ingress.

Which of these would you like me to produce next?
