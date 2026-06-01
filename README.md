# BagStore

BagStore is a MERN e-commerce application for luxury bags. It includes a React/Vite frontend, an Express/Mongoose backend, Docker production images, Docker Compose deployment, and a GitHub Actions DevSecOps pipeline.

The deployment setup is environment-driven. You should not edit `docker-compose.yml`, the GitHub Actions workflow, or application code when the AWS host, ports, image name, image tag, database URI, or environment changes.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Zustand |
| Backend | Node.js, Express, Mongoose, JWT, Bcrypt |
| Database | MongoDB Atlas or MongoDB-compatible URI |
| Runtime | Docker, Docker Compose, Nginx frontend container |
| CI/CD | GitHub Actions, DockerHub, AWS Ubuntu over SSH |
| Security | SonarQube/SonarCloud, OWASP Dependency Check, Trivy |

## Repository Layout

```text
.
├── .github/workflows/ci-cd.yml
├── backend/
├── frontend/
├── scripts/validate-env.sh
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .env.deploy.example
└── sonar-project.properties
```

The workflow assumes this directory is the GitHub repository root.

## Environment Files

Use the templates only as documentation:

- `.env.example` is for local development.
- `.env.deploy.example` documents the production deployment values.
- Real `.env` files and `.env.*` files are ignored by Git.

Production deployment values are generated on the AWS server by GitHub Actions from GitHub Secrets and GitHub Variables.

## Required Runtime Variables

These are the variables used by Docker Compose and the application runtime:

| Variable | Purpose | Sensitive |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment, usually `production` | No |
| `APP_PROTOCOL` | Public protocol, usually `http` or `https` | No |
| `AWS_HOST` | EC2 public IP or hostname | Usually no, but stored as a Secret |
| `DOMAIN_NAME` | Optional domain name that points to AWS | No |
| `APP_PORT` | Public frontend port exposed by Docker Compose | No |
| `SERVER_PORT` | Backend container port | No |
| `FRONTEND_URL` | Generated public frontend URL | No |
| `BACKEND_URL` | Generated backend URL reference | No |
| `PUBLIC_API_URL` | Generated public API URL, normally `<FRONTEND_URL>/api` | No |
| `ALLOWED_ORIGINS` | Generated CORS origins | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `DOCKER_IMAGE` | Docker image base, for example `username/bagstore` | No |
| `DOCKER_TAG` | Docker image tag to deploy, for example `latest` | No |

`DOCKER_IMAGE` is a base name. The pipeline builds and deploys:

```text
${DOCKER_IMAGE}-backend:${DOCKER_TAG}
${DOCKER_IMAGE}-frontend:${DOCKER_TAG}
```

## Local Development

Copy the local template:

```bash
cp .env.example .env
```

Run with Docker:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Or run the services separately:

```bash
cd backend
npm install
npm start
```

```bash
cd frontend
npm install
npm run dev
```

For direct Vite development, set `VITE_PUBLIC_API_URL=http://localhost:5000` in `frontend/.env.local` if the frontend needs to call the backend directly instead of using the Docker/Nginx proxy.

Seed data:

```bash
cd backend
npm run data:import
```

Default seeded admin:

```text
admin@craftweave.com / admin123
```

## GitHub Secrets

Go to GitHub repository settings, then **Secrets and variables** > **Actions** > **Secrets**.

Required:

| Secret | Description |
| --- | --- |
| `DOCKERHUB_USERNAME` | DockerHub username used for push and server pull login |
| `DOCKERHUB_TOKEN` | DockerHub access token |
| `AWS_HOST` | AWS EC2 public IP or DNS name |
| `AWS_USER` | SSH user, usually `ubuntu` |
| `AWS_SSH_PRIVATE_KEY` | Private SSH key for the EC2 instance |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret used by the backend |
| `SONAR_TOKEN` | SonarQube/SonarCloud token |

Alternative:

| Secret | Description |
| --- | --- |
| `APP_SECRET` | Can be used instead of `JWT_SECRET`; the workflow maps it to `JWT_SECRET` |

Optional:

