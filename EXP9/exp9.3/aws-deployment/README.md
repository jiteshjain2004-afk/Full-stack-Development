# Experiment 9.3 — AWS Deployment with Load Balancing

## Architecture
```
Internet → ALB (2 AZs) → ECS Fargate Tasks (private subnets)
                              ↕ Auto Scaling (2–4 tasks)
                          ECR (Docker images)
                          CloudWatch (logs)
```

## Files
```
aws-deployment/
├── terraform/
│   ├── main.tf          ← VPC, ALB, ECS, Auto Scaling
│   ├── variables.tf     ← All configurable values
│   ├── outputs.tf       ← ALB URL, ECR URL, etc.
│   └── terraform.tfvars ← Environment config
├── app/
│   ├── Dockerfile       ← Multi-stage build
│   ├── nginx/nginx.conf ← Production Nginx
│   └── src/App.js       ← AWS architecture visualizer
└── .github/workflows/
    └── aws-deploy.yml   ← CI/CD: ECR push + ECS deploy
```

## Terraform Commands
```bash
cd terraform
terraform init
terraform plan
terraform apply
terraform destroy   # cleanup
```

## GitHub Secrets Required
| Secret | Description |
|--------|-------------|
| AWS_ACCESS_KEY_ID | IAM user access key |
| AWS_SECRET_ACCESS_KEY | IAM user secret key |

## Objectives Covered
1. ✅ VPC with 2 public + 2 private subnets across 2 AZs
2. ✅ Auto Scaling Group (min:2, max:4) based on CPU/Memory
3. ✅ ECS Fargate cluster with task definitions
4. ✅ Application Load Balancer with health checks
5. ✅ CI/CD pipeline — ECR push + ECS rolling deploy