| Secret | Description |
| --- | --- |
| `SONAR_HOST_URL` | Required for self-hosted SonarQube. For SonarCloud, use your normal Sonar setup. |

## GitHub Variables

Go to GitHub repository settings, then **Secrets and variables** > **Actions** > **Variables**.

Required:

| Variable | Example | Description |
| --- | --- | --- |
| `APP_PORT` | `80` | Public port for the frontend container |
| `SERVER_PORT` | `5000` | Backend API port inside the backend container |
| `DOCKER_IMAGE` | `your-dockerhub-username/bagstore` | Image base used for backend/frontend images |
| `DOCKER_TAG` | `latest` | Deployment tag |
| `NODE_ENV` | `production` | Runtime environment |

Optional:

| Variable | Example | Description |
| --- | --- | --- |
| `APP_PROTOCOL` | `http` or `https` | Defaults to `http` in the workflow |
| `DOMAIN_NAME` | `www.example.com` | Used instead of `AWS_HOST` for public URLs when set |
| `ALLOWED_ORIGINS_EXTRA` | `https://admin.example.com` | Extra comma-separated CORS origins |
| `DEPLOY_DIR` | `/home/ubuntu/deploy` | AWS directory for `docker-compose.yml`, `.env`, and scripts |
| `SONAR_PROJECT_KEY` | `bagstore` | Overrides the Sonar project key |
| `SONAR_PROJECT_NAME` | `BagStore` | Overrides the Sonar project display name |
| `SONAR_ORGANIZATION` | `your-org` | Required for SonarCloud organization-based projects |

## CI/CD Pipeline

The workflow in `.github/workflows/ci-cd.yml` runs on pull requests and pushes to `main`.

Pull requests:

1. Install frontend and backend dependencies.
2. Run lint scripts if present.
3. Run tests if present.
4. Run SonarQube/SonarCloud scan.
5. Run OWASP Dependency Check.

Push to `main`:

1. Validate required GitHub Secrets and Variables.
2. Install dependencies, lint, and test.
3. Run SonarQube/SonarCloud scan.
4. Run OWASP Dependency Check and fail on CVSS 7 or higher.
5. Build backend and frontend Docker images locally.
6. Run Trivy image scans and fail on high or critical findings.
7. Push Docker images to DockerHub only after scans pass.
8. Upload `docker-compose.yml` and `scripts/validate-env.sh` to AWS.
9. Generate or update `.env` on the AWS server from GitHub Secrets/Variables.
10. Validate the generated `.env`.
11. Pull latest images and restart the app:

```bash
docker compose --env-file .env pull
docker compose --env-file .env up -d --remove-orphans
```

## AWS Ubuntu One-Time Setup

SSH into the server:

```bash
ssh -i your-key.pem ubuntu@your-aws-host
```

Install Docker and the Compose plugin:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker ubuntu
newgrp docker
```

Open only the ports you need:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

After this initial setup, deployment is handled by GitHub Actions.

## Deployment Files on AWS

GitHub Actions creates or updates the deploy directory with:

```text
docker-compose.yml
scripts/validate-env.sh
.env
```

The generated `.env` includes only runtime values required by Docker Compose. It is created with restricted permissions and should not be committed to Git.

## Manual Validation

To validate a local or deployment env file:

```bash
bash scripts/validate-env.sh .env
```

The script checks required variables and validates `APP_PORT` and `SERVER_PORT`.

## Production Compose

`docker-compose.yml` is fully variable-driven. It does not hardcode AWS IPs, public ports, database URLs, DockerHub image names, or secrets.

Run manually on AWS only when needed:

```bash
docker compose --env-file .env pull
docker compose --env-file .env up -d --remove-orphans
docker compose ps
docker compose logs -f
```

## Security Notes

- Never commit real `.env` files.
- Never commit private keys, certificates, MongoDB URIs, JWT secrets, or DockerHub tokens.
- Use GitHub Secrets for sensitive values.
- Use GitHub Variables for non-sensitive deployment settings.
- Rotate `JWT_SECRET`, DockerHub tokens, and SSH keys if they are exposed.
- Prefer a domain name and HTTPS for production traffic.
